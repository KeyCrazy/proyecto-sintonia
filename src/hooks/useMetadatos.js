import { useEffect } from "react";

// Equivalente en Vite de generateMetadata de Next: pone el <title> y la
// <meta name="description"> de la página, y los restaura al salir de ella.
export function useMetadatos({ titulo, descripcion }) {
  useEffect(() => {
    if (!titulo) return undefined;

    let meta = document.querySelector('meta[name="description"]');
    const creada = !meta;
    if (creada) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }

    const tituloAnterior = document.title;
    const descripcionAnterior = meta.content;
    document.title = titulo;
    meta.content = descripcion ?? "";

    return () => {
      document.title = tituloAnterior;
      if (creada) meta.remove();
      else meta.content = descripcionAnterior;
    };
  }, [titulo, descripcion]);
}
