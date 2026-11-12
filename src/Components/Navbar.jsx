import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.svg";
import Icono from "./Icono.jsx";
import Button from "./base/Button.jsx";
import LanguageSelector from "./base/LanguageSelector.jsx";


const DESTINOS = {
  inicio: "/#inicio",
  catalogo: "/catalogo",
};

const Navbar = ({ textos, cargando, error, recargar, idioma, activo, accesibilidadAbierta, abrirAccesibilidad, botonAccesibilidadRef, cambiarIdioma }) => {
  const [abierto, setAbierto] = useState(false); // Saber si el toogle de mobile esta abierto
  const botonMenu = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";

  const abrir =
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(([clave]) => DESTINOS[clave]);

  //Abrir y cerrar el menu toogle en vista mobile
  useEffect(() => {
    if (!abierto) return undefined;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

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

  return (
    <header className="navbar">
      <nav
        className="contenedor navbar-interior"
        aria-label={nav?.aria?.navegacion ?? "Navegación principal"}
      >
        <a
          href="/#inicio"
          className="navbar-marca"
          aria-label={nav?.logo?.aria ?? "Sintonía, ir al inicio"}
          onClick={() => setAbierto(false)}
        >
          <img src={logo} alt="" />
        </a>

        {/* Acciones del navbar movil */}
        <div className="navbar-movil-acciones">
          {nav && (
            <a className="navbar-movil-ingresar" href="/#ingresar">
              {nav.botones.invitado.ingresar}
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
          {nav && (
            <ul className="navbar-enlaces">
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
            </ul>
          )}
          <div className="navbar-utilidades">
            <div className="navbar-preferencia navbar-preferencia-idioma">
              <LanguageSelector
                idioma={idioma}
                cambiarIdioma={cambiarIdioma}
                etiqueta={nav?.aria?.idioma ?? "Cambiar idioma"}
                className="navbar-idioma"
              />
            </div>
            <button
              ref={botonAccesibilidadRef}
              className="navbar-icono navbar-accesibilidad"
              type="button"
              aria-label={nav?.aria?.accesibilidad ?? (ingles ? "Accessibility options" : "Opciones de accesibilidad")}
              aria-haspopup="dialog"
              aria-expanded={accesibilidadAbierta}
              aria-controls="panel-accesibilidad"
              onClick={() => {
                setAbierto(false);
                abrirAccesibilidad();
              }}
            >
              <span>{textos?.menuMovil?.secciones?.accesibilidad ?? (ingles ? "Accessibility" : "Accesibilidad")}</span>
              <span className="navbar-accesibilidad-icono">
                <Icono nombre="accesibilidad" />
              </span>
            </button>
            {nav && <div className="navbar-cuenta">
              <a className="navbar-ingresar" href="/#ingresar" onClick={() => setAbierto(false)}>{nav.botones.invitado.ingresar}</a>
              <Button
                href="/#registro"
                className="navbar-accion"
                onClick={() => setAbierto(false)}
              >
                {nav.botones.invitado.crearCuenta}
              </Button>
            </div>}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar