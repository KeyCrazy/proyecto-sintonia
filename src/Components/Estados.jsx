import Aviso from "./base/Aviso.jsx";
import Button from "./base/Button.jsx";
import Esqueleto from "./base/Esqueleto.jsx";
import "./Estados.css";

/*
 * Estados de carga, vacío y error de las vistas (equivalen a loading.tsx y error.tsx de Next).
 * Todos los mensajes salen de textos.estados y textos.errores de la API.
 */

/**
 * Carga: anuncia "Cargando contenido" al lector de pantalla y muestra esqueletos.
 *   <EstadoCarga textos={textos}><EsqueletoTarjetas cantidad={6} /></EstadoCarga>
 */
export function EstadoCarga({ textos, children, className = "" }) {
  return (
    <div className={`estado-carga ${className}`.trim()} role="status" aria-busy="true">
      <span className="solo-lectores">{textos.estados.cargando.aria}</span>
      {children}
    </div>
  );
}

/**
 * Vacío: aviso de información con un mensaje claro.
 *   <EstadoVacio texto={textos.estados.vacio.generico} />
 *   <EstadoVacio titulo={catalogo.vacio.titulo} texto={catalogo.vacio.texto} />
 */
export function EstadoVacio({ titulo, texto }) {
  return <Aviso tipo="info" className="estado-aviso" titulo={titulo} texto={texto} />;
}

/**
 * Error: aviso con el mensaje de textos.errores[codigo] y botón para reintentar.
 *   <EstadoError textos={textos} codigo="falla_simulada" reintentar={reintentar} />
 * Sin red (codigo "sin_conexion") el título es el de textos.estados.sinConexion.
 */
export function EstadoError({ textos, codigo, reintentar }) {
  const { estados, errores } = textos;
  const titulo =
    codigo === "sin_conexion"
      ? (estados.sinConexion?.titulo ?? estados.error.titulo)
      : estados.error.titulo;
  const texto = errores?.[codigo] ?? estados.error.descripcion;

  return (
    <Aviso tipo="error" className="estado-aviso" titulo={titulo} texto={texto}>
      <Button onClick={reintentar}>{estados.error.botones.reintentar}</Button>
    </Aviso>
  );
}

/**
 * Esqueleto de una fila de tarjetas de álbum (portada + título + subtítulo).
 * `className` es la clase de la lista de la vista, para que ocupe la misma grilla.
 */
export function EsqueletoTarjetas({ cantidad = 6, className = "", claseTarjeta = "" }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: cantidad }, (_, indice) => (
        <div className={`esqueleto-tarjeta ${claseTarjeta}`.trim()} key={indice}>
          <Esqueleto forma="cuadrado" />
          <Esqueleto forma="texto" ancho="75%" />
          <Esqueleto forma="texto" ancho="50%" />
        </div>
      ))}
    </div>
  );
}

/** Esqueleto de una lista de canciones (portada pequeña + dos líneas + duración). */
export function EsqueletoFilas({ cantidad = 5 }) {
  return (
    <div className="esqueleto-filas" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, indice) => (
        <div className="esqueleto-fila" key={indice}>
          <Esqueleto className="esqueleto-fila-portada" />
          <span className="esqueleto-fila-texto">
            <Esqueleto forma="texto" ancho={`${45 - (indice % 3) * 8}%`} />
            <Esqueleto forma="texto" ancho="25%" />
          </span>
          <Esqueleto forma="texto" className="esqueleto-fila-duracion" />
        </div>
      ))}
    </div>
  );
}
