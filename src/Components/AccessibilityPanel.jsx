import { useEffect, useRef } from "react";
import Icono from "./Icono.jsx";
import "./AccessibilityPanel.css";

const OPCIONES = [
  {
    clave: "contrasteAlto",
    es: ["Alto contraste", "Más diferencia entre el texto y el fondo"],
    en: ["High contrast", "More difference between text and background"],
  },
  {
    clave: "reducirMovimiento",
    es: ["Reducir movimiento", "Sin animaciones ni transiciones"],
    en: ["Reduce motion", "No animations or transitions"],
  },
  {
    clave: "subrayarEnlaces",
    es: ["Subrayar enlaces", "Los enlaces se distinguen sin depender del color"],
    en: ["Underline links", "Links are identifiable without relying on color"],
  },
  {
    clave: "espaciadoAmpliado",
    es: ["Espaciado de lectura", "Más espacio entre las letras y entre líneas"],
    en: ["Reading spacing", "More space between letters and lines"],
  },
];

export default function AccessibilityPanel({
  abierto,
  idioma,
  ajustes,
  botonActivadorRef,
  alCerrar,
  alAlternar,
  alCambiarEscala,
  alRestablecer,
}) {
  const dialogoRef = useRef(null);
  const ingles = idioma === "en";

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
            {ingles ? "Accessibility" : "Accesibilidad"}
          </h2>
          <button
            type="button"
            className="panel-accesibilidad-cerrar"
            aria-label={ingles ? "Close accessibility options" : "Cerrar opciones de accesibilidad"}
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
            <h3>{ingles ? "Text size" : "Tamaño del texto"}</h3>
            <div className="panel-accesibilidad-control-tamano">
              <button
                type="button"
                aria-label={ingles ? "Decrease text size" : "Disminuir tamaño del texto"}
                disabled={ajustes.escalaTexto <= 80}
                onClick={() => alCambiarEscala(-10)}
              >
                −
              </button>
              <output aria-live="polite">{ajustes.escalaTexto} %</output>
              <button
                type="button"
                aria-label={ingles ? "Increase text size" : "Aumentar tamaño del texto"}
                disabled={ajustes.escalaTexto >= 150}
                onClick={() => alCambiarEscala(10)}
              >
                +
              </button>
            </div>
          </section>

          {OPCIONES.map(({ clave, es, en }) => {
            const [titulo, descripcion] = ingles ? en : es;

            return (
              <div className="panel-accesibilidad-opcion" key={clave}>
                <span className="panel-accesibilidad-textos">
                  <span className="panel-accesibilidad-titulo-opcion">{titulo}</span>
                  <span className="panel-accesibilidad-descripcion">{descripcion}</span>
                </span>
                <button
                  type="button"
                  className="panel-accesibilidad-interruptor"
                  role="switch"
                  aria-checked={ajustes[clave]}
                  aria-label={titulo}
                  onClick={() => alAlternar(clave)}
                >
                  <span className="panel-accesibilidad-interruptor-marca" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="panel-accesibilidad-nota">
          {ingles
            ? "Settings are saved on this device. Initial values follow your system preferences."
            : "Se guarda en este dispositivo. Los valores iniciales salen de lo que ya viene definido en tu sistema."}
        </p>

        <footer className="panel-accesibilidad-pie">
          <a href="#accesibilidad" onClick={alCerrar}>
            {ingles ? "Accessibility statement" : "Declaración de accesibilidad"}
          </a>
          <button
            type="button"
            className="panel-accesibilidad-restablecer"
            onClick={alRestablecer}
          >
            {ingles ? "Reset" : "Restablecer"}
          </button>
        </footer>
      </section>
    </dialog>
  );
}
