import { useState } from "react";
import Button from "./Button.jsx";
import { borrarCookie, guardarCookie, leerCookie } from "../../utils/cookies.js";
import "./base.css";

export default function CookieNotice({ textos, idioma = "es" }) {
  const [visible, setVisible] = useState(
    () => leerCookie("consentimiento") === null,
  );

  if (!textos || !visible) return null;

  function responder(valor) {
    guardarCookie("consentimiento", valor);
    if (valor === "aceptada") {
      guardarCookie("idioma", idioma);
    } else {
      borrarCookie("idioma");
    }
    setVisible(false);
  }

  return (
    <aside className="aviso-cookies" aria-labelledby="aviso-cookies-titulo">
      <div className="aviso-cookies-contenido">
        <h2 className="aviso-cookies-titulo" id="aviso-cookies-titulo">
          {textos.titulo}
        </h2>
        <p className="aviso-cookies-texto">{textos.texto}</p>
      </div>
      <div className="aviso-cookies-acciones">
        <Button
          variant="secondary"
          onClick={() => responder("rechazada")}
        >
          {textos.botones.rechazar}
        </Button>
        <Button
          variant="primary"
          onClick={() => responder("aceptada")}
        >
          {textos.botones.aceptar}
        </Button>
      </div>
    </aside>
  );
}
