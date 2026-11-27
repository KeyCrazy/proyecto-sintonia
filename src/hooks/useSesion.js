import { useCallback, useEffect, useState } from "react";
import { codigoDeError, pedirJson } from "../utils/api.js";
import { borrarCookie, guardarCookie, leerCookie } from "../utils/cookies.js";

// Marca sin datos sensibles ("1") para saber que hubo sesión en este navegador.
// Sirve para distinguir "nunca ingresó" de "la sesión venció". El token NO se guarda:
// vive solo en la cookie httpOnly `sesion` que pone la API, que el JavaScript no puede leer.
const MARCA_SESION = "sesionIniciada";
const DOCE_HORAS = 60 * 60 * 12;

function irAIngresar() {
  if (window.location.pathname !== "/" || window.location.hash !== "#ingresar") {
    window.location.assign("/#ingresar");
  }
}

/**
 * Sesión actual con GET /sesion (cookie httpOnly `sesion` de la API).
 *   usuario: la persona con sesión, o null si navega como visitante.
 *   estado: "cargando" | "listo"
 *   cerrarSesion(): DELETE /sesion y vuelve al inicio como visitante.
 * Si la sesión vence (401 no_autenticado habiendo ingresado antes), lleva a ingresar.
 */
export function useSesion() {
  const [usuario, setUsuario] = useState(null);
  const [estado, setEstado] = useState("cargando");

  const consultar = useCallback(async (signal) => {
    try {
      const datos = await pedirJson("sesion", { signal, conSesion: true });
      if (typeof datos?.nombre !== "string") throw new Error("Respuesta de sesión inválida.");
      guardarCookie(MARCA_SESION, "1", DOCE_HORAS);
      setUsuario(datos);
    } catch (error) {
      if (signal?.aborted) return;
      setUsuario(null);
      if (codigoDeError(error) === "no_autenticado" && leerCookie(MARCA_SESION)) {
        // Había sesión y la API ya no la reconoce: venció.
        borrarCookie(MARCA_SESION);
        irAIngresar();
      }
    } finally {
      if (!signal?.aborted) setEstado("listo");
    }
  }, []);

  // Al cargar la página (así la sesión se conserva al recargar).
  useEffect(() => {
    const controlador = new AbortController();
    consultar(controlador.signal);
    return () => controlador.abort();
  }, [consultar]);

  // Al volver a la pestaña se revisa otra vez, por si la sesión venció mientras tanto.
  useEffect(() => {
    function alVolver() {
      if (document.visibilityState === "visible" && leerCookie(MARCA_SESION)) consultar();
    }
    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [consultar]);

  const cerrarSesion = useCallback(async () => {
    await pedirJson("sesion", { metodo: "DELETE", conSesion: true });
    borrarCookie(MARCA_SESION);
    window.location.assign("/");
  }, []);

  return { usuario, estado, cerrarSesion };
}
