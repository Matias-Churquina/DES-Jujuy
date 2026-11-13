import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import Icon from '@/components/Icon';
import ChatWidget from '@/components/ChatWidget';

interface Conversacion {
  idReserva: number;
  estadoReserva: string;
  otroUsuario: { nombre: string; apellido: string } | null;
  viaje: { origen?: string; destino?: string } | null;
  ultimoMensaje: { texto: string; createdAt: string } | null;
  noLeidos: number;
}

const POLL_MS = 12000;

export default function ChatInbox() {
  const [abierto, setAbierto] = useState(false);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [chatReserva, setChatReserva] = useState<number | null>(null);
  const [chatTitulo, setChatTitulo] = useState('');

  const cargar = () => {
    api.get<Conversacion[]>('/chat/conversaciones')
      .then((r) => setConversaciones(r.data))
      .catch(() => {});
  };

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, POLL_MS);
    const socket = getSocket();
    const onMensaje = () => cargar();
    socket.on('mensaje_nuevo', onMensaje);
    return () => {
      clearInterval(t);
      socket.off('mensaje_nuevo', onMensaje);
    };
  }, []);

  const totalNoLeidos = conversaciones.reduce((a, c) => a + c.noLeidos, 0);

  const abrirChat = (c: Conversacion) => {
    setChatReserva(c.idReserva);
    const nombre = c.otroUsuario
      ? `${c.otroUsuario.nombre} ${c.otroUsuario.apellido}`
      : `Reserva #${c.idReserva}`;
    const ruta = c.viaje?.origen && c.viaje?.destino
      ? ` — ${c.viaje.origen} → ${c.viaje.destino}`
      : '';
    setChatTitulo(nombre + ruta);
    setAbierto(false);
  };

  const cerrarChat = () => {
    setChatReserva(null);
    cargar();
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setAbierto(!abierto)}
        aria-label="Mensajes"
      >
        <Icon name="message" size={24} />
        {totalNoLeidos > 0 && (
          <span className="chat-fab-badge">{totalNoLeidos}</span>
        )}
      </button>

      {abierto && (
        <div className="chat-inbox card">
          <div className="chat-inbox-head">
            <strong>Mensajes</strong>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar">
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="chat-inbox-list">
            {conversaciones.length === 0 && (
              <p className="chat-inbox-empty">
                Todavía no tenés conversaciones. Cuando un pasajero reserve,
                vas a poder escribirle desde acá.
              </p>
            )}
            {conversaciones.map((c) => (
              <button
                key={c.idReserva}
                className="chat-conv"
                onClick={() => abrirChat(c)}
              >
                <span className="chat-conv-avatar">
                  {(c.otroUsuario?.nombre?.[0] || '?').toUpperCase()}
                </span>
                <span className="chat-conv-body">
                  <span className="chat-conv-name">
                    {c.otroUsuario
                      ? `${c.otroUsuario.nombre} ${c.otroUsuario.apellido}`
                      : `Reserva #${c.idReserva}`}
                  </span>
                  {c.viaje?.origen && c.viaje?.destino && (
                    <span className="chat-conv-route">
                      {c.viaje.origen} → {c.viaje.destino}
                    </span>
                  )}
                  <span className="chat-conv-preview">
                    {c.ultimoMensaje
                      ? c.ultimoMensaje.texto
                      : 'Sin mensajes — escribí el primero'}
                  </span>
                </span>
                {c.noLeidos > 0 && (
                  <span className="chat-conv-badge">{c.noLeidos}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {chatReserva && (
        <ChatWidget
          idReserva={chatReserva}
          titulo={chatTitulo}
          onClose={cerrarChat}
        />
      )}
    </>
  );
}
