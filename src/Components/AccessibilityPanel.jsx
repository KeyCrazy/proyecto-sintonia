import { useEffect, useRef } from "react";
import Icono from "./Icono.jsx";
import "./AccessibilityPanel.css";

const OPCIONES = [
  ["contrasteAlto", "altoContraste"],
  ["reducirMovimiento", "reducirMovimiento"],
  ["subrayarEnlaces", "subrayarEnlaces"],
  ["espaciadoAmpliado", "espaciado"],
];

export default function AccessibilityPanel({
  abierto,
  textos,
  ajustes,
  botonActivadorRef,
  alCerrar,
  alAlternar,
  alCambiarEscala,
  alRestablecer,
}) {
  const dialogoRef = useRef(null);

  useEffect(() => {
    const dialogo = dialogoRef.current;
    const activador = botonActivadorRef.current;
    if (!dialogo || !activador) return undefined;

    if (!abierto) {
      if (dialogo.open) dialogo.close();
      return undefined;
    }

    if (!dialogo.open) dialogo.showModal();

    function posicionar() {
      if (window.matchMedia("(max-width: 640px)").matches) {
        dialogo.style.left = "";
        dialogo.style.top = "";
        dialogo.style.right = "";
        dialogo.style.bottom = "";
        return;
      }

      const rect = activador.getBoundingClientRect();
      const ancho = dialogo.offsetWidth;
      const alto = dialogo.offsetHeight;
      const margen = 16;
      const izquierda = Math.max(
        margen,
        Math.min(rect.right - ancho, window.innerWidth - ancho - margen),
      );
      const arriba = Math.max(
        margen,
        Math.min(rect.bottom + 8, window.innerHeight - alto - margen),
      );
      dialogo.style.left = `${izquierda}px`;
      dialogo.style.top = `${arriba}px`;
    }

    function cerrarAlHacerClickFuera(evento) {
      if (
        !dialogo.contains(evento.target) &&
        !activador.contains(evento.target)
      ) {
        alCerrar();
      }
    }

    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        alCerrar();
        activador.focus();
      }
    }

    posicionar();
    window.addEventListener("resize", posicionar);
    window.addEventListener("scroll", posicionar, true);
    document.addEventListener("pointerdown", cerrarAlHacerClickFuera);
    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
      document.removeEventListener("pointerdown", cerrarAlHacerClickFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto, botonActivadorRef, ajustes.escalaTexto, alCerrar]);

  if (!textos) return null;

  return (
    <dialog
      ref={dialogoRef}
      id="panel-accesibilidad"
      className="panel-accesibilidad"
      aria-labelledby="panel-accesibilidad-titulo"
    >
      <section className="panel-accesibilidad-contenido">
        <header className="panel-accesibilidad-encabezado">
          <h2 id="panel-accesibilidad-titulo">
            {textos.titulo}
          </h2>
          <button
            type="button"
            className="panel-accesibilidad-cerrar"
            aria-label={textos.aria.cerrar}
            onClick={() => {
              alCerrar();
              botonActivadorRef.current?.focus();
            }}
          >
            <Icono nombre="cerrar" />
          </button>
        </header>

        <div className="panel-accesibilidad-opciones">
          <section className="panel-accesibilidad-tamano">
            <h3>{textos.tamanoTexto.etiqueta}</h3>
            <div className="panel-accesibilidad-control-tamano">
              <button
                type="button"
                aria-label={textos.tamanoTexto.reducir}
                disabled={ajustes.escalaTexto <= 80}
                onClick={() => alCambiarEscala(-10)}
              >
                −
              </button>
              <output aria-live="polite">
                {textos.tamanoTexto.valor.replace("{valor}", ajustes.escalaTexto)}
              </output>
              <button
                type="button"
                aria-label={textos.tamanoTexto.aumentar}
                disabled={ajustes.escalaTexto >= 150}
                onClick={() => alCambiarEscala(10)}
              >
                +
              </button>
            </div>
          </section>

          {OPCIONES.map(([clave, textoClave]) => {
            const { etiqueta, ayuda } = textos[textoClave];

            return (
              <div className="panel-accesibilidad-opcion" key={clave}>
                <span className="panel-accesibilidad-textos">
                  <span className="panel-accesibilidad-titulo-opcion">{etiqueta}</span>
                  <span className="panel-accesibilidad-descripcion">{ayuda}</span>
                </span>
                <button
                  type="button"
                  className="panel-accesibilidad-interruptor"
                  role="switch"
                  aria-checked={ajustes[clave]}
                  aria-label={etiqueta}
                  onClick={() => alAlternar(clave)}
                >
                  <span className="panel-accesibilidad-interruptor-marca" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="panel-accesibilidad-nota">{textos.mensajes.nota}</p>

        <footer className="panel-accesibilidad-pie">
          <a href="#accesibilidad" onClick={alCerrar}>
            {textos.enlaces.declaracion}
          </a>
          <button
            type="button"
            className="panel-accesibilidad-restablecer"
            onClick={alRestablecer}
          >
            {textos.botones.restablecer}
          </button>
        </footer>
      </section>
    </dialog>
  );
}
