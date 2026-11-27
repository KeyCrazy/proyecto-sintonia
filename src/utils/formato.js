// Reemplaza {clave} en un texto de la API: rellenar("Más de {artista}", { artista: "Marea Baja" }).
export function rellenar(plantilla, valores) {
  return plantilla.replace(/\{(\w+)\}/g, (marca, clave) =>
    clave in valores ? String(valores[clave]) : marca,
  );
}

// Elige la forma singular o plural ({ uno, otro }) según la cantidad.
export function plural(formas, cantidad) {
  return rellenar(cantidad === 1 ? formas.uno : formas.otro, { cantidad });
}

// 70 -> "1:10"
export function formatearDuracion(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

// fechaPublicacion es un día sin hora ("2025-10-12"): se lee por partes y no se
// pasa por new Date(), que la tomaría como medianoche UTC y en Colombia mostraría el día anterior.
export function partesDeFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return { anio, mes, dia };
}

// "2025-10-12" -> "12 de octubre de 2025" (o "October 12, 2025" en inglés).
// Date.UTC solo da un número y el formato se hace en UTC, así que el día no se corre.
export function formatearFecha(fecha, idioma) {
  const { anio, mes, dia } = partesDeFecha(fecha);
  return new Intl.DateTimeFormat(idioma, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(anio, mes - 1, dia));
}

// 1204330 -> "1.204.330"
export function formatearNumero(numero, idioma) {
  return new Intl.NumberFormat(idioma).format(numero);
}
