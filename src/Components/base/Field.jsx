import { useId } from "react";
import "./base.css";

export default function Field({
  id,
  etiqueta,
  ayuda,
  error,
  className = "",
  ...inputProps
}) {
  const generatedId = useId();
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

  return (
    <div className={`campo ${className}`.trim()}>
      <label className="campo-etiqueta cuerpo-p-fuerte" htmlFor={inputId}>
        {etiqueta}
      </label>
      <input
        className="campo-control cuerpo-m"
        id={inputId}
        aria-invalid={error ? true : externalInvalid}
        aria-describedby={describedBy}
        {...restInputProps}
      />
      {ayuda && (
        <p className="campo-ayuda detalle-nota" id={ayudaId}>
          {ayuda}
        </p>
      )}
      {error && (
        <p className="campo-error detalle-nota-fuerte" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
