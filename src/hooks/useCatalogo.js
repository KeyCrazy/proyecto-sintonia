import { useEffect, useState } from "react";
import {
  portadaValida,
  useInicioPublico,
} from "./useInicioPublico.js";
import { crearUrlApi } from "../utils/api.js";

function validarDetalleGenero(genero) {
  const listasValidas =
    Array.isArray(genero?.artistas) &&
    genero.artistas.every(
      (artista) =>
        typeof artista.id === "string" &&
        typeof artista.nombre === "string" &&
        portadaValida(artista.portada),
    ) &&
    Array.isArray(genero?.albumes) &&
    genero.albumes.every(
      (album) =>
        typeof album.id === "string" &&
        typeof album.titulo === "string" &&
        typeof album.artista?.nombre === "string" &&
        portadaValida(album.portada),
    ) &&
    Array.isArray(genero?.pistas) &&
    genero.pistas.every(
      (pista) =>
        typeof pista.id === "string" &&
        typeof pista.titulo === "string" &&
        Number.isFinite(pista.duracionSeg) &&
        typeof pista.artista?.nombre === "string",
    );

  if (
    typeof genero?.id !== "string" ||
    typeof genero.nombre !== "string" ||
    typeof genero.descripcion !== "string" ||
    !portadaValida(genero.portada) ||
    !listasValidas
  ) {
    throw new Error("La respuesta del género no tiene el formato esperado.");
  }

  return genero;
}

export function useCatalogo(generoId) {
  const {
    generos,
    albumesPopulares,
    estadoGeneros,
    estadoAlbumesPopulares,
    reintentar: reintentarListas,
  } = useInicioPublico(!generoId);
  const [detalleGenero, setDetalleGenero] = useState(null);
  const [estadoDetalle, setEstadoDetalle] = useState(
    generoId ? "cargando" : "inactivo",
  );
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!generoId) {
      setDetalleGenero(null);
      setEstadoDetalle("inactivo");
      return undefined;
    }

    const controlador = new AbortController();
    let vigente = true;
    setDetalleGenero(null);
    setEstadoDetalle("cargando");

    async function cargarDetalle() {
      try {
        const respuesta = await fetch(
          crearUrlApi(`generos/${encodeURIComponent(generoId)}`),
          { signal: controlador.signal },
        );
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const detalle = validarDetalleGenero(await respuesta.json());
        if (!vigente) return;
        setDetalleGenero(detalle);
        setEstadoDetalle("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar el detalle del género:", error);
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
    albumesPopulares,
    detalleGenero,
    estadoGeneros,
    estadoAlbumesPopulares,
    estadoDetalle,
    reintentar: () => {
      reintentarListas();
      setIntento((actual) => actual + 1);
    },
  };
}
