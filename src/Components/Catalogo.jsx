import { useCatalogo } from "../hooks/useCatalogo.js";
import Button from "./base/Button.jsx";
import Portada from "./base/Portada.jsx";
import "./Catalogo.css";

function EstadoCarga({ etiqueta }) {
  return <p className="catalogo-estado" role="status">{etiqueta}</p>;
}

function EstadoError({ textos, reintentar }) {
  return (
    <div className="catalogo-error" role="alert">
      <h3>{textos.titulo}</h3>
      <p>{textos.descripcion}</p>
      <Button onClick={reintentar}>{textos.botones.reintentar}</Button>
    </div>
  );
}

function Albumes({ albumes }) {
  return (
    <div className="catalogo-albumes-lista">
      {albumes.map((album) => (
        <a
          className="catalogo-album"
          href={`/${encodeURIComponent(album.id)}`}
          key={album.id}
        >
          <Portada portada={album.portada} />
          <span className="catalogo-album-titulo">{album.titulo}</span>
          <span className="catalogo-album-artista">{album.artista.nombre}</span>
        </a>
      ))}
    </div>
  );
}

function Pistas({ pistas }) {
  return (
    <ol className="catalogo-pistas">
      {pistas.map((pista, indice) => (
        <li key={pista.id}>
          <a
            href={`/${encodeURIComponent(pista.id)}`}
            className="catalogo-pista"
          >
            <span className="catalogo-pista-numero">{indice + 1}</span>
            <span className="catalogo-pista-info">
              <span className="catalogo-pista-titulo">{pista.titulo}</span>
              <span className="catalogo-pista-artista">{pista.artista.nombre}</span>
            </span>
            <time className="catalogo-pista-duracion">
              {Math.floor(pista.duracionSeg / 60)}:
              {String(pista.duracionSeg % 60).padStart(2, "0")}
            </time>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function Catalogo({ textos, estados }) {
  const generoId = new URLSearchParams(window.location.search).get("genero");
  const {
    generos,
    albumesPopulares,
    detalleGenero,
    estadoGeneros,
    estadoAlbumesPopulares,
    estadoDetalle,
    reintentar,
  } = useCatalogo(generoId);
  const generoLista = generos.find((genero) => genero.id === generoId);
  const catalogo = textos.paginas.catalogo;
  const tituloGenero = detalleGenero?.nombre ?? generoLista?.nombre;
  const subtituloGenero = detalleGenero?.descripcion ?? generoLista?.descripcion;

  return (
    <div className={`catalogo${generoId ? " catalogo-con-genero" : ""}`}>
      <header className="catalogo-encabezado">
        <h1 id="titulo-catalogo">
          {generoId ? (tituloGenero ?? catalogo.encabezado.titulo) : catalogo.encabezado.titulo}
        </h1>
        <p>
          {generoId ? subtituloGenero : catalogo.encabezado.subtitulo}
        </p>
      </header>

      <section className="catalogo-generos" aria-labelledby="catalogo-generos-titulo">
        <h2 id="catalogo-generos-titulo">{catalogo.generos.titulo}</h2>
        {estadoGeneros === "cargando" && <EstadoCarga etiqueta={estados.cargando.aria} />}
        {estadoGeneros === "error" && (
          <EstadoError textos={estados.error} reintentar={reintentar} />
        )}
        {estadoGeneros === "listo" && generos.length === 0 && (
          <p className="catalogo-estado">{estados.vacio.generico}</p>
        )}
        {estadoGeneros === "listo" && generos.length > 0 && (
          <nav className="catalogo-lista-generos" aria-label={catalogo.generos.titulo}>
            {generos.map((genero) => {
              const seleccionado = genero.id === generoId;
              return (
                <a
                  className="catalogo-genero"
                  href={seleccionado ? "/catalogo" : `/catalogo?genero=${encodeURIComponent(genero.id)}`}
                  key={genero.id}
                  aria-current={seleccionado ? "true" : undefined}
                  aria-label={
                    seleccionado
                      ? `${genero.nombre}, ${catalogo.generos.aria.seleccionado}`
                      : genero.nombre
                  }
                  style={{ "--color-genero": genero.colorHex }}
                >
                  <span>{genero.nombre}</span>
                  <Portada className="catalogo-genero-portada" portada={genero.portada} />
                </a>
              );
            })}
          </nav>
        )}
      </section>

      {!generoId && (
        <section className="catalogo-destacados" aria-labelledby="catalogo-destacados-titulo">
          <div className="catalogo-seccion-encabezado">
            <h2 id="catalogo-destacados-titulo">{catalogo.destacados.titulo}</h2>
            <a href="/catalogo" className="catalogo-descubrir">
              {catalogo.destacados.enlaces.descubrirMas}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          {estadoAlbumesPopulares === "cargando" && <EstadoCarga etiqueta={estados.cargando.aria} />}
          {estadoAlbumesPopulares === "error" && (
            <EstadoError textos={estados.error} reintentar={reintentar} />
          )}
          {estadoAlbumesPopulares === "listo" && albumesPopulares.length === 0 && (
            <p className="catalogo-estado">{estados.vacio.generico}</p>
          )}
          {estadoAlbumesPopulares === "listo" && albumesPopulares.length > 0 && (
            <Albumes albumes={albumesPopulares} />
          )}
        </section>
      )}

      {generoId && estadoDetalle === "cargando" && (
        <EstadoCarga etiqueta={estados.cargando.aria} />
      )}
      {generoId && estadoDetalle === "error" && (
        <EstadoError textos={estados.error} reintentar={reintentar} />
      )}
      {generoId && estadoDetalle === "listo" && detalleGenero && (
        <div className="catalogo-detalle">
          <section className="catalogo-artistas" aria-labelledby="catalogo-artistas-titulo">
            <h2 id="catalogo-artistas-titulo">{catalogo.genero.artistas.titulo}</h2>
            {detalleGenero.artistas.length === 0 ? (
              <p className="catalogo-estado">{estados.vacio.generico}</p>
            ) : (
              <div className="catalogo-artistas-lista">
                {detalleGenero.artistas.map((artista) => (
                  <a
                    className="catalogo-artista"
                    href={`/${encodeURIComponent(artista.id)}`}
                    key={artista.id}
                  >
                    <span
                      className="catalogo-artista-avatar"
                      style={{ backgroundColor: artista.portada.fondo }}
                      aria-hidden="true"
                    />
                    <span className="catalogo-artista-nombre">{artista.nombre}</span>
                    <span className="catalogo-artista-etiqueta">
                      {catalogo.genero.artistas.etiqueta}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="catalogo-albumes" aria-labelledby="catalogo-albumes-titulo">
            <h2 id="catalogo-albumes-titulo">
              {catalogo.genero.albumes.titulo.replace("{genero}", detalleGenero.nombre)}
            </h2>
            {detalleGenero.albumes.length === 0 ? (
              <p className="catalogo-estado">{catalogo.vacio.texto}</p>
            ) : (
              <Albumes albumes={detalleGenero.albumes} />
            )}
          </section>

          <section className="catalogo-canciones" aria-labelledby="catalogo-canciones-titulo">
            <h2 id="catalogo-canciones-titulo">{catalogo.genero.canciones.titulo}</h2>
            {detalleGenero.pistas.length === 0 ? (
              <p className="catalogo-estado">{estados.vacio.generico}</p>
            ) : (
              <Pistas pistas={detalleGenero.pistas} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
