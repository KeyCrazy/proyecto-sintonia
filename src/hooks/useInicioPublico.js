import { useEffect, useState } from "react";
import { codigoDeError, pedirJson } from "../utils/api.js";

const HEX_COLOR = /^#[\da-f]{6}$/i;

export function portadaValida(portada) {
  return (
    portada &&
    Number.isInteger(portada.patron) &&
    portada.patron >= 0 &&
    portada.patron <= 3 &&
    [portada.fondo, portada.figura, portada.detalle].every((color) =>
      HEX_COLOR.test(color),
    )
  );
}

export function validarGeneros(datos) {
  if (
    !Array.isArray(datos?.datos) ||
    !datos.datos.every(
      (genero) =>
        typeof genero.id === "string" &&
        typeof genero.nombre === "string" &&
        typeof genero.descripcion === "string" &&
        portadaValida(genero.portada) &&
        HEX_COLOR.test(genero.colorHex),
    )
  ) {
    throw new Error("La respuesta de géneros no tiene el formato esperado.");
  }

  return datos.datos;
}

export function validarAlbumesPopulares(datos) {
  if (
    !Array.isArray(datos?.datos) ||
    !datos.datos.every(
      (album) =>
        typeof album.id === "string" &&
        typeof album.titulo === "string" &&
        typeof album.artista?.nombre === "string" &&
        portadaValida(album.portada),
    )
  ) {
    throw new Error("La respuesta de álbumes populares no tiene el formato esperado.");
  }

  return datos.datos;
}

export function useInicioPublico(incluirAlbumesPopulares = true) {
  const [generos, setGeneros] = useState([]);
  const [albumesPopulares, setAlbumesPopulares] = useState([]);
  const [estadoGeneros, setEstadoGeneros] = useState("cargando");
  const [estadoAlbumesPopulares, setEstadoAlbumesPopulares] = useState("cargando");
  // Código del último error (textos.errores[codigo]) de cada petición.
  const [errorGeneros, setErrorGeneros] = useState(null);
  const [errorAlbumesPopulares, setErrorAlbumesPopulares] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    setEstadoGeneros("cargando");
    setEstadoAlbumesPopulares(incluirAlbumesPopulares ? "cargando" : "listo");
    if (!incluirAlbumesPopulares) setAlbumesPopulares([]);

    async function cargarGeneros() {
      try {
        const nuevosGeneros = validarGeneros(
          await pedirJson("generos", { signal: controlador.signal, simular: true }),
        );
        if (!vigente) return;

        setGeneros(nuevosGeneros);
        setEstadoGeneros("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar los géneros:", error);
        setErrorGeneros(codigoDeError(error));
        setEstadoGeneros("error");
      }
    }

    async function cargarAlbumesPopulares() {
      try {
        const albumes = validarAlbumesPopulares(
          await pedirJson("albumes?orden=populares&limite=6", {
            signal: controlador.signal,
            simular: true,
          }),
        );
        if (!vigente) return;
        setAlbumesPopulares(albumes);
        setEstadoAlbumesPopulares("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar los álbumes populares:", error);
        setErrorAlbumesPopulares(codigoDeError(error));
        setEstadoAlbumesPopulares("error");
      }
    }

    cargarGeneros();
    if (incluirAlbumesPopulares) cargarAlbumesPopulares();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [intento, incluirAlbumesPopulares]);

  return {
    generos,
    albumesPopulares,
    estadoGeneros,
    estadoAlbumesPopulares,
    errorGeneros,
    errorAlbumesPopulares,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
