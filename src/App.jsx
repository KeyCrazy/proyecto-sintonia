import useTextos from "./hooks/useTextos";
import "./App.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

function leerSeleccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  //idiom por defecto espaol
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeleccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  console.log(datos); 

  const ingles = idioma === "en";
  const titulo = activo === "favoritos" ? datos.textos?.navbar.botones.favoritos : datos.textos?.navbar.enlace[activo];
    //sincronizar el estado del componente con el hash de la URL
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeleccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return ()=> window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%":"";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(valor){
    setConsulta(valor);
    setActivo("heroes");
    //window.history es el que da acceso al historial de la pestaña
    window.history.replaceState(null, "", "#heroes");
  }

  return (
    <>
      <Navbar {...datos} idioma = {idioma} cambiarIdioma={setIdioma} activo={activo} onBuscar={textoGrande} alternarTexto={() => setTextoGrande((valor) => !valor)}/>
    </>
  );
}

export default App;