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
      <label className="campo-etiqueta" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="campo-control"
        id={inputId}
        aria-invalid={error ? true : externalInvalid}
        aria-describedby={describedBy}
        {...restInputProps}
      />
      {hint && (
        <p className="campo-ayuda" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="campo-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
