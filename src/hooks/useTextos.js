import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const CLAVES_MENU = ["inicio", "catalogo"];

function validarTextos(datos){
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const etiquetas = [
        nav?.logo?.texto,
        nav?.logo?.aria,
        ...CLAVES_MENU.map((clave) => nav?.enlaces?.[clave]),
        nav?.buscador?.placeholder,
        nav?.buscador?.borrar,
        nav?.botones?.invitado?.ingresar,
        nav?.botones?.invitado?.crearCuenta,
        nav?.aria?.navegacion,
        nav?.aria?.idioma,
        nav?.aria?.accesibilidad,
        textos?.menuMovil?.abrir,
        textos?.menuMovil?.cerrar,
        textos?.cookies?.banner?.titulo,
        textos?.cookies?.banner?.texto,
        textos?.cookies?.banner?.botones?.rechazar,
        textos?.cookies?.banner?.botones?.aceptar,
    ]

    if (!etiquetas.every((valor) =>typeof valor === "string" && valor.trim())){
        throw new Error("La respuesta no contiene los textos requeridos para el navbar de Sintonía.")
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
                if (!API_BASE_URL) {
                    throw new Error("Falta configurar la variable VITE_API_URL.");
                }
                const url = `${API_BASE_URL.replace(/\/+$/, "")}/textos?idioma=${idioma}`;
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