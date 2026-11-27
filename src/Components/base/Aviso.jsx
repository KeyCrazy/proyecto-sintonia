import Icono from "../Icono.jsx";
import "./base.css";

const ICONOS = { error: "alerta", exito: "exito", info: "info" };

/**
 * Aviso reutilizable (Figma: componente «Aviso», tipos Error, Éxito e Información).
 *
 *   <Aviso tipo="error" titulo="Algo salió mal" texto="No pudimos cargar esta parte." />
 *   <Aviso tipo="info" texto="Aquí no hay nada todavía." />
 *   <Aviso tipo="error" titulo="…" texto="…">
 *     <Button onClick={reintentar}>Reintentar</Button>   // acciones opcionales
 *   </Aviso>
 *
 * tipo: "error" | "exito" | "info". El de error se anuncia de inmediato (role="alert").
 */
export default function Aviso({ tipo = "info", titulo, texto, children, className = "", ...props }) {
  return (
    <div
      className={`aviso aviso--${tipo} ${className}`.trim()}
      role={tipo === "error" ? "alert" : "status"}
      {...props}
    >
      <span className="aviso-icono">
        <Icono nombre={ICONOS[tipo] ?? "info"} />
      </span>
      <div className="aviso-contenido">
        {titulo && <p className="aviso-titulo cuerpo-p-fuerte">{titulo}</p>}
        {texto && <p className="aviso-texto cuerpo-p">{texto}</p>}
        {children && <div className="aviso-acciones">{children}</div>}
      </div>
    </div>
  );
}
