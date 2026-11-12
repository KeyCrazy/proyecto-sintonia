import "./base.css";

export default function LanguageSelector({
  idiomas = [],
  idioma,
  cambiarIdioma,
  etiqueta,
  etiquetas = {},
  nombres = {},
  disabled = false,
  className = "",
}) {
  return (
    <div
      className={`selector-idioma ${className}`.trim()}
      role="group"
      aria-label={etiqueta}
    >
      {idiomas.map(({ codigo }) => (
        <button
          key={codigo}
          className="selector-idioma-opcion"
          type="button"
          disabled={disabled}
          aria-label={nombres[codigo]}
          aria-pressed={idioma === codigo}
          onClick={() => cambiarIdioma(codigo)}
        >
          {etiquetas[codigo]}
        </button>
      ))}
    </div>
  );
}
