import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "./Icono.jsx";


const DESTINOS = {
  inicio: "#inicio", //pongo /inicio para ir a otra landing
  heroes: "#heroes",
  marvel: "#marvel",
  dc: "#dc",
  equipos: "#equipos",
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
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menu"); //si está en ingles muestra "open menu" si no "abrir menu"
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menu"); //la misma logica en cerrar
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
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
        aria-label={nav?.aria?.menu ?? "Navegación principal"}
      >
        <a
          href="#inicio"
          className="navbar-marca"
          aria-label={nav?.logo?.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <span className="navbar-simbolo" aria-hidden="true">
            H
          </span>
          <span>{nav?.logo?.texto ?? "Héroes"}</span>
        </a>

        {/* Acciones del navbar movil */}
        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador?.aria ?? "Buscar"}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>
          {/* Seccion de favoritos */}
          {nav && (
            <a
              className="navbar-icono"
              href="#favoritos"
              aria-label={nav.botones.favoritos}
              onClick={() => setAbierto(false)}
            >
              <Icono nombre="favoritos" />
            </a>
          )}
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
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
            </ul>
            <form className="navbar-buscador" role="search" aria-label={nav.buscador.aria} onSubmit={buscar}>
              <button type="submit" aria-label={nav.buscador.boton}><Icono nombre="buscar" /></button>
              <input ref={campoBusqueda} type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={nav.buscador.placeholder} aria-label={nav.buscador.aria} required />
            </form>
          </>}
          <div className="navbar-utilidades">
            <label className="navbar-idioma"><Icono nombre="idioma" /><select value={idioma} onChange={(evento) => cambiarIdioma(evento.target.value)} aria-label={nav?.aria?.idioma ?? "Cambiar idioma"}><option value="es">ES</option><option value="en">EN</option></select></label>
            <button className="navbar-icono navbar-accesibilidad" type="button" aria-label={ingles ? "Enlarge text" : "Aumentar texto"} aria-pressed={textoGrande} onClick={alternarTexto}><Icono nombre="accesibilidad" /></button>
            {nav && <a className="navbar-accion" href="#favoritos" onClick={() => setAbierto(false)}>{nav.botones.favoritos}</a>}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar