import { useInicioPublico } from "../hooks/useInicioPublico.js";
import { useMedia } from "../hooks/useMedia.js";
import ilustracionInicio from "../assets/inicio-ilustracion.png";
import Button from "./base/Button.jsx";
import Portada from "./base/Portada.jsx";
import "./InicioPublico.css";

function EstadoCarga({ etiqueta }) {
  return <p className="inicio-estado cuerpo-p" role="status">{etiqueta}</p>;
}

function EstadoError({ textos, reintentar }) {
  return (
    <div className="inicio-error" role="alert">
      <h3 className="titular-h4">{textos.titulo}</h3>
      <p className="cuerpo-p">{textos.descripcion}</p>
      <Button onClick={reintentar}>{textos.botones.reintentar}</Button>
    </div>
  );
}

export default function InicioPublico({ textos, estados }) {
  const {
    generos,
    albumesPopulares,
    estadoGeneros,
    estadoAlbumesPopulares,
    reintentar,
  } = useInicioPublico();
  // Las clases de Figma tienen tamaño fijo: se elige una según el ancho de pantalla.
  const movil = useMedia("(max-width: 30rem)");
  const muyAncha = useMedia("(min-width: 110rem)");
  const claseTitular = movil ? "titular-h1" : muyAncha ? "titular-gigante" : "titular-display";
  const claseSeccion = movil ? "titular-h3" : "titular-h2";

  return (
    <div className="inicio-publico">
      <section className="inicio-hero" aria-labelledby="titulo-inicio">
        <div className="inicio-hero-contenido">
          <span className="inicio-etiqueta detalle-nota-fuerte">{textos.hero.etiquetas.temporada}</span>
          <h1 className={`inicio-hero-titulo ${claseTitular}`} id="titulo-inicio">{textos.hero.titulo}</h1>
          <p className="inicio-hero-subtitulo cuerpo-m">{textos.hero.subtitulo}</p>
          <div className="inicio-hero-acciones">
            <Button href="/#registro">{textos.hero.botones.crearCuentaGratis}</Button>
            <Button href="/catalogo" variant="secondary">{textos.hero.botones.explorarCatalogo}</Button>
          </div>
          <div className="inicio-cifras" role="group" aria-label={textos.hero.titulo}>
            <div>
              <strong className="titular-h3">{textos.cifras.canciones.valor}</strong>
              <span className="detalle-nota">{textos.cifras.canciones.etiqueta}</span>
            </div>
            <div>
              <strong className="titular-h3">{estadoGeneros === "listo" ? generos.length : "—"}</strong>
              <span className="detalle-nota">{textos.cifras.generos.etiqueta}</span>
            </div>
            <div>
              <strong className="titular-h3">{textos.cifras.cortes.valor}</strong>
              <span className="detalle-nota">{textos.cifras.cortes.etiqueta}</span>
            </div>
          </div>
        </div>
        <div className="inicio-hero-ilustracion" aria-hidden="true">
          <img src={ilustracionInicio} alt="" />
        </div>
      </section>

      <section className="inicio-destacados" aria-labelledby="inicio-destacados-titulo">
        <div className="inicio-seccion-encabezado">
          <h2 id="inicio-destacados-titulo" className={claseSeccion}>{textos.destacados.titulo}</h2>
          <a className="inicio-enlace-mas cuerpo-p-fuerte" href="/catalogo">
            {textos.destacados.enlaces.descubrirMas}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {estadoAlbumesPopulares === "cargando" && (
          <EstadoCarga etiqueta={estados.cargando.aria} />
        )}
        {estadoAlbumesPopulares === "error" && (
          <EstadoError textos={estados.error} reintentar={reintentar} />
        )}
        {estadoAlbumesPopulares === "listo" && albumesPopulares.length === 0 && (
          <p className="inicio-estado cuerpo-p">{estados.vacio.generico}</p>
        )}
        {estadoAlbumesPopulares === "listo" && albumesPopulares.length > 0 && (
          <div className="inicio-destacados-lista">
            {albumesPopulares.map((album) => (
              <article className="inicio-destacado" key={album.id}>
                <Portada portada={album.portada} />
                <h3 className={movil ? "cuerpo-m-fuerte" : "cuerpo-p-fuerte"}>{album.titulo}</h3>
                <p className={movil ? "cuerpo-p" : "detalle-nota"}>{album.artista.nombre}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="inicio-generos" aria-labelledby="inicio-generos-titulo">
        <div className="inicio-seccion-encabezado">
          <h2 id="inicio-generos-titulo" className={claseSeccion}>{textos.generos.titulo}</h2>
          <Button href="/catalogo" variant="secondary">{textos.generos.enlaces.verCatalogo}</Button>
        </div>

        {estadoGeneros === "cargando" && <EstadoCarga etiqueta={estados.cargando.aria} />}
        {estadoGeneros === "error" && (
          <EstadoError textos={estados.error} reintentar={reintentar} />
        )}
        {estadoGeneros === "listo" && generos.length === 0 && (
          <p className="inicio-estado cuerpo-p">{estados.vacio.generico}</p>
        )}
        {estadoGeneros === "listo" && generos.length > 0 && (
          <div className="inicio-lista-generos" role="group" aria-labelledby="inicio-generos-titulo">
            {generos.slice(0, 8).map((genero) => (
              <a
                className="inicio-genero titular-h4"
                key={genero.id}
                href={`/catalogo?genero=${encodeURIComponent(genero.id)}`}
                style={{ "--color-genero": genero.colorHex }}
              >
                <span>{genero.nombre}</span>
                <Portada
                  className="inicio-genero-miniatura"
                  portada={genero.portada}
                />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="inicio-cta">
        <div>
          <h2 className={movil ? "titular-h4" : "titular-h2"}>{textos.cta.titulo}</h2>
          <p className={movil ? "detalle-nota" : "cuerpo-m"}>{textos.cta.texto}</p>
        </div>
        <Button href="/#registro" className="inicio-cta-boton">
          {textos.cta.botones.crearCuentaGratis}
        </Button>
      </section>
    </div>
  );
}
