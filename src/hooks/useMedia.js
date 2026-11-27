import { useEffect, useState } from "react";

// Indica si se cumple una media query. Sirve para elegir la clase tipográfica
// de Figma según el ancho de pantalla, sin escribir tamaños a mano en el CSS.
export function useMedia(consulta) {
  const [cumple, setCumple] = useState(() => window.matchMedia(consulta).matches);

  useEffect(() => {
    const medio = window.matchMedia(consulta);
    const actualizar = () => setCumple(medio.matches);
    actualizar();
    medio.addEventListener("change", actualizar);
    return () => medio.removeEventListener("change", actualizar);
  }, [consulta]);

  return cumple;
}
