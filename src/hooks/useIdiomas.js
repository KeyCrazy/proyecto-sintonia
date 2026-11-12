import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";

function validarIdiomas(datos) {
  if (
    !Array.isArray(datos?.datos) ||
    datos.datos.length === 0 ||
    !datos.datos.every(
      (idioma) =>
        idioma &&
        typeof idioma.codigo === "string" &&
        typeof idioma.nombre === "string" &&
        idioma.codigo.trim() &&
        idioma.nombre.trim(),
    ) ||
    typeof datos.predeterminado !== "string" ||
    !datos.datos.some((idioma) => idioma.codigo === datos.predeterminado) ||
    new Set(datos.datos.map((idioma) => idioma.codigo)).size !==
      datos.datos.length
  ) {
    throw new Error("La respuesta de idiomas no tiene el formato esperado.");
  }

  return datos.datos;
}

export function useIdiomas() {
  const [idiomas, setIdiomas] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    setEstado("cargando");

    async function cargarIdiomas() {
      try {
        const respuesta = await fetch(crearUrlApi("idiomas"), {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const nuevosIdiomas = validarIdiomas(await respuesta.json());
        if (!vigente) return;
        setIdiomas(nuevosIdiomas);
        setEstado("listo");
      } catch (error) {
        if (!vigente || controlador.signal.aborted) return;
        console.error("Error al cargar los idiomas:", error);
        setEstado("error");
      }
    }

    cargarIdiomas();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [intento]);

  return {
    idiomas,
    estado,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
