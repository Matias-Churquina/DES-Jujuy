import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTheme, toggleTheme } from '@/lib/theme';
import Icon from '@/components/Icon';

const LOCALIDADES = ['San Salvador', 'Perico', 'El Carmen', 'Palpalá', 'Humahuaca', 'La Quiaca'];

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());
  const [codigo, setCodigo] = useState('');

  const onToggle = () => { toggleTheme(); setTheme(getTheme()); };
  const rastrear = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(codigo.trim() ? `/track/${codigo.trim()}` : '/track');
  };

  return (
    <div className="landing">
      {/* NAV */}
      <header className="landing-nav">
        <div className="logo">
          <div className="logo-mark"><span>D</span></div>
          <div><strong>DES</strong><small>Destino Express</small></div>
        </div>
        <nav className="landing-links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#paqueteria">Paquetería</a>
          <a href="#cobertura">Cobertura</a>
          <a href="#remiserias">Para remiserías</a>
        </nav>
        <div className="landing-nav-actions">
          <button className="icon-button" onClick={onToggle} aria-label="Cambiar tema">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
          <Link to="/login" className="primary-button landing-cta-nav">Ingresar</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">VIAJES Y ENVÍOS EN JUJUY</span>
          <h1>Tu remis, tus paquetes,<br /><em>en Jujuy.</em></h1>
          <p className="hero-sub">
            Reservá tu próximo viaje, seguí al chofer en vivo o enviá un paquete
            a cualquier punto de la provincia. Todo desde un mismo lugar.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="primary-button">Reservar un viaje <Icon name="arrow" size={15} /></Link>
            <Link to="/track" className="secondary-button"><Icon name="package" size={15} /> Rastrear un paquete</Link>
          </div>
        </div>

        <div className="hero-map card">
          <svg className="hero-route" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M40 260 C110 240 140 180 190 160 S300 110 360 60" fill="none"
              stroke="var(--primary)" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
          </svg>
          <div className="hero-eta">
            <span>LLEGADA ESTIMADA</span>
            <strong>14:32 · 8 min</strong>
            <i className="live"><i />En vivo</i>
          </div>
          <div className="hero-pin hero-pin-car"><Icon name="car" size={20} /><small>DES · EN VIAJE</small></div>
          <div className="hero-pin hero-pin-pkg"><Icon name="package" size={15} /><small>DES-2481</small></div>
          <div className="hero-chip hero-chip-origen">San Salvador</div>
          <div className="hero-chip hero-chip-medio">Palpalá</div>
          <div className="hero-chip hero-chip-destino">Perico</div>
          <div className="hero-toast"><Icon name="check" size={15} /><div><strong>Paquete recibido</strong><span>Viajando a Perico</span></div></div>
        </div>
      </section>

      <div className="landing-trust">
        <span>VIAJÁ TRANQUILO CON</span>
        <div><Icon name="pin" size={15} /> GPS en tiempo real</div>
        <div><Icon name="check" size={15} /> Choferes verificados</div>
        <div><Icon name="wallet" size={15} /> Pagos seguros</div>
        <div><Icon name="package" size={15} /> Envíos trazables</div>
      </div>

      {/* PASOS */}
      <section className="landing-section" id="como-funciona">
        <span className="eyebrow">SIMPLE, COMO DEBE SER</span>
        <h2>Tu próximo viaje, en tres pasos</h2>
        <p className="section-sub">Sin llamadas, sin esperas y con toda la información antes de subir.</p>
        <div className="steps-grid">
          {[
            ['pin', '01', 'Elegí tu destino', 'Decinos desde dónde salís y a qué localidad de Jujuy vas.'],
            ['calendar', '02', 'Reservá y pagá', 'Elegí el horario, tus asientos y cómo preferís pagar.'],
            ['route', '03', 'Seguí en vivo', 'Mirá dónde está tu chofer y recibí alertas hasta llegar.'],
          ].map(([icon, n, t, d]) => (
            <div className="step-card card" key={n}>
              <div className="step-icon"><Icon name={icon as string} /></div>
              <span className="step-num">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAQUETERÍA */}
      <section className="landing-section landing-split" id="paqueteria">
        <div className="ticket-mock card">
          <div className="ticket-head">
            <div className="logo-mark" style={{ width: 30, height: 30, fontSize: 13 }}><span>D</span></div>
            <div><small>ENVÍO DES</small><strong>DES-2481</strong></div>
            <span className="badge violet"><span className="badge-dot" />EN TRÁNSITO</span>
          </div>
          <div className="ticket-route">
            <span>ORIGEN</span><strong>San Salvador de Jujuy</strong>
            <span>DESTINO</span><strong>Perico</strong>
          </div>
          <div className="ticket-progress"><i /><i className="on" /><i /></div>
          <div className="ticket-labels"><span>Recibido</span><span>En tránsito</span><span>Entregado</span></div>
        </div>
        <div className="split-copy">
          <span className="eyebrow" style={{ color: 'var(--success)' }}>PAQUETERÍA DES</span>
          <h2>Mandalo por DES.<br />Seguilo desde donde estés.</h2>
          <p className="section-sub">
            Cada envío tiene su propio código y posición GPS. Compartilo con quien
            recibe y sigan juntos cada etapa, sin crear una cuenta.
          </p>
          <ul className="feature-list">
            <li><Icon name="check" size={15} /><div><strong>Tracking en tiempo real</strong><span>Ubicación y estado actualizados en cada parada.</span></div></li>
            <li><Icon name="check" size={15} /><div><strong>Entrega con comprobante</strong><span>Fecha, hora y persona que recibió tu paquete.</span></div></li>
            <li><Icon name="check" size={15} /><div><strong>Prioridad a tu medida</strong><span>Normal, urgente o frágil. Vos elegís.</span></div></li>
          </ul>
          <form className="track-input" onSubmit={rastrear}>
            <Icon name="package" size={16} />
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ingresá tu código DES-XXXX" />
            <button className="primary-button" type="submit">Rastrear <Icon name="arrow" size={14} /></button>
          </form>
          <small className="track-hint">No necesitás tener sesión para rastrear.</small>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="landing-section landing-split" id="cobertura">
        <div className="split-copy">
          <span className="eyebrow" style={{ color: 'var(--warning)' }}>DESDE LA CAPITAL A LA QUEBRADA</span>
          <h2>Jujuy entero,<br />más cerca.</h2>
          <p className="section-sub">
            Conectamos las localidades que mueven la provincia, con salidas
            frecuentes y remiserías locales que conocen cada camino.
          </p>
          <div className="chips">
            {LOCALIDADES.map((l) => <span key={l} className="chip"><Icon name="pin" size={11} />{l}</span>)}
          </div>
        </div>
        <div className="cerros card">
          <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="cerros-svg">
            <path d="M0 240 L60 140 L110 200 L160 110 L220 190 L280 90 L340 170 L400 120 L400 240 Z" fill="rgb(160 100 60 / 0.28)" />
            <path d="M0 240 L50 180 L120 220 L180 150 L250 215 L310 160 L400 200 L400 240 Z" fill="rgb(120 70 40 / 0.4)" />
            <path d="M40 215 C120 190 180 150 230 120 S320 70 365 35" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
          </svg>
          <div className="cerros-pin" style={{ left: '10%', bottom: '8%' }}><Icon name="pin" size={11} />San Salvador</div>
          <div className="cerros-pin" style={{ left: '42%', bottom: '38%' }}><Icon name="pin" size={11} />Perico</div>
          <div className="cerros-pin" style={{ left: '62%', bottom: '58%' }}><Icon name="pin" size={11} />Humahuaca</div>
          <div className="cerros-pin" style={{ left: '80%', bottom: '82%' }}><Icon name="pin" size={11} />La Quiaca</div>
        </div>
      </section>

      {/* REMISERÍAS */}
      <section className="landing-section landing-split" id="remiserias">
        <div className="split-copy">
          <span className="eyebrow">PARA REMISERÍAS</span>
          <h2>Tu flota, bajo control.<br />Tu negocio, creciendo.</h2>
          <p className="section-sub">
            Un panel completo para gestionar choferes, viajes, recaudación y
            paquetes en tiempo real. Cada remisería con su operación, sus datos y su equipo.
          </p>
          <ul className="feature-grid">
            <li><Icon name="car" /><strong>Flota en vivo</strong><span>Ubicación y estado de cada móvil.</span></li>
            <li><Icon name="chart" /><strong>Métricas claras</strong><span>Ingresos, ocupación y rendimiento.</span></li>
            <li><Icon name="users" /><strong>Multi-remisería</strong><span>Cada empresa con sus datos y su equipo.</span></li>
            <li><Icon name="package" /><strong>Paquetería</strong><span>Recepción y asignación de envíos.</span></li>
          </ul>
          <a href="mailto:demo@credere.dev" className="primary-button landing-demo">Solicitar una demo <Icon name="arrow" size={15} /></a>
        </div>
        <div className="dash-mock card">
          <div className="dash-mock-kpis">
            {['Choferes activos', 'Viajes hoy', 'Ingresos'].map((k) => (
              <div className="kpi" key={k}><span>{k}</span><strong>—</strong></div>
            ))}
          </div>
          <div className="dash-mock-map">
            <svg viewBox="0 0 400 160" preserveAspectRatio="none">
              <path d="M20 140 C100 110 150 90 200 80 S330 50 385 25" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
            </svg>
            <div className="dash-car" style={{ left: '20%', top: '60%' }}><Icon name="car" size={14} /></div>
            <div className="dash-car" style={{ left: '55%', top: '38%' }}><Icon name="car" size={14} /></div>
            <div className="dash-car amber" style={{ left: '75%', top: '52%' }}><Icon name="car" size={14} /></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <span className="eyebrow" style={{ color: 'rgb(255 255 255 / .8)' }}>JUJUY SE MUEVE CON DES</span>
        <h2>Tu próximo destino<br />está más cerca.</h2>
        <p>Reservá en minutos. Viajá con tranquilidad.</p>
        <Link to="/login" className="cta-button">Reservar mi viaje <Icon name="arrow" size={15} /></Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-mark"><span>D</span></div>
            <div><strong>DES</strong><small>Destino Express</small></div>
          </div>
          <p>Movemos personas, paquetes y oportunidades por todo Jujuy.</p>
        </div>
        <div className="footer-cols">
          <div><strong>Plataforma</strong><a href="#como-funciona">Cómo funciona</a><a href="#paqueteria">Paquetería</a><a href="#cobertura">Cobertura</a></div>
          <div><strong>Compañía</strong><a href="#remiserias">Para remiserías</a><Link to="/track">Rastrear envío</Link><Link to="/login">Ingresar</Link></div>
          <div><strong>Ayuda</strong><a href="mailto:soporte@credere.dev">Contactar soporte</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 DES — Destino Express Service · Desarrollado por <strong>Credere.Dev</strong></span>
          <span>Hecho con orgullo en Jujuy, Argentina</span>
        </div>
      </footer>
    </div>
  );
}
