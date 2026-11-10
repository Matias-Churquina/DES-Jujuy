import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import {
  Reserva,
  PagoEstado,
  ReservaEstado,
} from '../reservas/entities/reserva.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);
  private client: MercadoPagoConfig;

  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    private configService: ConfigService,
    private websocketGateway: WebsocketGateway,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>(
        'MERCADOPAGO_ACCESS_TOKEN',
        '',
      ),
    });
  }

  /**
   * Crea una preferencia de Checkout Pro para una reserva.
   * Devuelve el init_point para redirigir al pasajero a pagar.
   */
  async crearPreferencia(idReserva: number): Promise<{ initPoint: string }> {
    const reserva = await this.reservaRepository.findOne({
      where: { idReserva },
      relations: ['viaje', 'viaje.origen', 'viaje.destino'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    if (reserva.estadoReserva !== ReservaEstado.CONFIRMADA) {
      throw new BadRequestException('La reserva no está confirmada');
    }
    if (reserva.estadoPago === PagoEstado.PAGADO) {
      throw new BadRequestException('La reserva ya está pagada');
    }

    const frontend = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const webhook = this.configService.get<string>(
      'MERCADOPAGO_WEBHOOK_URL',
      'http://localhost:3000/api/pagos/webhook',
    );

    const preference = new Preference(this.client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: `reserva-${idReserva}`,
            title: `Viaje ${reserva.viaje?.origen?.nombre ?? ''} → ${reserva.viaje?.destino?.nombre ?? ''}`,
            description: `${reserva.cantidadAsientos} asiento(s) — DES`,
            quantity: 1,
            unit_price: Number(reserva.importeTotal),
            currency_id: 'ARS',
          },
        ],
        external_reference: String(idReserva),
        back_urls: {
          success: `${frontend}/pasajero/reservas?pago=ok`,
          failure: `${frontend}/pasajero/reservas?pago=error`,
          pending: `${frontend}/pasajero/reservas?pago=pendiente`,
        },
        notification_url: webhook,
        statement_descriptor: 'DES REMISES',
      },
    });

    return { initPoint: result.init_point! };
  }

  /**
   * Webhook IPN de MercadoPago. Formatos soportados:
   *  - Nuevo: body { type: 'payment', data: { id } }
   *  - Legacy: query ?topic=payment&id=123
   */
  async procesarNotificacion(body: any, query: any): Promise<void> {
    try {
      const type = body?.type ?? query?.topic;
      const paymentId =
        body?.data?.id ?? query?.id ?? query?.['data.id'] ?? null;

      if (type !== 'payment' || !paymentId) return; // ignorar otros eventos

      const payment = new Payment(this.client);
      const pago = await payment.get({ id: Number(paymentId) });

      const idReserva = Number(pago.external_reference);
      if (!idReserva) return;

      const reserva = await this.reservaRepository.findOne({
        where: { idReserva },
      });
      if (!reserva) return;

      if (
        pago.status === 'approved' &&
        reserva.estadoPago !== PagoEstado.PAGADO
      ) {
        reserva.estadoPago = PagoEstado.PAGADO;
        reserva.fechaPago = new Date();
        reserva.codigoPagoMercadoPago = String(paymentId);
        await this.reservaRepository.save(reserva);

        this.websocketGateway.emitToRoom(
          `reserva_${idReserva}`,
          `pago_confirmado_reserva_${idReserva}`,
          { idReserva, estadoPago: PagoEstado.PAGADO, paymentId },
        );
        this.websocketGateway.emitToRoom(
          `viaje_${reserva.idViaje}`,
          'pago_confirmado',
          { idReserva, idViaje: reserva.idViaje, estadoPago: PagoEstado.PAGADO },
        );
        this.logger.log(
          `Reserva ${idReserva} marcada PAGADA (payment ${paymentId})`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error procesando webhook MP: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
