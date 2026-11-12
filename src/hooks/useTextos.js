import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";
const CLAVES_MENU = ["inicio", "catalogo"];

function validarTextos(datos){
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const idioma = textos?.idioma;
    const accesibilidad = textos?.accesibilidad;
    const inicio = textos?.paginas?.inicioPublico;
    const catalogo = textos?.paginas?.catalogo;
    const etiquetas = [
        nav?.logo?.texto,
        nav?.logo?.aria,
        ...CLAVES_MENU.map((clave) => nav?.enlaces?.[clave]),
        nav?.botones?.invitado?.ingresar,
        nav?.botones?.invitado?.crearCuenta,
        nav?.aria?.navegacion,
        nav?.aria?.idioma,
        nav?.aria?.accesibilidad,
        idioma?.titulo,
        idioma?.codigos?.es,
        idioma?.codigos?.en,
        idioma?.opciones?.es,
        idioma?.opciones?.en,
        accesibilidad?.titulo,
        accesibilidad?.tamanoTexto?.etiqueta,
        accesibilidad?.tamanoTexto?.reducir,
        accesibilidad?.tamanoTexto?.aumentar,
        accesibilidad?.tamanoTexto?.valor,
        accesibilidad?.altoContraste?.etiqueta,
        accesibilidad?.altoContraste?.ayuda,
        accesibilidad?.reducirMovimiento?.etiqueta,
        accesibilidad?.reducirMovimiento?.ayuda,
        accesibilidad?.subrayarEnlaces?.etiqueta,
        accesibilidad?.subrayarEnlaces?.ayuda,
        accesibilidad?.espaciado?.etiqueta,
        accesibilidad?.espaciado?.ayuda,
        accesibilidad?.enlaces?.declaracion,
        accesibilidad?.botones?.restablecer,
        accesibilidad?.mensajes?.nota,
        accesibilidad?.aria?.cerrar,
        textos?.menuMovil?.abrir,
        textos?.menuMovil?.cerrar,
        textos?.menuMovil?.secciones?.accesibilidad,
        textos?.cookies?.banner?.titulo,
        textos?.cookies?.banner?.texto,
        textos?.cookies?.banner?.botones?.rechazar,
        textos?.cookies?.banner?.botones?.aceptar,
        textos?.footer?.lema,
        textos?.footer?.columnas?.explora?.titulo,
        textos?.footer?.columnas?.explora?.enlaces?.inicio,
        textos?.footer?.columnas?.explora?.enlaces?.catalogo,
        textos?.footer?.columnas?.cuenta?.titulo,
        textos?.footer?.columnas?.cuenta?.enlaces?.ingresar,
        textos?.footer?.columnas?.cuenta?.enlaces?.crearCuenta,
        textos?.footer?.columnas?.legal?.titulo,
        textos?.footer?.columnas?.legal?.enlaces?.terminos,
        textos?.footer?.columnas?.legal?.enlaces?.accesibilidad,
        textos?.footer?.legal?.derechos,
        textos?.footer?.legal?.nota,
        inicio?.seo?.titulo,
        inicio?.hero?.etiquetas?.temporada,
        inicio?.hero?.titulo,
        inicio?.hero?.subtitulo,
        inicio?.hero?.botones?.crearCuentaGratis,
        inicio?.hero?.botones?.explorarCatalogo,
        inicio?.cifras?.canciones?.valor,
        inicio?.cifras?.canciones?.etiqueta,
        inicio?.cifras?.generos?.etiqueta,
        inicio?.cifras?.cortes?.valor,
        inicio?.cifras?.cortes?.etiqueta,
        inicio?.destacados?.titulo,
        inicio?.destacados?.enlaces?.descubrirMas,
        inicio?.generos?.titulo,
        inicio?.generos?.enlaces?.verCatalogo,
        inicio?.cta?.titulo,
        inicio?.cta?.texto,
        inicio?.cta?.botones?.crearCuentaGratis,
        catalogo?.seo?.titulo,
        catalogo?.seo?.descripcion,
        catalogo?.encabezado?.titulo,
        catalogo?.encabezado?.subtitulo,
        catalogo?.generos?.titulo,
        catalogo?.generos?.aria?.seleccionado,
        catalogo?.destacados?.titulo,
        catalogo?.destacados?.enlaces?.descubrirMas,
        catalogo?.genero?.artistas?.titulo,
        catalogo?.genero?.artistas?.etiqueta,
        catalogo?.genero?.albumes?.titulo,
        catalogo?.genero?.canciones?.titulo,
        catalogo?.vacio?.titulo,
        catalogo?.vacio?.texto,
        textos?.estados?.cargando?.aria,
        textos?.estados?.vacio?.generico,
        textos?.estados?.error?.titulo,
        textos?.estados?.error?.descripcion,
        textos?.estados?.error?.botones?.reintentar,
    ]

    if (!etiquetas.every((valor) =>typeof valor === "string" && valor.trim())){
        throw new Error("La respuesta no contiene los textos requeridos para la navegación y el pie de página de Sintonía.")
    }
    return textos;
}

export function useTextos(idioma){
    const [textos, setTextos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0);

    useEffect (() =>{
        const controlador = new AbortController();
        const limite = setTimeout(() => controlador.abort(), 12000);
        let vigente = true
        setCargando(true);
        setError(false);
        setTextos(null);

        async function cargarTextosNavbar(){
            try{
                const url = crearUrlApi(`textos?idioma=${idioma}`);
                const respuesta = await fetch(url,{
                    signal: controlador.signal,
                });
                if(!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
                //si si respondio los datos correctamente
                const datos = await respuesta.json();
                const nuevosTextos = validarTextos(datos);
                if(vigente) setTextos(nuevosTextos);

            }catch(errorConsulta){
                if (vigente){
                    console.error("Error al cargar los textos:", errorConsulta);
                    setError(true);
                }
            }finally{
                clearTimeout(limite);
                if (vigente) setCargando(false);
            }
        }

        cargarTextosNavbar();
        return () => {
            vigente = false;
            clearTimeout(limite);
            controlador.abort();
        };

    },[idioma, intento]);

    return {
        textos, 
        cargando, 
        error, 
        recargar: () => setIntento((valor) => valor + 1),
    }
}