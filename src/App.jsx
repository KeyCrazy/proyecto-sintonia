import {useTextos} from "./hooks/useTextos.js";
import "./App.css"
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer.jsx";
import CookieNotice from "./Components/base/CookieNotice.jsx";
import InicioPublico from "./Components/InicioPublico.jsx";
import Catalogo from "./Components/Catalogo.jsx";
import AccessibilityPanel from "./Components/AccessibilityPanel.jsx";
import { guardarCookie, leerCookie } from "./utils/cookies.js";
import { useIdiomas } from "./hooks/useIdiomas.js";
import {useEffect, useRef, useState} from "react";

const SECCIONES = new Set([
    "inicio",
    "catalogo",
    "ingresar",
    "registro",
    "terminos",
    "accesibilidad",
]);

function leerSeccion(){
    if (window.location.pathname === "/catalogo") return "catalogo";
    if (window.location.pathname !== "/") return "detalle";
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
    const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);
    const botonAccesibilidadRef = useRef(null);
    const [ajustesAccesibilidad, setAjustesAccesibilidad] = useState({
        escalaTexto: 100,
        contrasteAlto: false,
        reducirMovimiento: false,
        subrayarEnlaces: false,
        espaciadoAmpliado: false,
    });

    const datos = useTextos(idioma);
    const idiomasDisponibles = useIdiomas();
    const rutaDetalle =
        activo === "detalle" ? decodeURIComponent(window.location.pathname.slice(1)) : "";
    
    //va a sincornizar el estado del componente con el hash de la URL
    useEffect(() => {
        function actualizar(){
            setActivo(leerSeccion())
            window.scrollTo(0, 0)
        }
        window.addEventListener("hashchange", actualizar)
        window.addEventListener("popstate", actualizar)
        return () => {
            window.removeEventListener("hashchange", actualizar)
            window.removeEventListener("popstate", actualizar)
        }
    }, [])

    useEffect(() => {
        document.documentElement.lang = idioma;
    },[idioma])

    useEffect(() => {
        const raiz = document.documentElement;
        raiz.style.fontSize = `${ajustesAccesibilidad.escalaTexto}%`;
        const atributos = {
            "data-contraste-alto": ajustesAccesibilidad.contrasteAlto,
            "data-reducir-movimiento": ajustesAccesibilidad.reducirMovimiento,
            "data-subrayar-enlaces": ajustesAccesibilidad.subrayarEnlaces,
            "data-espaciado-ampliado": ajustesAccesibilidad.espaciadoAmpliado,
        };

        Object.entries(atributos).forEach(([atributo, activo]) => {
            raiz.setAttribute(atributo, String(activo));
        });

        return () => {
            raiz.style.fontSize = "";
            Object.keys(atributos).forEach((atributo) => raiz.removeAttribute(atributo));
        };
    }, [ajustesAccesibilidad]);

    function cambiarEscalaTexto(cambio) {
        setAjustesAccesibilidad((actuales) => ({
            ...actuales,
            escalaTexto: Math.min(150, Math.max(80, actuales.escalaTexto + cambio)),
        }));
    }

    function alternarAjusteAccesibilidad(ajuste) {
        setAjustesAccesibilidad((actuales) => ({
            ...actuales,
            [ajuste]: !actuales[ajuste],
        }));
    }

    function restablecerAccesibilidad() {
        setAjustesAccesibilidad({
            escalaTexto: 100,
            contrasteAlto: false,
            reducirMovimiento: false,
            subrayarEnlaces: false,
            espaciadoAmpliado: false,
        });
    }

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
        if (leerCookie("consentimiento") === "aceptada") {
            guardarCookie("idioma", nuevoIdioma);
        }
    }

    const etiquetasSeccion = {
        inicio: datos.textos?.navbar?.enlaces?.inicio,
        catalogo: datos.textos?.navbar?.enlaces?.catalogo,
        ingresar: datos.textos?.navbar?.botones?.invitado?.ingresar,
        registro: datos.textos?.navbar?.botones?.invitado?.crearCuenta,
        terminos: datos.textos?.footer?.columnas?.legal?.enlaces?.terminos,
        accesibilidad: datos.textos?.footer?.columnas?.legal?.enlaces?.accesibilidad,
    }



    return (
        <div className="sitio">
            <Navbar 
                {...datos} 
                idioma = {idioma} 
                cambiarIdioma={cambiarIdioma}
                idiomas={idiomasDisponibles.idiomas}
                estadoIdiomas={idiomasDisponibles.estado}
                reintentarIdiomas={idiomasDisponibles.reintentar}
                activo={activo}
                accesibilidadAbierta={accesibilidadAbierta}
                abrirAccesibilidad={() => setAccesibilidadAbierta(true)}
                botonAccesibilidadRef={botonAccesibilidadRef}
            />
            <AccessibilityPanel
                abierto={accesibilidadAbierta}
                textos={datos.textos?.accesibilidad}
                ajustes={ajustesAccesibilidad}
                alCambiarEscala={cambiarEscalaTexto}
                botonActivadorRef={botonAccesibilidadRef}
                alCerrar={() => setAccesibilidadAbierta(false)}
                alAlternar={alternarAjusteAccesibilidad}
                alRestablecer={restablecerAccesibilidad}
            />
            <main
                id={activo}
                className={`contenido${activo === "inicio" ? " contenido-inicio" : ""}${activo === "catalogo" ? " contenido-catalogo" : ""}`}
                aria-labelledby={`titulo-${activo}`}
            >
                {activo === "inicio" && datos.textos?.paginas?.inicioPublico && datos.textos?.estados ? (
                    <InicioPublico
                        textos={datos.textos.paginas.inicioPublico}
                        estados={datos.textos.estados}
                    />
                ) : activo === "catalogo" && datos.textos?.paginas?.catalogo && datos.textos?.estados ? (
                    <Catalogo
                        textos={datos.textos}
                        estados={datos.textos.estados}
                    />
                ) : activo === "detalle" ? (
                    <h1 id="titulo-detalle" className="solo-lectores">
                        {rutaDetalle}
                    </h1>
                ) : (
                    <h1 id={`titulo-${activo}`} className="solo-lectores">
                        {etiquetasSeccion[activo]}
                    </h1>
                )}
            </main>
            <Footer
                textos={datos.textos?.footer}
                etiquetaLogo={datos.textos?.navbar?.logo?.aria}
            />
            <CookieNotice textos={datos.textos?.cookies?.banner} idioma={idioma} />
        </div>

    )
}

export default App;