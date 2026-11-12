import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";

const HEX_COLOR = /^#[\da-f]{6}$/i;

function portadaValida(portada) {
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

function validarGeneros(datos) {
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

function validarDetalleGenero(datos) {
  if (
    !datos ||
    typeof datos.id !== "string" ||
    !Array.isArray(datos.albumes) ||
    !datos.albumes.every(
      (album) =>
        typeof album.id === "string" &&
        typeof album.titulo === "string" &&
        typeof album.artista?.nombre === "string" &&
        portadaValida(album.portada),
    )
  ) {
    throw new Error("La respuesta del género no tiene el formato esperado.");
  }

  return datos;
}

export function useInicioPublico() {
  const [generos, setGeneros] = useState([]);
  const [generoId, setGeneroId] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [estadoGeneros, setEstadoGeneros] = useState("cargando");
  const [estadoDetalle, setEstadoDetalle] = useState("inactivo");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;

    async function cargarGeneros() {
      setEstadoGeneros("cargando");

      try {
        const respuesta = await fetch(crearUrlApi("generos"), {
          signal: controlador.signal,
        });
        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`);
        }

        const nuevosGeneros = validarGeneros(await respuesta.json());
        if (!vigente) return;

        setGeneros(nuevosGeneros);
        setGeneroId((actual) =>
          nuevosGeneros.some((genero) => genero.id === actual)
            ? actual
            : (nuevosGeneros[0]?.id ?? ""),
        );
        setEstadoGeneros("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar los géneros:", error);
        setEstadoGeneros("error");
      }
    }

    cargarGeneros();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [intento]);

  useEffect(() => {
    if (!generoId) {
      setDetalle(null);
      setEstadoDetalle("inactivo");
      return undefined;
    }

    const controlador = new AbortController();
    let vigente = true;

    async function cargarDetalle() {
      setDetalle(null);
      setEstadoDetalle("cargando");

      try {
        const respuesta = await fetch(
          crearUrlApi(`generos/${encodeURIComponent(generoId)}`),
          { signal: controlador.signal },
        );
        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`);
        }

        const nuevoDetalle = validarDetalleGenero(await respuesta.json());
        if (!vigente) return;
        setDetalle(nuevoDetalle);
        setEstadoDetalle("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar los álbumes del género:", error);
        setEstadoDetalle("error");
      }
    }

    cargarDetalle();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [generoId, intento]);

  return {
    generos,
    generoId,
    seleccionarGenero: setGeneroId,
    detalle,
    estadoGeneros,
    estadoDetalle,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
