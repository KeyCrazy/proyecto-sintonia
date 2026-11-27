import Portada from "./Portada.jsx";
import Tag from "./Tag.jsx";
import "./base.css";

/**
 * Tarjeta reutilizable: se le pasan los datos y arma la tarjeta.
 *
 *   <Card
 *     titulo={album.titulo}
 *     subtitulo={album.artista.nombre}
 *     portada={album.portada}        // objeto "portada" de la API (opcional)
 *     etiqueta="Álbum"               // texto de una <Tag> (opcional)
 *     href={`/album/${album.id}`}    // la vuelve clicable (opcional)
 *     disabled={false}
 *   />
 *
 * Con href tiene estados de foco, hover y deshabilitado.
 * `nivelTitulo` elige la etiqueta del título (h2, h3, h4…); por defecto h3.
 * `children` se agrega al final por si hace falta algo más.
 */
export default function Card({
  titulo,
  subtitulo,
  portada,
  etiqueta,
  href,
  disabled = false,
  nivelTitulo = "h3",
  className = "",
  children,
  onClick,
  ...props
}) {
  const Titulo = nivelTitulo;
  const classes = ["tarjeta", href && "tarjeta--interactiva", className]
    .filter(Boolean)
    .join(" ");

  const contenido = (
    <>
      {portada && <Portada portada={portada} className="tarjeta-portada" />}
      {etiqueta && (
        <Tag variante="neutral" className="tarjeta-etiqueta">
          {etiqueta}
        </Tag>
      )}
      {titulo && <Titulo className="tarjeta-titulo cuerpo-p-fuerte">{titulo}</Titulo>}
      {subtitulo && <p className="tarjeta-subtitulo detalle-nota">{subtitulo}</p>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {contenido}
      </a>
    );
  }

  return (
    <article className={classes} {...props}>
      {contenido}
    </article>
  );
}
