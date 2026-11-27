import "./base.css";

/**
 * Botón reutilizable.
 *   <Button onClick={guardar}>Guardar</Button>
 *   <Button href="/catalogo" variante="secondary">Ver catálogo</Button>
 *   <Button type="submit" cargando={enviando}>{enviando ? "Ingresando…" : "Ingresar"}</Button>
 *
 * cargando (Figma «Botón · cargando»): muestra el spinner, no se puede pulsar otra vez
 * y avisa al lector de pantalla con aria-busy.
 */
export default function Button({
  children,
  variante = "primary",
  href,
  className = "",
  disabled = false,
  cargando = false,
  type = "button",
  onClick,
  tipografia = "cuerpo-p-fuerte",
  tabIndex,
  ...props
}) {
  const classes = ["boton", `boton--${variante}`, cargando && "boton--cargando", tipografia, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      onClick={onClick}
      {...props}
    >
      {cargando && <span className="boton-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
