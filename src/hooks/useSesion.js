import { useEffect, useState } from "react";
import { pedirJson } from "../utils/api.js";

/**
 * Sesión actual con GET /sesion (usa la cookie httpOnly `sesion` de la API).
 * usuario: el usuario con sesión, o null si no hay sesión (401) o la petición falla.
 * estado: "cargando" | "listo"
 */
export function useSesion() {
  const [usuario, setUsuario] = useState(null);
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    const controlador = new AbortController();

    pedirJson("sesion", { signal: controlador.signal, conSesion: true })
      .then((datos) => {
        setUsuario(typeof datos?.nombre === "string" ? datos : null);
        setEstado("listo");
      })
      .catch(() => {
        if (controlador.signal.aborted) return;
        setUsuario(null);
        setEstado("listo");
      });

    return () => controlador.abort();
  }, []);

  return { usuario, estado };
}
