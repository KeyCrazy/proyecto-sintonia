import { useEffect, useState } from "react";
import { portadaValida } from "./useInicioPublico.js";
import { crearUrlApi } from "../utils/api.js";

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function albumResumidoValido(album) {
  return (
    typeof album?.id === "string" &&
    typeof album.titulo === "string" &&
    typeof album.tipo === "string" &&
    FECHA.test(album.fechaPublicacion) &&
    portadaValida(album.portada)
  );
}

function validarAlbum(album) {
  const valido =
    albumResumidoValido(album) &&
    typeof album.artista?.id === "string" &&
    typeof album.artista.nombre === "string" &&
    typeof album.genero?.id === "string" &&
    typeof album.genero.nombre === "string" &&
    Number.isFinite(album.duracionSeg) &&
    Array.isArray(album.pistas) &&
    album.pistas.every(
      (pista) =>
        typeof pista.id === "string" &&
        typeof pista.titulo === "string" &&
        Number.isInteger(pista.numero) &&
        Number.isFinite(pista.duracionSeg) &&
        typeof pista.artista?.nombre === "string" &&
        portadaValida(pista.portada),
    ) &&
    Array.isArray(album.masDelArtista) &&
    album.masDelArtista.every(albumResumidoValido);

  if (!valido) throw new Error("La respuesta del álbum no tiene el formato esperado.");
  return album;
}

/**
 * Carga GET /albumes/:id.
 * estado: "cargando" | "listo" | "noEncontrado" (404 no_encontrado) | "error"
 */
export function useAlbum(id) {
  const [album, setAlbum] = useState(null);
  const [estado, setEstado] = useState("cargando");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    setAlbum(null);
    setEstado("cargando");

    async function cargar() {
      try {
        const respuesta = await fetch(crearUrlApi(`albumes/${encodeURIComponent(id)}`), {
          signal: controlador.signal,
        });

        if (respuesta.status === 404) {
          const cuerpo = await respuesta.json().catch(() => null);
          if (cuerpo?.error?.codigo === "no_encontrado" || !cuerpo) {
            if (vigente) setEstado("noEncontrado");
            return;
          }
        }
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const datos = validarAlbum(await respuesta.json());
        if (!vigente) return;
        setAlbum(datos);
        setEstado("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar el álbum:", error);
        setEstado("error");
      }
    }

    cargar();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [id, intento]);

  return { album, estado, reintentar: () => setIntento((actual) => actual + 1) };
}
