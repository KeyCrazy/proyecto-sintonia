import {useTextos} from "./hooks/useTextos.js";
import "./App.css"
import Navbar from "./Components/Navbar";
import {useEffect, useState} from "react";

function leerSeccion(){
    return window.location.hash.slice(1) || "inicio";
}


function App() {
    const [idioma, setIdioma] = useState("es");
    const [activo, setActivo] = useState(leerSeccion);
    const [consulta, setConsulta] = useState("");
    const [textoGrande, setTextoGrande] = useState(false);


    const datos = useTextos(idioma);
    console.log(datos);

    const ingles = idioma === "en";
    const titulo =
        activo === "favoritos"
        ? datos.textos?.navbar.botones.favoritos
        : datos.textos?.navbar.enlaces[activo];
    
    //va a sincornizar el estado del componente con el hash de la URL
    useEffect(() => {
        function actualizar(){
            setActivo(leerSeccion())
            setConsulta("")
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
        setConsulta(valor);
        setActivo("heroes");
        //window.history es el que da acceso al hsitorial de la pestaña
        window.history.replaceState(null, "", "#heroes");
    }



    return (
        <>
            <Navbar 
                {...datos} 
                idioma = {idioma} 
                cambiarIdioma={setIdioma} 
                activo={activo}
                onBuscar={buscar}
                textoGrande={textoGrande}
                alternarTexto={()=>setTextoGrande((valor) => !valor)}
            />
            
        </>

    )
}

export default App;