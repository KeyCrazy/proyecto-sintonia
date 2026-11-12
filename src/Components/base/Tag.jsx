import "./base.css";

export default function Tag({ children, variant = "default", className = "" }) {
  return (
    <span className={`etiqueta etiqueta--${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
