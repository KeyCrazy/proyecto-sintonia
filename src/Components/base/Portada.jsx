export default function Portada({ portada, className = "" }) {
  let figura;

  switch (portada.patron) {
    case 0:
      figura = (
        <>
          <circle cx="100" cy="100" r="85" fill={portada.figura} />
          <circle cx="100" cy="100" r="62.5" fill={portada.fondo} />
          <circle cx="100" cy="100" r="40" fill={portada.figura} />
        </>
      );
      break;
    case 1:
      figura = (
        <g fill={portada.figura}>
          <rect x="-34" y="40" width="182" height="11.4" transform="rotate(-35 -34 40)" />
          <rect x="-30.7" y="66" width="182" height="11.4" transform="rotate(-35 -30.7 66)" />
          <rect x="-27.3" y="92" width="182" height="11.4" transform="rotate(-35 -27.3 92)" />
          <rect x="-23.9" y="118.2" width="182" height="11.4" transform="rotate(-35 -23.9 118.2)" />
        </g>
      );
      break;
    case 2:
      figura = (
        <>
          <circle cx="50" cy="86.4" r="34.1" fill={portada.figura} />
          <circle cx="76.7" cy="23.3" r="10.8" fill={portada.detalle} />
        </>
      );
      break;
    case 3:
      figura = (
        <>
          <g fill={portada.detalle}>
            <circle cx="22.7" cy="22.7" r="9.1" />
            <circle cx="77.3" cy="22.7" r="9.1" />
            <circle cx="50" cy="50" r="9.1" />
            <circle cx="22.7" cy="77.3" r="9.1" />
            <circle cx="77.3" cy="77.3" r="9.1" />
          </g>
          <g fill={portada.figura}>
            <circle cx="50" cy="22.7" r="9.1" />
            <circle cx="22.7" cy="50" r="9.1" />
            <circle cx="77.3" cy="50" r="9.1" />
            <circle cx="50" cy="77.3" r="9.1" />
          </g>
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <div className={`portada ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        <rect width="100" height="100" fill={portada.fondo} />
        {figura}
      </svg>
    </div>
  );
}
