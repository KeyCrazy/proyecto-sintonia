import "./base.css";

export default function Card({
  children,
  href,
  disabled = false,
  className = "",
  onClick,
  tabIndex,
  ...props
}) {
  const classes = ["tarjeta", href && "tarjeta--interactiva", className]
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
    <article className={classes} {...props}>
      {children}
    </article>
  );
}
