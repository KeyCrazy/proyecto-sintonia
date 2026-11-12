import "./Footer.css";
import logo from "../assets/logo.svg";

const DESTINOS = {
  explorar: [
    ["inicio", "#inicio"],
    ["catalogo", "#catalogo"],
  ],
  cuenta: [
    ["ingresar", "#ingresar"],
    ["crearCuenta", "#registro"],
  ],
  legal: [
    ["terminos", "#terminos"],
    ["accesibilidad", "#accesibilidad"],
  ],
};

export default function Footer({ textos, idioma = "es" }) {
  if (!textos) return null;

  const columnas = ["explora", "cuenta", "legal"].map((clave) => ({
    clave,
    contenido: textos.columnas[clave],
    enlaces: DESTINOS[clave === "explora" ? "explorar" : clave],
  }));
  const etiquetaNavegacion =
    idioma === "en" ? "Footer navigation" : "Navegación del pie";

  return (
    <footer className="pie-pagina">
      <div className="contenedor pie-pagina-interior">
        <div className="pie-pagina-superior">
          <div className="pie-pagina-marca">
            <a
              className="pie-pagina-logotipo"
              href="#inicio"
              aria-label={idioma === "en" ? "Sintonía, go to home" : "Sintonía, ir al inicio"}
            >
              <img src={logo} alt="" />
            </a>
            <p>{textos.lema}</p>
          </div>

          <nav className="pie-pagina-navegacion" aria-label={etiquetaNavegacion}>
            {columnas.map(({ clave, contenido, enlaces }) => (
              <section className="pie-pagina-columna" key={clave}>
                <h2>{contenido.titulo}</h2>
                <ul>
                  {enlaces.map(([claveEnlace, destino]) => (
                    <li key={claveEnlace}>
                      <a href={destino}>{contenido.enlaces[claveEnlace]}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="pie-pagina-legal">
          <p>
            {textos.legal.derechos.replace(
              "{anio}",
              String(new Date().getFullYear()),
            )}
          </p>
          <p>{textos.legal.nota}</p>
        </div>
      </div>
    </footer>
  );
}