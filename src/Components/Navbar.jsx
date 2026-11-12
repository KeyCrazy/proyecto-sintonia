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

const Navbar = ({ textos, cargando, error, recargar, idiomas, estadoIdiomas, reintentarIdiomas, idioma, activo, accesibilidadAbierta, abrirAccesibilidad, botonAccesibilidadRef, cambiarIdioma }) => {
  const [abierto, setAbierto] = useState(false); // Saber si el toogle de mobile esta abierto
  const botonMenu = useRef(null);
  const nav = textos?.navbar;
  const estados = textos?.estados;
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
        aria-label={nav?.aria?.navegacion}
      >
        <a
          href="/#inicio"
          className="navbar-marca"
          aria-label={nav?.logo?.aria}
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
            aria-label={abierto ? textos?.menuMovil?.cerrar : textos?.menuMovil?.abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div id="navbar-panel" className={`navbar-panel${abierto ? " is-abierto" : ""}`} aria-busy={cargando}>
          {cargando && estados?.cargando && <p className="navbar-estado" role="status">{estados.cargando.aria}</p>}
          {error && estados?.error && (
            <div className="navbar-estado" role="alert">
              <p>{estados.error.descripcion}</p>
              <button type="button" onClick={recargar}>{estados.error.botones.reintentar}</button>
            </div>
          )}
          {nav && (
            <ul className="navbar-enlaces">
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
            </ul>
          )}
          <div className="navbar-utilidades">
            <div className="navbar-preferencia navbar-preferencia-idioma">
              {estadoIdiomas === "error" && estados?.error ? (
                <div className="navbar-estado" role="alert">
                  <p>{estados.error.descripcion}</p>
                  <button type="button" onClick={reintentarIdiomas}>
                    {estados.error.botones.reintentar}
                  </button>
                </div>
              ) : (
                <LanguageSelector
                  idiomas={idiomas}
                  idioma={idioma}
                  cambiarIdioma={cambiarIdioma}
                  etiqueta={nav?.aria?.idioma}
                  etiquetas={textos?.idioma?.codigos ?? {}}
                  nombres={textos?.idioma?.opciones ?? {}}
                  disabled={estadoIdiomas !== "listo"}
                  className="navbar-idioma"
                />
              )}
            </div>
            <button
              ref={botonAccesibilidadRef}
              className="navbar-icono navbar-accesibilidad"
              type="button"
              aria-label={nav?.aria?.accesibilidad}
              aria-haspopup="dialog"
              aria-expanded={accesibilidadAbierta}
              aria-controls="panel-accesibilidad"
              onClick={() => {
                setAbierto(false);
                abrirAccesibilidad();
              }}
            >
              <span>{textos?.menuMovil?.secciones?.accesibilidad}</span>
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