import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import { useMetadatos } from "../hooks/useMetadatos.js";
import { codigoDeError, ErrorApi, pedirJson } from "../utils/api.js";
import { rellenar } from "../utils/formato.js";
import Aviso from "./base/Aviso.jsx";
import Button from "./base/Button.jsx";
import Field from "./base/Field.jsx";
import Portada from "./base/Portada.jsx";
import "./Ingresar.css";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Portadas decorativas del panel de marca: salen de la API, así no hay colores escritos a mano.
function usePortadasDecorativas() {
  const [portadas, setPortadas] = useState([]);

  useEffect(() => {
    const controlador = new AbortController();
    pedirJson("albumes?orden=populares&limite=8", { signal: controlador.signal })
      .then((datos) => setPortadas((datos?.datos ?? []).map((album) => album.portada)))
      .catch(() => setPortadas([]));
    return () => controlador.abort();
  }, []);

  return portadas;
}

/**
 * Vista 4 · Iniciar sesión (/#ingresar) con POST /sesion.
 * `textos` es el objeto completo de textos de la API.
 */
export default function Ingresar({ textos }) {
  const pagina = textos.paginas.ingresar;
  const formulario = pagina.formulario;
  const mensajes = pagina.errores;
  const portadas = usePortadasDecorativas();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantenerSesion, setMantenerSesion] = useState(true);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  // 429: segundos que faltan para poder volver a intentar (cabecera Retry-After).
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);
  const bloqueado = segundosBloqueo > 0;
  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const avisoRef = useRef(null);

  useMetadatos({ titulo: pagina.seo.titulo, descripcion: pagina.seo.descripcion });

  // Si el aviso es de la API (credenciales, conexión…), se lleva el foco a él para que se lea.
  useEffect(() => {
    if (aviso && aviso.tipo !== "campos") avisoRef.current?.focus();
  }, [aviso]);

  // Cuenta regresiva del bloqueo por demasiados intentos.
  useEffect(() => {
    if (!bloqueado) return undefined;
    const intervalo = setInterval(() => setSegundosBloqueo((segundos) => segundos - 1), 1000);
    return () => clearInterval(intervalo);
  }, [bloqueado]);

  // Al terminar el bloqueo se quita el aviso y el formulario vuelve a funcionar.
  useEffect(() => {
    if (segundosBloqueo <= 0 && aviso?.tipo === "intentos") setAviso(null);
  }, [segundosBloqueo, aviso]);

  function validar() {
    const nuevos = {};
    if (!correo.trim()) nuevos.correo = mensajes.correoObligatorio;
    else if (!CORREO_VALIDO.test(correo.trim())) nuevos.correo = textos.formularios.validacion.correo;
    if (!clave) nuevos.clave = mensajes.claveObligatoria;
    return nuevos;
  }

  function enfocarPrimerError(campos) {
    if (campos.correo) correoRef.current?.focus();
    else if (campos.clave) claveRef.current?.focus();
  }

  async function ingresar() {
    setEnviando(true);
    setAviso(null);
    try {
      await pedirJson("sesion", {
        metodo: "POST",
        cuerpo: { correo: correo.trim(), clave },
        conSesion: true,
        simular: true,
      });
      // La API ya dejó la cookie de sesión: se vuelve al inicio, que la lee con GET /sesion.
      window.location.assign("/");
    } catch (error) {
      setEnviando(false);
      const codigo = codigoDeError(error);

      if (codigo === "validacion" && error instanceof ErrorApi && error.campos) {
        const campos = { correo: error.campos.correo, clave: error.campos.clave };
        setErrores(campos);
        setAviso({ tipo: "campos" });
        enfocarPrimerError(campos);
      } else if (codigo === "credenciales_invalidas") {
        setAviso({ tipo: "credenciales" });
      } else if (codigo === "demasiadas_peticiones") {
        const segundos = error.reintentarEn ?? 60;
        setSegundosBloqueo(segundos);
        setAviso({ tipo: "intentos", segundos });
      } else if (codigo === "sin_conexion") {
        setAviso({ tipo: "conexion" });
      } else {
        setAviso({ tipo: "otro", codigo });
      }
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    // No se puede enviar dos veces ni durante el bloqueo por demasiados intentos.
    if (enviando || bloqueado) return;
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setAviso({ tipo: "campos" });
      enfocarPrimerError(nuevos);
      return;
    }
    ingresar();
  }

  function contenidoAviso() {
    switch (aviso?.tipo) {
      case "campos":
        return { titulo: mensajes.camposObligatorios.titulo, texto: mensajes.camposObligatorios.texto };
      case "credenciales":
        return { titulo: mensajes.credenciales.titulo, texto: mensajes.credenciales.texto };
      case "intentos":
        return {
          titulo: mensajes.demasiadosIntentos.titulo,
          // La cuenta regresiva se ve cada segundo, pero el lector de pantalla solo lee
          // el mensaje una vez (con los segundos iniciales) para no repetirlo cada segundo.
          texto: (
            <>
              <span aria-hidden="true">
                {rellenar(mensajes.demasiadosIntentos.texto, { segundos: Math.max(segundosBloqueo, 0) })}
              </span>
              <span className="solo-lectores">
                {rellenar(mensajes.demasiadosIntentos.texto, { segundos: aviso.segundos })}
              </span>
            </>
          ),
        };
      case "conexion":
        return { titulo: mensajes.conexion.titulo, texto: mensajes.conexion.texto, reintentar: true };
      case "otro":
        return {
          titulo: textos.estados.error.titulo,
          texto: textos.errores?.[aviso.codigo] ?? textos.estados.error.descripcion,
          reintentar: true,
        };
      default:
        return null;
    }
  }

  const avisoActual = contenidoAviso();

  return (
    <div className="ingresar">
      <section className="ingresar-formulario" aria-labelledby="titulo-ingresar">
        {portadas.length >= 3 && (
          <div className="ingresar-collage" aria-hidden="true">
            {portadas.slice(0, 3).map((portada, indice) => (
              <Portada portada={portada} className={`ingresar-collage-portada ingresar-collage-${indice + 1}`} key={indice} />
            ))}
          </div>
        )}

        <a className="ingresar-logo" href="/#inicio" aria-label={textos.navbar.logo.aria}>
          <img src={logo} alt="" />
        </a>

        <div className="ingresar-contenido">
          <h1 id="titulo-ingresar" className="titular-h1">{formulario.titulo}</h1>
          <p className="ingresar-subtitulo cuerpo-m">{formulario.subtitulo}</p>

          {avisoActual && (
            <div className="ingresar-aviso" ref={avisoRef} tabIndex={-1}>
              <Aviso tipo="error" titulo={avisoActual.titulo} texto={avisoActual.texto} />
            </div>
          )}

          <form onSubmit={enviar} noValidate aria-busy={enviando}>
            {/* Con 429 el fieldset deshabilitado bloquea todos los campos y el botón a la vez. */}
            <fieldset className="ingresar-campos" disabled={bloqueado}>
            <Field
              ref={correoRef}
              etiqueta={formulario.etiquetas.correo}
              type="email"
              name="correo"
              autoComplete="email"
              inputMode="email"
              placeholder={formulario.placeholders.correo}
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              error={errores.correo}
              required
            />
            <Field
              ref={claveRef}
              etiqueta={formulario.etiquetas.clave}
              type="password"
              name="clave"
              autoComplete="current-password"
              value={clave}
              onChange={(evento) => setClave(evento.target.value)}
              error={errores.clave}
              textosClave={{
                mostrar: formulario.botones.mostrarClave,
                ocultar: formulario.botones.ocultarClave,
              }}
              required
            />

            <div className="ingresar-opciones">
              <label className="ingresar-mantener cuerpo-p">
                <input
                  type="checkbox"
                  checked={mantenerSesion}
                  onChange={(evento) => setMantenerSesion(evento.target.checked)}
                />
                {formulario.etiquetas.mantenerSesion}
              </label>
              <a className="ingresar-enlace cuerpo-p-fuerte" href="/#recuperar-clave">
                {formulario.enlaces.olvidasteClave}
              </a>
            </div>

            {/* Figma: «Ingresando…» con spinner mientras envía; «Reintentar» si no hubo conexión. */}
            <Button
              type="submit"
              className="ingresar-boton"
              tipografia="cuerpo-m-fuerte"
              cargando={enviando}
            >
              {enviando
                ? formulario.mensajes.ingresando
                : avisoActual?.reintentar
                  ? mensajes.conexion.botones.reintentar
                  : formulario.botones.ingresar}
            </Button>
            </fieldset>
          </form>

          <p className="ingresar-registro cuerpo-p">
            {formulario.mensajes.sinCuenta}{" "}
            <a className="ingresar-enlace cuerpo-p-fuerte" href="/#registro">
              {formulario.enlaces.crearCuenta}
            </a>
          </p>
        </div>

        <p className="ingresar-legal detalle-nota">
          {rellenar(textos.footer.legal.derechos, { anio: new Date().getFullYear() })}
        </p>
      </section>

      <aside className="ingresar-marca" aria-hidden="true">
        <div className="ingresar-mosaico">
          {portadas.map((portada, indice) => (
            <Portada portada={portada} className="ingresar-mosaico-portada" key={indice} />
          ))}
        </div>
        <p className="ingresar-marca-titulo titular-h1">{pagina.presentacion.titulo}</p>
        <p className="ingresar-marca-texto cuerpo-g">{pagina.presentacion.texto}</p>
      </aside>
    </div>
  );
}
