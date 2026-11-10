import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/Toast';
import Icon from '@/components/Icon';

interface Mensaje {
  idMensaje: number;
  idReserva: number;
  idEmisor: number;
  idReceptor: number;
  texto: string;
  leido: boolean;
  createdAt: string;
}

interface Props {
  idReserva: number;
  titulo: string;
  onClose: () => void;
}

export default function ChatWidget({ idReserva, titulo, onClose }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const idUsuario = user?.idUsuario;
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<Mensaje[]>(`/chat/reserva/${idReserva}`)
      .then((r) => setMensajes(r.data))
      .catch(() => toast('error', 'No se pudo cargar el chat'));
    api.patch(`/chat/reserva/${idReserva}/leer`).catch(() => {});

    const socket = getSocket();
    const onMensaje = (m: Mensaje) => {
      if (m.idReserva !== idReserva) return;
      setMensajes((prev) =>
        prev.some((x) => x.idMensaje === m.idMensaje) ? prev : [...prev, m],
      );
      if (m.idReceptor === idUsuario) {
        api.patch(`/chat/reserva/${idReserva}/leer`).catch(() => {});
      }
    };
    socket.emit('join', { userId: idUsuario, type: 'reserva', id: idReserva });
    socket.on('mensaje_nuevo', onMensaje);
    return () => {
      socket.emit('leave', { type: 'reserva', id: idReserva });
      socket.off('mensaje_nuevo', onMensaje);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idReserva]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    try {
      const { data } = await api.post<Mensaje>(`/chat/reserva/${idReserva}`, { texto: t });
      setMensajes((prev) =>
        prev.some((x) => x.idMensaje === data.idMensaje) ? prev : [...prev, data],
      );
      setTexto('');
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo enviar el mensaje');
    }
  };

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="card confirm-card chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-head" style={{ marginBottom: 4 }}>
          <strong>{titulo}</strong>
          <button onClick={onClose} style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>

        <div className="chat-modal-scroll">
          {mensajes.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 10, marginTop: 14, textAlign: 'center' }}>
              Todavía no hay mensajes. Escribí el primero.
            </p>
          )}
          {mensajes.map((m) => (
            <div key={m.idMensaje} className={`message ${m.idEmisor === idUsuario ? 'sent' : ''}`}>
              {m.texto}
              <small>
                {new Date(m.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                {m.idEmisor === idUsuario && (m.leido ? ' ✓✓' : ' ✓')}
              </small>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="chat-input" onSubmit={enviar}>
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí un mensaje…"
            maxLength={1000}
            autoFocus
          />
          <button type="submit" aria-label="Enviar"><Icon name="send" size={15} /></button>
        </form>
      </div>
    </div>
  );
}
