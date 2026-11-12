import {useTextos} from "./hooks/useTextos.js";
import "./App.css"
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer.jsx";
import CookieNotice from "./Components/base/CookieNotice.jsx";
import { guardarCookie, leerCookie } from "./utils/cookies.js";
import {useEffect, useState} from "react";

function leerSeccion(){
    return window.location.hash.slice(1) || "inicio";
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
            <main id="inicio" className="contenido" />
            <Footer textos={datos.textos?.footer} idioma={idioma} />
            <CookieNotice textos={datos.textos?.cookies?.banner} idioma={idioma} />
        </div>

    )
}

export default App;