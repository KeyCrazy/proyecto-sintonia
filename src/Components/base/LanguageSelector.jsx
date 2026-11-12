import "./base.css";

const IDIOMAS = ["es", "en"];

export default function LanguageSelector({
  idioma,
  cambiarIdioma,
  etiqueta,
  disabled = false,
  className = "",
}) {
  return (
    <div
      className={`selector-idioma ${className}`.trim()}
      role="group"
      aria-label={etiqueta}
    >
      {IDIOMAS.map((opcion) => (
        <button
          key={opcion}
          className="selector-idioma-opcion"
          type="button"
          disabled={disabled}
          aria-pressed={idioma === opcion}
          onClick={() => cambiarIdioma(opcion)}
        >
          {opcion.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
