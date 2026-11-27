import Portada from "./Portada.jsx";
import Tag from "./Tag.jsx";
import "./base.css";

// "portada/1" (nombre de variable de Figma que manda la API) -> "var(--portada-1)".
// Cualquier otro valor (por ejemplo un hex) se usa tal cual.
function colorDeToken(color) {
  return typeof color === "string" && color.includes("/")
    ? `var(--${color.replace("/", "-")})`
    : color;
}

/**
 * Tarjeta reutilizable: se le pasan los datos y arma la tarjeta.
 *
 * Álbum (variante por defecto):
 *   <Card
 *     titulo={album.titulo}
 *     subtitulo={album.artista.nombre}
 *     portada={album.portada}        // objeto "portada" de la API (opcional)
 *     etiqueta="Álbum"               // texto de una <Tag> (opcional)
 *     href={`/album/${album.id}`}    // la vuelve clicable (opcional)
 *     disabled={false}
 *   />
 *
 * Género:
 *   <Card
 *     variante="genero"
 *     titulo={genero.nombre}
 *     portada={genero.portada}
 *     color={genero.color}           // "portada/1" o un hex como genero.colorHex
 *     href={`/catalogo?genero=${genero.id}`}
 *     seleccionado={genero.id === generoActual}
 *   />
 *
 * Con href tiene estados de foco, hover y deshabilitado.
 * `nivelTitulo` elige la etiqueta del título (h2, h3, h4…); por defecto h3 en álbum y span en género.
 * `children` se agrega al final por si hace falta algo más.
 */
export default function Card({
  variante = "album",
  titulo,
  subtitulo,
  portada,
  etiqueta,
  color,
  seleccionado = false,
  href,
  disabled = false,
  nivelTitulo,
  className = "",
  style,
  children,
  onClick,
  ...props
}) {
  const esGenero = variante === "genero";
  const Titulo = nivelTitulo ?? (esGenero ? "span" : "h3");
  const classes = [
    "tarjeta",
    `tarjeta--${variante}`,
    href && "tarjeta--interactiva",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const estilos = esGenero && color ? { ...style, "--color-genero": colorDeToken(color) } : style;

  const contenido = esGenero ? (
    <>
      <Titulo className="tarjeta-titulo titular-h3">{titulo}</Titulo>
      {portada && <Portada portada={portada} className="tarjeta-genero-portada" />}
      {children}
    </>
  ) : (
    <>
      {portada && <Portada portada={portada} className="tarjeta-portada" />}
      {etiqueta && (
        <Tag variante="neutro" className="tarjeta-etiqueta">
          {etiqueta}
        </Tag>
      )}
      {titulo && <Titulo className="tarjeta-titulo cuerpo-m-fuerte">{titulo}</Titulo>}
      {subtitulo && <p className="tarjeta-subtitulo cuerpo-p">{subtitulo}</p>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        style={estilos}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-current={seleccionado ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {contenido}
      </a>
    );
  }

  return (
    <article className={classes} style={estilos} {...props}>
      {contenido}
    </article>
  );
}
