const API_BASE_URL = import.meta.env.VITE_API_URL;

export function crearUrlApi(recurso) {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar la variable VITE_API_URL.");
  }

  return `${API_BASE_URL.replace(/\/+$/, "")}/${recurso.replace(/^\/+/, "")}`;
}
