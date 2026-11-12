import {useTextos} from "./hooks/useTextos.js";
import "./App.css"
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer.jsx";
import CookieNotice from "./Components/base/CookieNotice.jsx";
import InicioPublico from "./Components/InicioPublico.jsx";
import { guardarCookie, leerCookie } from "./utils/cookies.js";
import {useEffect, useState} from "react";

const SECCIONES = new Set([
    "inicio",
    "catalogo",
    "ingresar",
    "registro",
    "terminos",
    "accesibilidad",
]);

function leerSeccion(){
    const seccion = window.location.hash.slice(1);
    return SECCIONES.has(seccion) ? seccion : "inicio";
}

function leerIdiomaInicial() {
    if (leerCookie("consentimiento") !== "aceptada") return "es";
    return leerCookie("idioma") === "en" ? "en" : "es";
}

function App() {
    const [idioma, setIdioma] = useState(leerIdiomaInicial);
    const [activo, setActivo] = useState(leerSeccion);
    const [textoGrande, setTextoGrande] = useState(false);


    const datos = useTextos(idioma);
    
    //va a sincornizar el estado del componente con el hash de la URL
    useEffect(() => {
        function actualizar(){
            setActivo(leerSeccion())
            window.scrollTo(0, 0)
        }
        window.addEventListener("hashchange", actualizar)
        return () => window.removeEventListener("hashchange", actualizar)
    }, [])

    useEffect(() => {
        document.documentElement.lang = idioma;
    },[idioma])

    useEffect(() => {
        document.documentElement.style.fontSize = textoGrande ? "112%" : "";
        return () => {document.documentElement.style.fontSize = ""}
    },[textoGrande])

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
        if (leerCookie("consentimiento") === "aceptada") {
            guardarCookie("idioma", nuevoIdioma);
        }
    }

    const etiquetasSeccion = {
        inicio: datos.textos?.navbar?.enlaces?.inicio ?? (idioma === "en" ? "Home" : "Inicio"),
        catalogo: datos.textos?.navbar?.enlaces?.catalogo ?? (idioma === "en" ? "Catalog" : "Catálogo"),
        ingresar: datos.textos?.navbar?.botones?.invitado?.ingresar ?? (idioma === "en" ? "Log in" : "Ingresar"),
        registro: datos.textos?.navbar?.botones?.invitado?.crearCuenta ?? (idioma === "en" ? "Create account" : "Crear cuenta"),
        terminos: datos.textos?.footer?.columnas?.legal?.enlaces?.terminos ?? (idioma === "en" ? "Terms of use" : "Términos de uso"),
        accesibilidad: datos.textos?.footer?.columnas?.legal?.enlaces?.accesibilidad ?? (idioma === "en" ? "Accessibility" : "Accesibilidad"),
    }



    return (
        <div className="sitio">
            <Navbar 
                {...datos} 
                idioma = {idioma} 
                cambiarIdioma={cambiarIdioma}
                activo={activo}
                textoGrande={textoGrande}
                alternarTexto={()=>setTextoGrande((valor) => !valor)}
            />
            <main
                id={activo}
                className={`contenido${activo === "inicio" ? " contenido-inicio" : ""}`}
                aria-labelledby={`titulo-${activo}`}
            >
                {activo === "inicio" && datos.textos?.paginas?.inicioPublico && datos.textos?.estados ? (
                    <InicioPublico
                        textos={datos.textos.paginas.inicioPublico}
                        estados={datos.textos.estados}
                    />
                ) : (
                    <h1 id={`titulo-${activo}`} className="solo-lectores">
                        {etiquetasSeccion[activo]}
                    </h1>
                )}
            </main>
            <Footer textos={datos.textos?.footer} idioma={idioma} />
            <CookieNotice textos={datos.textos?.cookies?.banner} idioma={idioma} />
        </div>

    )
}

export default App;