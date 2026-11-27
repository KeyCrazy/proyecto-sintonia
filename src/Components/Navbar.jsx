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

// "portada/1" (color que manda la API) -> var(--portada-1)
function colorDeToken(color) {
  return typeof color === "string" && color.includes("/") ? `var(--${color.replace("/", "-")})` : undefined;
}

// Avatar de la persona con sesión (Figma: «Botón · Cuenta», 40 × 40 con sus iniciales).
// Es decorativo: el nombre siempre aparece escrito al lado o en la etiqueta del botón.
function Avatar({ usuario, className = "" }) {
  return (
    <span
      className={`navbar-avatar cuerpo-p-fuerte ${className}`.trim()}
      style={{ "--color-avatar": colorDeToken(usuario.color) }}
      aria-hidden="true"
    >
      {usuario.iniciales}
    </span>
  );
}

// Nombre y correo de la persona con su avatar (Figma: «Persona» del menú de cuenta).
function Persona({ usuario }) {
  return (
    <div className="navbar-persona">
      <Avatar usuario={usuario} />
      <span className="navbar-persona-texto">
        <span className="navbar-persona-nombre cuerpo-p-fuerte">{usuario.nombre}</span>
        <span className="navbar-persona-correo detalle-nota">{usuario.correo}</span>
      </span>
    </div>
  );
}

// Botón «Cerrar sesión»: llama a DELETE /sesion y muestra que está cerrando mientras tanto.
function BotonCerrarSesion({ texto, cerrarSesion, className = "" }) {
  const [cerrando, setCerrando] = useState(false);

  async function cerrar() {
    setCerrando(true);
    try {
      await cerrarSesion();
    } catch (error) {
      console.error("No se pudo cerrar la sesión:", error);
      setCerrando(false);
    }
  }

  return (
    <button
      type="button"
      className={`navbar-cerrar-sesion cuerpo-p-fuerte ${className}`.trim()}
      onClick={cerrar}
      disabled={cerrando}
      aria-busy={cerrando || undefined}
    >
      <Icono nombre="salir" />
      {texto}
    </button>
  );
}

/**
 * Menú de cuenta de escritorio (Figma: «Menú de cuenta (abierto)», 272 de ancho):
 * el avatar abre un panel con la persona, un divisor y «Cerrar sesión».
 * Se cierra con Escape, al hacer clic fuera o al salir con el tabulador.
 */
function MenuCuenta({ usuario, textos, cerrarSesion }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;

    function alHacerClic(evento) {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    }
    function alPulsarTecla(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    }
    document.addEventListener("mousedown", alHacerClic);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("mousedown", alHacerClic);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [abierto]);

  return (
    <div
      className="navbar-menu-cuenta"
      ref={contenedor}
      onBlur={(evento) => {
        if (!contenedor.current?.contains(evento.relatedTarget)) setAbierto(false);
      }}
    >
      <button
        ref={boton}
        type="button"
        className="navbar-boton-cuenta"
        aria-label={`${textos.navbar.usuario.menu}: ${usuario.nombre}`}
        aria-expanded={abierto}
        aria-controls="menu-cuenta"
        onClick={() => setAbierto((valor) => !valor)}
      >
        <Avatar usuario={usuario} />
      </button>
      {abierto && (
        <div id="menu-cuenta" className="navbar-menu-cuenta-panel">
          <Persona usuario={usuario} />
          <hr className="navbar-divisor" />
          <BotonCerrarSesion texto={textos.navbar.usuario.cerrarSesion} cerrarSesion={cerrarSesion} />
        </div>
      )}
    </div>
  );
}

const Navbar = ({ usuario, cerrarSesion, textos, cargando, error, recargar, idiomas, estadoIdiomas, reintentarIdiomas, idioma, activo, accesibilidadAbierta, abrirAccesibilidad, botonAccesibilidadRef, cambiarIdioma }) => {
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
          {/* Figma móvil: con sesión la barra solo tiene el botón de menú; la cuenta va dentro del menú. */}
          {!usuario && nav && (
            <a className="navbar-movil-ingresar cuerpo-p-fuerte" href="/#ingresar">
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
          {cargando && estados?.cargando && <p className="navbar-estado cuerpo-p" role="status">{estados.cargando.aria}</p>}
          {error && estados?.error && (
            <div className="navbar-estado cuerpo-p" role="alert">
              <p>{estados.error.descripcion}</p>
              <button type="button" onClick={recargar}>{estados.error.botones.reintentar}</button>
            </div>
          )}
          {nav && (
            <ul className="navbar-enlaces">
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a className="cuerpo-p" href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
            </ul>
          )}
          <div className="navbar-utilidades">
            <div className="navbar-preferencia navbar-preferencia-idioma">
              {estadoIdiomas === "error" && estados?.error ? (
                <div className="navbar-estado cuerpo-p" role="alert">
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
              <span className="cuerpo-m">{textos?.menuMovil?.secciones?.accesibilidad}</span>
              <span className="navbar-accesibilidad-icono">
                <Icono nombre="accesibilidad" />
              </span>
            </button>
            {usuario && nav && (
              <div className="navbar-cuenta navbar-cuenta--sesion">
                {/* Escritorio: avatar que abre el menú de cuenta */}
                <MenuCuenta usuario={usuario} textos={textos} cerrarSesion={cerrarSesion} />
                {/* Móvil (Figma «Menú · sesión iniciada»): sección «Sesión iniciada» al final del menú */}
                <section className="navbar-sesion-movil" aria-labelledby="navbar-sesion-titulo">
                  <h2 id="navbar-sesion-titulo" className="navbar-sesion-titulo detalle-etiqueta">
                    {textos.menuMovil.secciones.cuenta}
                  </h2>
                  <Persona usuario={usuario} />
                  <BotonCerrarSesion
                    texto={textos.menuMovil.botones.conSesion.cerrarSesion}
                    cerrarSesion={cerrarSesion}
                  />
                </section>
              </div>
            )}
            {!usuario && nav && <div className="navbar-cuenta">
              <a className="navbar-ingresar cuerpo-m-fuerte" href="/#ingresar" onClick={() => setAbierto(false)}>{nav.botones.invitado.ingresar}</a>
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