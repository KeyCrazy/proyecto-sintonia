import "./base.css";

export default function Tag({ children, variant = "default", className = "" }) {
  return (
    <span className={`etiqueta etiqueta--${variant} detalle-etiqueta ${className}`.trim()}>
      {children}
    </span>
  );
}
