import { useCatalogo } from "../hooks/useCatalogo.js";
import { useMedia } from "../hooks/useMedia.js";
import Card from "./base/Card.jsx";
import Esqueleto from "./base/Esqueleto.jsx";
import {
  EsqueletoFilas,
  EsqueletoTarjetas,
  EstadoCarga,
  EstadoError,
  EstadoVacio,
} from "./Estados.jsx";
import "./Catalogo.css";

// Esqueleto de la grilla de géneros: mismas celdas que las tarjetas de género.
function EsqueletoGeneros() {
  return (
    <div className="catalogo-lista-generos" aria-hidden="true">
      {Array.from({ length: 12 }, (_, indice) => (
        <Esqueleto className="catalogo-genero catalogo-genero-esqueleto" key={indice} />
      ))}
    </div>
  );
}

// Esqueleto del detalle de un género: artistas, álbumes y canciones.
function EsqueletoDetalleGenero() {
  return (
    <div className="catalogo-detalle">
      <section>
        <Esqueleto forma="texto" ancho="20%" className="catalogo-esqueleto-titulo" />
        <div className="catalogo-artistas-lista" aria-hidden="true">
          {Array.from({ length: 6 }, (_, indice) => (
            <span className="catalogo-artista" key={indice}>
              <Esqueleto forma="circulo" className="catalogo-artista-avatar" />
              <Esqueleto forma="texto" ancho="70%" />
            </span>
          ))}
        </div>
      </section>
      <section>
        <Esqueleto forma="texto" ancho="25%" className="catalogo-esqueleto-titulo" />
        <EsqueletoTarjetas cantidad={6} className="catalogo-albumes-lista" claseTarjeta="catalogo-album" />
      </section>
      <section>
        <Esqueleto forma="texto" ancho="30%" className="catalogo-esqueleto-titulo" />
        <EsqueletoFilas cantidad={5} />
      </section>
    </div>
  );
}

function Albumes({ albumes }) {
  return (
    <div className="catalogo-albumes-lista">
      {albumes.map((album) => (
        <Card
          className="catalogo-album"
          key={album.id}
          titulo={album.titulo}
          subtitulo={album.artista.nombre}
          portada={album.portada}
          href={`/albumes/${encodeURIComponent(album.id)}`}
        />
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
            <span className="catalogo-pista-numero detalle-nota">{indice + 1}</span>
            <span className="catalogo-pista-info">
              <span className="catalogo-pista-titulo detalle-nota">{pista.titulo}</span>
              <span className="catalogo-pista-artista detalle-nota">{pista.artista.nombre}</span>
            </span>
            <time className="catalogo-pista-duracion detalle-nota">
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
    errorGeneros,
    errorAlbumesPopulares,
    errorDetalle,
    reintentar,
  } = useCatalogo(generoId);
  const generoLista = generos.find((genero) => genero.id === generoId);
  const catalogo = textos.paginas.catalogo;
  // Las clases de Figma tienen tamaño fijo: se elige una según el ancho de pantalla.
  const movil = useMedia("(max-width: 40rem)");
  const claseSeccion = movil ? "titular-h4" : "titular-h3";
  const tituloGenero = detalleGenero?.nombre ?? generoLista?.nombre;
  const subtituloGenero = detalleGenero?.descripcion ?? generoLista?.descripcion;

  return (
    <div className={`catalogo${generoId ? " catalogo-con-genero" : ""}`}>
      <header className="catalogo-encabezado">
        <h1 id="titulo-catalogo" className="titular-h2">
          {generoId ? (tituloGenero ?? catalogo.encabezado.titulo) : catalogo.encabezado.titulo}
        </h1>
        <p className="detalle-nota">
          {generoId ? subtituloGenero : catalogo.encabezado.subtitulo}
        </p>
      </header>

      <section className="catalogo-generos" aria-labelledby="catalogo-generos-titulo">
        <h2 id="catalogo-generos-titulo" className={claseSeccion}>{catalogo.generos.titulo}</h2>
        {estadoGeneros === "cargando" && (
          <EstadoCarga textos={textos}>
            <EsqueletoGeneros />
          </EstadoCarga>
        )}
        {estadoGeneros === "error" && (
          <EstadoError textos={textos} codigo={errorGeneros} reintentar={reintentar} />
        )}
        {estadoGeneros === "listo" && generos.length === 0 && (
          <EstadoVacio texto={estados.vacio.generico} />
        )}
        {estadoGeneros === "listo" && generos.length > 0 && (
          <nav className="catalogo-lista-generos" aria-label={catalogo.generos.titulo}>
            {generos.map((genero) => {
              const seleccionado = genero.id === generoId;
              return (
                <Card
                  variante="genero"
                  className="catalogo-genero"
                  key={genero.id}
                  titulo={genero.nombre}
                  portada={genero.portada}
                  color={genero.color ?? genero.colorHex}
                  seleccionado={seleccionado}
                  href={seleccionado ? "/catalogo" : `/catalogo?genero=${encodeURIComponent(genero.id)}`}
                  aria-label={
                    seleccionado
                      ? `${genero.nombre}, ${catalogo.generos.aria.seleccionado}`
                      : genero.nombre
                  }
                />
              );
            })}
          </nav>
        )}
      </section>

      {!generoId && (
        <section className="catalogo-destacados" aria-labelledby="catalogo-destacados-titulo">
          <div className="catalogo-seccion-encabezado">
            <h2 id="catalogo-destacados-titulo" className={claseSeccion}>{catalogo.destacados.titulo}</h2>
            <a href="/catalogo" className="catalogo-descubrir detalle-nota-fuerte">
              {catalogo.destacados.enlaces.descubrirMas}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          {estadoAlbumesPopulares === "cargando" && (
            <EstadoCarga textos={textos}>
              <EsqueletoTarjetas cantidad={6} className="catalogo-albumes-lista" claseTarjeta="catalogo-album" />
            </EstadoCarga>
          )}
          {estadoAlbumesPopulares === "error" && (
            <EstadoError textos={textos} codigo={errorAlbumesPopulares} reintentar={reintentar} />
          )}
          {estadoAlbumesPopulares === "listo" && albumesPopulares.length === 0 && (
            <EstadoVacio texto={estados.vacio.generico} />
          )}
          {estadoAlbumesPopulares === "listo" && albumesPopulares.length > 0 && (
            <Albumes albumes={albumesPopulares} />
          )}
        </section>
      )}

      {generoId && estadoDetalle === "cargando" && (
        <EstadoCarga textos={textos}>
          <EsqueletoDetalleGenero />
        </EstadoCarga>
      )}
      {generoId && estadoDetalle === "error" && (
        <EstadoError textos={textos} codigo={errorDetalle} reintentar={reintentar} />
      )}
      {generoId && estadoDetalle === "listo" && detalleGenero && (
        <div className="catalogo-detalle">
          <section className="catalogo-artistas" aria-labelledby="catalogo-artistas-titulo">
            <h2 id="catalogo-artistas-titulo" className={claseSeccion}>{catalogo.genero.artistas.titulo}</h2>
            {detalleGenero.artistas.length === 0 ? (
              <EstadoVacio texto={estados.vacio.generico} />
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
                    <span className="catalogo-artista-nombre detalle-nota">{artista.nombre}</span>
                    <span className="catalogo-artista-etiqueta detalle-nota">
                      {catalogo.genero.artistas.etiqueta}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="catalogo-albumes" aria-labelledby="catalogo-albumes-titulo">
            <h2 id="catalogo-albumes-titulo" className={claseSeccion}>
              {catalogo.genero.albumes.titulo.replace("{genero}", detalleGenero.nombre)}
            </h2>
            {detalleGenero.albumes.length === 0 ? (
              <EstadoVacio titulo={catalogo.vacio.titulo} texto={catalogo.vacio.texto} />
            ) : (
              <Albumes albumes={detalleGenero.albumes} />
            )}
          </section>

          <section className="catalogo-canciones" aria-labelledby="catalogo-canciones-titulo">
            <h2 id="catalogo-canciones-titulo" className={claseSeccion}>{catalogo.genero.canciones.titulo}</h2>
            {detalleGenero.pistas.length === 0 ? (
              <EstadoVacio texto={estados.vacio.generico} />
            ) : (
              <Pistas pistas={detalleGenero.pistas} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
