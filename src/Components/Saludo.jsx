import React from 'react'
import { useState } from "react";

const Saludo = () => {
    const [nombre, setNombre] = useState("");
    const [mostrarSaludo, setMostrarSaludo] = useState(false);

    const Saludar = () => {
        setMostrarSaludo(true);
    };

    return (
        <section>
            <label htmlFor="nombre">Tu nombre</label>
            <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
            />
            <button type="button" onClick={Saludar}>
                Saludar
            </button>
            {mostrarSaludo && <h1>Hola, {nombre || "desconocido"}</h1>}
        </section>
    );
}

export default Saludo