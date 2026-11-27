import { useId } from "react";
import "./base.css";

export default function Field({
  id,
  label,
  hint,
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
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [externalDescribedBy, hintId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`campo ${className}`.trim()}>
      <label className="campo-etiqueta cuerpo-p-fuerte" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="campo-control cuerpo-m"
        id={inputId}
        aria-invalid={error ? true : externalInvalid}
        aria-describedby={describedBy}
        {...restInputProps}
      />
      {hint && (
        <p className="campo-ayuda detalle-nota" id={hintId}>
          {hint}
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
