const TRAZOS = {
  buscar: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  cerrar: <path d="m6 6 12 12M6 18 18 6" />,
  favoritos: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  idioma: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" /></>,
  accesibilidad: <><circle cx="12" cy="4" r="2" /><path d="M4 8h16M12 6v8m0 0-4 7m4-7 4 7" /></>,
  descubrir: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></>,
  planes: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  artistas: <><circle cx="9" cy="8" r="4" /><path d="M3 21v-2a6 6 0 0 1 12 0v2m2-13h4m-2-2v4" /></>,
  ojo: <><path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>,
  ojoCerrado: <><path d="M10.6 5.6A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.4 3.2M6.6 6.7C3.9 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.9 0 3.5-.6 4.9-1.5M9.9 9.9a2.8 2.8 0 0 0 4 4M3 3l18 18" /></>,
  alerta: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></>,
  exito: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" /></>,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  atras: <path d="m15 5-7 7 7 7" />,
  ayuda: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1 .9-1.8 1.2-1.8 2.7M12 17h.01" /></>,
};

export default function Icono({ nombre }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{TRAZOS[nombre]}</svg>;
}
