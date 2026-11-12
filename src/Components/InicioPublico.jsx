import { useInicioPublico } from "../hooks/useInicioPublico.js";
import ilustracionInicio from "../assets/inicio-ilustracion.png";
import Button from "./base/Button.jsx";
import Portada from "./base/Portada.jsx";
import "./InicioPublico.css";

function EstadoCarga({ etiqueta }) {
  return <p className="inicio-estado" role="status">{etiqueta}</p>;
}

function EstadoError({ textos, reintentar }) {
  return (
    <div className="inicio-error" role="alert">
      <h3>{textos.titulo}</h3>
      <p>{textos.descripcion}</p>
      <Button onClick={reintentar}>{textos.botones.reintentar}</Button>
    </div>
  );
}

export default function InicioPublico({ textos, estados }) {
  const {
    generos,
    generoId,
    seleccionarGenero,
    detalle,
    estadoGeneros,
    estadoDetalle,
    reintentar,
  } = useInicioPublico();

  const generoSeleccionado = generos.find((genero) => genero.id === generoId);

  return (
    <div className="inicio-publico">
      <section className="inicio-hero" aria-labelledby="titulo-inicio">
        <div className="inicio-hero-contenido">
          <span className="inicio-etiqueta">{textos.hero.etiquetas.temporada}</span>
          <h1 className="inicio-hero-titulo" id="titulo-inicio">{textos.hero.titulo}</h1>
          <p className="inicio-hero-subtitulo">{textos.hero.subtitulo}</p>
          <div className="inicio-hero-acciones">
            <Button href="#registro">{textos.hero.botones.crearCuentaGratis}</Button>
            <Button href="#catalogo" variant="secondary">{textos.hero.botones.explorarCatalogo}</Button>
          </div>
          <div className="inicio-cifras" role="group" aria-label={textos.hero.titulo}>
            <div>
              <strong>{textos.cifras.canciones.valor}</strong>
              <span>{textos.cifras.canciones.etiqueta}</span>
            </div>
            <div>
              <strong>{estadoGeneros === "listo" ? generos.length : "—"}</strong>
              <span>{textos.cifras.generos.etiqueta}</span>
            </div>
            <div>
              <strong>{textos.cifras.cortes.valor}</strong>
              <span>{textos.cifras.cortes.etiqueta}</span>
            </div>
          </div>
        </div>
        <div className="inicio-hero-ilustracion" aria-hidden="true">
          <img src={ilustracionInicio} alt="" />
        </div>
      </section>

      <section className="inicio-generos" aria-labelledby="inicio-generos-titulo">
        <div className="inicio-seccion-encabezado">
          <h2 id="inicio-generos-titulo">{textos.generos.titulo}</h2>
          <Button href="#catalogo" variant="secondary">{textos.generos.enlaces.verCatalogo}</Button>
        </div>

        {estadoGeneros === "cargando" && <EstadoCarga etiqueta={estados.cargando.aria} />}
        {estadoGeneros === "error" && (
          <EstadoError textos={estados.error} reintentar={reintentar} />
        )}
        {estadoGeneros === "listo" && generos.length === 0 && (
          <p className="inicio-estado">{estados.vacio.generico}</p>
        )}
        {estadoGeneros === "listo" && generos.length > 0 && (
          <>
            <div className="inicio-lista-generos" role="group" aria-labelledby="inicio-generos-titulo">
              {generos.map((genero) => (
                <button
                  className="inicio-genero"
                  key={genero.id}
                  type="button"
                  aria-pressed={genero.id === generoId}
                  style={{ "--color-genero": genero.colorHex }}
                  onClick={() => seleccionarGenero(genero.id)}
                >
                  {genero.nombre}
                </button>
              ))}
            </div>

            {generoSeleccionado && (
              <div className="inicio-genero-seleccionado">
                <div className="inicio-genero-portada">
                  <Portada portada={generoSeleccionado.portada} />
                </div>
                <div className="inicio-genero-contenido">
                  <p className="inicio-genero-descripcion">{generoSeleccionado.descripcion}</p>
                  {estadoDetalle === "cargando" && (
                    <EstadoCarga etiqueta={estados.cargando.aria} />
                  )}
                  {estadoDetalle === "error" && (
                    <EstadoError textos={estados.error} reintentar={reintentar} />
                  )}
                  {estadoDetalle === "listo" && detalle?.albumes.length === 0 && (
                    <p className="inicio-estado">{estados.vacio.generico}</p>
                  )}
                  {estadoDetalle === "listo" && detalle?.albumes.length > 0 && (
                    <div className="inicio-albumes" aria-live="polite">
                      {detalle.albumes.map((album) => (
                        <article className="inicio-album" key={album.id}>
                          <Portada portada={album.portada} />
                          <div>
                            <h3>{album.titulo}</h3>
                            <p>{album.artista.nombre}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="inicio-cta">
        <div>
          <h2>{textos.cta.titulo}</h2>
          <p>{textos.cta.texto}</p>
        </div>
        <Button href="#registro">{textos.cta.botones.crearCuentaGratis}</Button>
      </section>
    </div>
  );
}
