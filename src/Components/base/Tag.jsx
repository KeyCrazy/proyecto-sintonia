import "./base.css";

/**
 * Etiqueta reutilizable.
 *
 *   <Tag>Álbum</Tag>                                  → solo texto (span)
 *   <Tag href="/catalogo?genero=gen_salsa">Salsa</Tag> → enlace
 *   <Tag onClick={filtrar} seleccionado={activo}>Pop</Tag> → botón tipo filtro
 *   <Tag onClick={filtrar} disabled>Rock</Tag>         → deshabilitada
 *
 * variante: "default" (verde de marca) | "neutral" (gris).
 * tipografia: clase de Figma del texto; por defecto "detalle-etiqueta" (mayúsculas).
 * Con href u onClick tiene estados de foco, hover y deshabilitado.
 */
export default function Tag({
  children,
  variante = "default",
  tipografia = "detalle-etiqueta",
  href,
  onClick,
  seleccionado,
  disabled = false,
  className = "",
  ...props
}) {
  const interactiva = Boolean(href || onClick);
  const classes = [
    "etiqueta",
    `etiqueta--${variante}`,
    interactiva && "etiqueta--interactiva",
    tipografia,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-current={seleccionado ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        disabled={disabled}
        aria-pressed={seleccionado === undefined ? undefined : seleccionado}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
