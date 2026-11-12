import {useTextos} from "./hooks/useTextos.js";
import "./App.css"
import Navbar from "./Components/Navbar";
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

    function buscar(valor){
        setActivo("buscar");
        //window.history es el que da acceso al hsitorial de la pestaña
        window.history.replaceState(null, "", "#buscar");
    }

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
        if (leerCookie("consentimiento") === "aceptada") {
            guardarCookie("idioma", nuevoIdioma);
        }
    }



    return (
        <>
            <Navbar 
                {...datos} 
                idioma = {idioma} 
                cambiarIdioma={cambiarIdioma}
                activo={activo}
                onBuscar={buscar}
                textoGrande={textoGrande}
                alternarTexto={()=>setTextoGrande((valor) => !valor)}
            />
            <CookieNotice textos={datos.textos?.cookies?.banner} idioma={idioma} />
        </>

    )
}

export default App;