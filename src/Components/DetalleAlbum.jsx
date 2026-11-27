import { useAlbum } from "../hooks/useAlbum.js";
import { useMedia } from "../hooks/useMedia.js";
import { useMetadatos } from "../hooks/useMetadatos.js";
import {
  formatearDuracion,
  formatearFecha,
  formatearNumero,
  partesDeFecha,
  plural,
  rellenar,
} from "../utils/formato.js";
import Button from "./base/Button.jsx";
import Card from "./base/Card.jsx";
import Portada from "./base/Portada.jsx";
import Tag from "./base/Tag.jsx";
import Icono from "./Icono.jsx";
import NoEncontrado from "./NoEncontrado.jsx";
import "./DetalleAlbum.css";

function nombreDelTipo(tipo, textos) {
  return (
    textos.paginas.album.encabezado.etiquetas.tipo[tipo] ??
    textos.general?.tipos?.[tipo] ??
    tipo
  );
}

// "{artista} · {anio} · …": el artista va en negrita y el resto en gris, como en Figma.
function Resumen({ album, textos, idioma, conAvatar }) {
  const encabezado = textos.paginas.album.encabezado;
  const [antes, despues = ""] = encabezado.etiquetas.resumen.split("{artista}");
  const valores = {
    anio: partesDeFecha(album.fechaPublicacion).anio,
    canciones: plural(encabezado.canciones, album.totalPistas ?? album.pistas.length),
    duracion: rellenar(encabezado.duracion, {
      minutos: formatearNumero(Math.max(1, Math.round(album.duracionSeg / 60)), idioma),
    }),
  };

  return (
    <p className="album-resumen cuerpo-p">
      {conAvatar && <Portada portada={album.portada} className="album-avatar" />}
      {rellenar(antes, valores)}
      <strong className="album-artista cuerpo-p-fuerte">{album.artista.nombre}</strong>
      {rellenar(despues, valores)}
    </p>
  );
}

function Pistas({ pistas, textos, idioma }) {
  const columnas = textos.paginas.album.tabla.etiquetas;

  return (
    <div className="album-pistas">
      <div className="album-pistas-encabezado detalle-etiqueta" aria-hidden="true">
        <span>{columnas.numero}</span>
        <span className="album-pistas-titulo">{columnas.titulo}</span>
        <span>{columnas.reproducciones}</span>
        <span className="album-pistas-reloj" title={columnas.duracion}>
          <Icono nombre="reloj" />
        </span>
      </div>
      <ol className="album-lista-pistas">
        {pistas.map((pista) => (
          <li className="album-pista" key={pista.id}>
            <span className="album-pista-numero cuerpo-p">{pista.numero}</span>
            <Portada portada={pista.portada} className="album-pista-portada" />
            <span className="album-pista-texto">
              <span className="album-pista-titulo cuerpo-m-fuerte">{pista.titulo}</span>
              <span className="album-pista-artista cuerpo-p">{pista.artista.nombre}</span>
            </span>
            {Number.isFinite(pista.reproducciones) && (
              <span className="album-pista-reproducciones cuerpo-p">
                <span className="solo-lectores">{columnas.reproducciones}: </span>
                {formatearNumero(pista.reproducciones, idioma)}
              </span>
            )}
            <time
              className="album-pista-duracion cuerpo-p"
              dateTime={`PT${Math.floor(pista.duracionSeg / 60)}M${pista.duracionSeg % 60}S`}
            >
              <span className="solo-lectores">{columnas.duracion}: </span>
              {formatearDuracion(pista.duracionSeg)}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MasDelArtista({ album, textos, claseTitulo }) {
  const seccion = textos.paginas.album.masDelArtista;

  return (
    <section className="album-mas" aria-labelledby="album-mas-titulo">
      <h2 id="album-mas-titulo" className={claseTitulo}>
        {rellenar(seccion.titulo, { artista: album.artista.nombre })}
      </h2>
      <div className="album-mas-lista">
        {album.masDelArtista.map((otro) => (
          <Card
            className="album-mas-tarjeta"
            key={otro.id}
            titulo={otro.titulo}
            subtitulo={rellenar(seccion.etiquetas.anioYTipo, {
              anio: partesDeFecha(otro.fechaPublicacion).anio,
              tipo: nombreDelTipo(otro.tipo, textos),
            })}
            portada={otro.portada}
            href={`/albumes/${encodeURIComponent(otro.id)}`}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Vista 3 · Detalle de un álbum (/albumes/:id) con datos de GET /albumes/:id.
 * `textos` es el objeto completo de textos de la API.
 */
export default function DetalleAlbum({ id, textos, idioma }) {
  const { album, estado, reintentar } = useAlbum(id);
  const movil = useMedia("(max-width: 40rem)");
  const paginaAlbum = textos.paginas.album;
  const nombreSitio = textos.sitio?.nombre ?? "Sintonía";

  // Equivalente a generateMetadata: título y descripción a partir del álbum.
  useMetadatos({
    titulo: album
      ? rellenar(paginaAlbum.seo.titulo, { titulo: `${album.titulo} · ${album.artista.nombre}` })
      : null,
    descripcion: album
      ? `${album.titulo} · ${album.artista.nombre}. ${paginaAlbum.seo.descripcion}`
      : null,
  });

  if (estado === "noEncontrado") {
    return (
      <NoEncontrado
        titulo={paginaAlbum.noEncontrado.titulo}
        texto={paginaAlbum.noEncontrado.texto}
        boton={paginaAlbum.noEncontrado.botones.volver}
        href="/catalogo"
        tituloSitio={nombreSitio}
      />
    );
  }

  return (
    <div className="album">
      <a className="album-volver" href="/catalogo" aria-label={textos.general?.acciones?.volver}>
        <Icono nombre="atras" />
      </a>

      {estado === "cargando" && (
        <p className="album-estado cuerpo-p" role="status">{textos.estados.cargando.aria}</p>
      )}

      {estado === "error" && (
        <div className="album-error" role="alert">
          <h1 id="titulo-album" className="titular-h4">{textos.estados.error.titulo}</h1>
          <p className="cuerpo-p">{textos.estados.error.descripcion}</p>
          <Button onClick={reintentar}>{textos.estados.error.botones.reintentar}</Button>
        </div>
      )}

      {estado === "listo" && album && (
        <>
          <header className="album-cabecera">
            <Portada portada={album.portada} className="album-portada" />
            <div className="album-info">
              <div className="album-etiquetas">
                <Tag variante={movil ? "violeta" : "neutro"}>{nombreDelTipo(album.tipo, textos)}</Tag>
                <Tag
                  variante="neutro"
                  href={`/catalogo?genero=${encodeURIComponent(album.genero.id)}`}
                >
                  {album.genero.nombre}
                </Tag>
              </div>
              <h1 id="titulo-album" className={`album-titulo ${movil ? "titular-h2" : "titular-display"}`}>
                {album.titulo}
              </h1>
              <Resumen album={album} textos={textos} idioma={idioma} conAvatar={!movil} />
            </div>
          </header>

          <Pistas pistas={album.pistas} textos={textos} idioma={idioma} />

          <p className="album-fecha cuerpo-p">
            <time dateTime={album.fechaPublicacion}>
              {formatearFecha(album.fechaPublicacion, idioma)}
            </time>
          </p>

          {album.masDelArtista.length > 0 && (
            <MasDelArtista
              album={album}
              textos={textos}
              claseTitulo={movil ? "titular-h3" : "titular-h2"}
            />
          )}
        </>
      )}
    </div>
  );
}
