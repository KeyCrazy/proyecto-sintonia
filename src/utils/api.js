const API_BASE_URL = import.meta.env.VITE_API_URL;

export function crearUrlApi(recurso) {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar la variable VITE_API_URL.");
  }

  return `${API_BASE_URL.replace(/\/+$/, "")}/${recurso.replace(/^\/+/, "")}`;
}

// Error de la API con su estado HTTP y su `codigo` (el que usa textos.errores).
// Si no hubo respuesta (sin red), el código es "sin_conexion".
export class ErrorApi extends Error {
  constructor(estado, codigo, mensaje) {
    super(mensaje || `HTTP ${estado}`);
    this.name = "ErrorApi";
    this.estado = estado;
    this.codigo = codigo;
  }
}

// Código para elegir el mensaje: el de la API, o "generico" si la respuesta vino mal formada.
export function codigoDeError(error) {
  return error instanceof ErrorApi ? error.codigo : "generico";
}

/*
 * Para probar los estados de carga y error (contrato de la API, sección 1):
 *   /catalogo?simularLatencia=2000          -> cabecera X-Simular-Latencia: 2000
 *   /albumes/alb_luz-de-paramo?simularError=503 -> cabecera X-Simular-Error: 503
 * Solo se envían en las peticiones de datos de las vistas, no en las de textos o idiomas,
 * para que los mensajes del estado de error sí se puedan cargar.
 */
function cabecerasDeSimulacion() {
  const parametros = new URLSearchParams(window.location.search);
  const cabeceras = {};
  const latencia = parametros.get("simularLatencia");
  const error = parametros.get("simularError");
  if (latencia) cabeceras["X-Simular-Latencia"] = latencia;
  if (error) cabeceras["X-Simular-Error"] = error;
  return cabeceras;
}

// GET a la API que devuelve el JSON o lanza un ErrorApi.
export async function pedirJson(recurso, { signal, simular = false } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(crearUrlApi(recurso), {
      signal,
      headers: simular ? cabecerasDeSimulacion() : undefined,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ErrorApi(0, "sin_conexion", error.message);
  }

  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ErrorApi(
      respuesta.status,
      cuerpo?.error?.codigo ?? "error_interno",
      cuerpo?.error?.mensaje,
    );
  }
  return cuerpo;
}
