import "./base.css";

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  tabIndex,
  ...props
}) {
  const classes = ["boton", `boton--${variant}`, className]
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
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
