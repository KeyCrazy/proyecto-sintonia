import "./base.css";

/**
 * Bloque gris animado que ocupa el lugar de un contenido mientras carga.
 * El tamaño lo da quien lo usa (className o style); es decorativo (aria-hidden).
 *
 *   <Esqueleto forma="cuadrado" />          // portada
 *   <Esqueleto forma="texto" ancho="60%" /> // línea de texto
 *   <Esqueleto forma="circulo" />           // avatar
 *
 * forma: "rect" | "cuadrado" | "texto" | "circulo".
 */
export default function Esqueleto({ forma = "rect", ancho, className = "", style }) {
  return (
    <span
      className={`esqueleto esqueleto--${forma} ${className}`.trim()}
      style={ancho ? { ...style, width: ancho } : style}
      aria-hidden="true"
    />
  );
}
