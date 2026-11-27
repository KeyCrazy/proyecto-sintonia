import { useMetadatos } from "../hooks/useMetadatos.js";
import Button from "./base/Button.jsx";
import "./NoEncontrado.css";

/**
 * Página de no encontrado (equivalente en Vite de notFound() de Next).
 *   <NoEncontrado titulo="…" texto="…" boton="Volver al catálogo" href="/catalogo" />
 */
export default function NoEncontrado({
  titulo,
  texto,
  boton,
  href = "/",
  tituloSitio,
  idTitulo = "titulo-no-encontrado",
}) {
  useMetadatos({ titulo: tituloSitio ? `${titulo} · ${tituloSitio}` : titulo, descripcion: texto });

  return (
    <section className="no-encontrado" aria-labelledby={idTitulo}>
      <p className="no-encontrado-codigo titular-gigante" aria-hidden="true">404</p>
      <h1 id={idTitulo} className="titular-h2">{titulo}</h1>
      <p className="no-encontrado-texto cuerpo-m">{texto}</p>
      <Button href={href}>{boton}</Button>
    </section>
  );
}
