import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "./Icono.jsx";


const DESTINOS = {
  descubrir: "#descubrir",
  planes: "#planes",
  paraArtistas: "#para-artistas",
  ayuda: "#ayuda",
};
const ICONOS_ENLACE = {
  descubrir: "descubrir",
  planes: "planes",
  paraArtistas: "artistas",
  ayuda: "ayuda",
};

//navbar es hijo de main
const Navbar = ({ textos, cargando, error, recargar, idioma, activo, onBuscar, textoGrande, alternarTexto, cambiarIdioma}) => {
  
  //propiedades que pasa el padre a la hija
  const [abierto, setAbierto] = useState(false); // Saber si el toogle de mobile esta abierto
  const [busqueda, setBusqueda] = useState(""); //Sin valor a buscar
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  
  const abrir =
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces?.invitado ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  //Abrir y cerrar el menu toogle en vista mobile
  useEffect(() => {
    function cerrarConEscape(evento) {
      if (!abierto) return; //Unicamnete se registre el listener mientras el menu este abierto
      if (evento.key === "Escape" && abierto) { //siempre y cuando el menu esté abierto y presione la tecla "Escape"
        setAbierto(false); // Cierra el menu
        botonMenu.current?.focus(); // devuelve el foco al boton del menu
      }
    }
    document.addEventListener("keydown", cerrarConEscape); //Escucha las teclas en todo el documento
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  // Campo para buscar cualquier palabra o frase dentro de nuestro sitio
  function abrirBusqueda(evento) {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault(); // cancelar la accion que el navegador haria por defecto antes ese evento
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }



  return (
    <header className="navbar">
      <nav
        className="contenedor navbar-interior"
        aria-label={nav?.aria?.navegacion ?? "Navegación principal"}
      >
        <a
          href="#inicio"
          className="navbar-marca"
          aria-label={nav?.logo?.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <span className="navbar-simbolo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 9v6m5-10v14m5-10v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
          <span>{nav?.logo?.texto ?? "Sintonía"}</span>
        </a>

        {/* Acciones del navbar movil */}
        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador?.placeholder ?? (ingles ? "Search" : "Buscar")}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>
          {nav && <a className="navbar-movil-ingresar" href="#ingresar" onClick={() => setAbierto(false)}>{nav.botones.invitado.ingresar}</a>}
          <button
            type="button"
            ref={botonMenu}
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div id="navbar-panel" className={`navbar-panel${abierto ? " is-abierto" : ""}`} aria-busy={cargando}>
          {cargando && <p className="navbar-estado" role="status">{ingles ? "Loading navigation…" : "Cargando navegación…"}</p>}
          {error && <div className="navbar-estado" role="alert"><p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p><button type="button" onClick={recargar}>{ingles ? "Try again" : "Reintentar"}</button></div>}
          {nav && <>
            <ul className="navbar-enlaces">
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a href={DESTINOS[clave]} aria-current={activo === DESTINOS[clave].slice(1) ? "page" : undefined} onClick={() => setAbierto(false)}><span className="navbar-enlace-icono" aria-hidden="true"><Icono nombre={ICONOS_ENLACE[clave]} /></span>{etiqueta}</a></li>)}
            </ul>
            <form className="navbar-buscador" role="search" aria-label={nav.buscador.placeholder} onSubmit={buscar}>
              <button type="submit" aria-label={nav.buscador.placeholder}><Icono nombre="buscar" /></button>
              <input ref={campoBusqueda} type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={nav.buscador.placeholder} aria-label={nav.buscador.placeholder} required />
            </form>
          </>}
          <div className="navbar-utilidades">
            <label className="navbar-idioma"><Icono nombre="idioma" /><select value={idioma} onChange={(evento) => cambiarIdioma(evento.target.value)} aria-label={nav?.aria?.idioma ?? "Cambiar idioma"}><option value="es">ES</option><option value="en">EN</option></select></label>
            <button className="navbar-icono navbar-accesibilidad" type="button" aria-label={nav?.aria?.accesibilidad ?? (ingles ? "Enlarge text" : "Aumentar texto")} aria-pressed={textoGrande} onClick={alternarTexto}><Icono nombre="accesibilidad" /></button>
            {nav && <div className="navbar-cuenta">
              <a className="navbar-ingresar" href="#ingresar" onClick={() => setAbierto(false)}>{nav.botones.invitado.ingresar}</a>
              <a className="navbar-accion" href="#registro" onClick={() => setAbierto(false)}>{nav.botones.invitado.crearCuenta}</a>
            </div>}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar