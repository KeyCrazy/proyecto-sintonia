import { useId, useState } from "react";
import Icono from "../Icono.jsx";
import "./base.css";

/**
 * Campo de formulario con etiqueta visible asociada (label htmlFor) y mensaje de error junto al campo.
 *
 *   <Field etiqueta="Correo electrónico" type="email" name="correo" error={errores.correo} />
 *
 * Contraseña con botón de ojo (dice su estado al lector con aria-label y aria-pressed):
 *   <Field etiqueta="Contraseña" type="password"
 *          textosClave={{ mostrar: "Mostrar contraseña", ocultar: "Ocultar contraseña" }} />
 *
 * `ref` llega al <input> (React 19), por ejemplo para mover el foco al primer campo con error.
 */
export default function Field({
  id,
  etiqueta,
  ayuda,
  error,
  type = "text",
  textosClave,
  className = "",
  ...inputProps
}) {
  const generatedId = useId();
  const [claveVisible, setClaveVisible] = useState(false);
  const inputId = id ?? generatedId;
  const {
    "aria-describedby": externalDescribedBy,
    "aria-invalid": externalInvalid,
    ...restInputProps
  } = inputProps;
  const ayudaId = ayuda ? `${inputId}-ayuda` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [externalDescribedBy, ayudaId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;
  const conOjo = type === "password" && textosClave;

  const control = (
    <input
      className="campo-control cuerpo-m"
      id={inputId}
      type={conOjo && claveVisible ? "text" : type}
      aria-invalid={error ? true : externalInvalid}
      aria-describedby={describedBy}
      {...restInputProps}
    />
  );

  return (
    <div className={`campo ${className}`.trim()}>
      <label className="campo-etiqueta cuerpo-p-fuerte" htmlFor={inputId}>
        {etiqueta}
      </label>
      {conOjo ? (
        <div className="campo-con-boton">
          {control}
          <button
            type="button"
            className="campo-boton"
            aria-label={claveVisible ? textosClave.ocultar : textosClave.mostrar}
            aria-pressed={claveVisible}
            aria-controls={inputId}
            disabled={restInputProps.disabled}
            onClick={() => setClaveVisible((visible) => !visible)}
          >
            <Icono nombre={claveVisible ? "ojoCerrado" : "ojo"} />
          </button>
        </div>
      ) : (
        control
      )}
      {ayuda && (
        <p className="campo-ayuda detalle-nota" id={ayudaId}>
          {ayuda}
        </p>
      )}
      {error && (
        <p className="campo-error detalle-nota" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
