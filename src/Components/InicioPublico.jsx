import { useInicioPublico } from "../hooks/useInicioPublico.js";
import { useMedia } from "../hooks/useMedia.js";
import ilustracionInicio from "../assets/inicio-ilustracion.png";
import Button from "./base/Button.jsx";
import Card from "./base/Card.jsx";
import Esqueleto from "./base/Esqueleto.jsx";
import Tag from "./base/Tag.jsx";
import { EsqueletoTarjetas, EstadoCarga, EstadoError, EstadoVacio } from "./Estados.jsx";
import "./InicioPublico.css";

export default function InicioPublico({ textos, estados, errores }) {
  const {
    generos,
    albumesPopulares,
    estadoGeneros,
    estadoAlbumesPopulares,
    errorGeneros,
    errorAlbumesPopulares,
    reintentar,
  } = useInicioPublico();
  // Los estados compartidos leen textos.estados y textos.errores.
  const textosEstados = { estados, errores };
  // Las clases de Figma tienen tamaño fijo: se elige una según el ancho de pantalla.
  const movil = useMedia("(max-width: 30rem)");
  const muyAncha = useMedia("(min-width: 110rem)");
  const claseTitular = movil ? "titular-h1" : muyAncha ? "titular-gigante" : "titular-display";
  const claseSeccion = movil ? "titular-h3" : "titular-h2";

  return (
    <div className="inicio-publico">
      <section className="inicio-hero" aria-labelledby="titulo-inicio">
        <div className="inicio-hero-contenido">
          <Tag className="inicio-etiqueta">{textos.hero.etiquetas.temporada}</Tag>
          <h1 className={`inicio-hero-titulo ${claseTitular}`} id="titulo-inicio">{textos.hero.titulo}</h1>
          <p className="inicio-hero-subtitulo cuerpo-m">{textos.hero.subtitulo}</p>
          <div className="inicio-hero-acciones">
            <Button href="/#registro">{textos.hero.botones.crearCuentaGratis}</Button>
            <Button href="/catalogo" variante="secondary">{textos.hero.botones.explorarCatalogo}</Button>
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
          <EstadoCarga textos={textosEstados}>
            <EsqueletoTarjetas cantidad={6} className="inicio-destacados-lista" claseTarjeta="inicio-destacado" />
          </EstadoCarga>
        )}
        {estadoAlbumesPopulares === "error" && (
          <EstadoError textos={textosEstados} codigo={errorAlbumesPopulares} reintentar={reintentar} />
        )}
        {estadoAlbumesPopulares === "listo" && albumesPopulares.length === 0 && (
          <EstadoVacio texto={estados.vacio.generico} />
        )}
        {estadoAlbumesPopulares === "listo" && albumesPopulares.length > 0 && (
          <div className="inicio-destacados-lista">
            {albumesPopulares.map((album) => (
              <Card
                className="inicio-destacado"
                key={album.id}
                titulo={album.titulo}
                subtitulo={album.artista.nombre}
                portada={album.portada}
                href={`/albumes/${encodeURIComponent(album.id)}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="inicio-generos" aria-labelledby="inicio-generos-titulo">
        <div className="inicio-seccion-encabezado">
          <h2 id="inicio-generos-titulo" className={claseSeccion}>{textos.generos.titulo}</h2>
          <Button href="/catalogo" variante="secondary">{textos.generos.enlaces.verCatalogo}</Button>
        </div>

        {estadoGeneros === "cargando" && (
          <EstadoCarga textos={textosEstados}>
            <div className="inicio-lista-generos" aria-hidden="true">
              {Array.from({ length: 8 }, (_, indice) => (
                <Esqueleto className="inicio-genero inicio-genero-esqueleto" key={indice} />
              ))}
            </div>
          </EstadoCarga>
        )}
        {estadoGeneros === "error" && (
          <EstadoError textos={textosEstados} codigo={errorGeneros} reintentar={reintentar} />
        )}
        {estadoGeneros === "listo" && generos.length === 0 && (
          <EstadoVacio texto={estados.vacio.generico} />
        )}
        {estadoGeneros === "listo" && generos.length > 0 && (
          <div className="inicio-lista-generos" role="group" aria-labelledby="inicio-generos-titulo">
            {generos.slice(0, 8).map((genero) => (
              <Card
                variante="genero"
                className="inicio-genero"
                key={genero.id}
                titulo={genero.nombre}
                portada={genero.portada}
                color={genero.color ?? genero.colorHex}
                href={`/catalogo?genero=${encodeURIComponent(genero.id)}`}
              />
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
