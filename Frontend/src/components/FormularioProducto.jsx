import { useState, useEffect } from "react"

function FormularioProducto({ onGuardar, onCerrar, productoEditar }) {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [tipo, setTipo] = useState("");

    useEffect(() => {
        if (productoEditar) {
            setNombre(productoEditar.nombre);
            setPrecio(productoEditar.precio);
            setCantidad(productoEditar.cantidad);
            setTipo(productoEditar.tipo);
        } else {
            setNombre("");
            setPrecio("");
            setCantidad("");
            setTipo("");
        }
        
    }, [productoEditar])

    function manejarEnvio(e) {
        e.preventDefault();

        const nuevoProducto = {
            nombre,
            precio: Number(precio),
            cantidad: Number(cantidad),
            tipo
        };

        onGuardar(nuevoProducto);
    }

    return (
        <article id="popup" className="popup">
            <form className="poup-contenido" onSubmit={manejarEnvio}>

                <label htmlFor="nombre">Nombre:</label>
                <input 
                    type="text" 
                    id="nombre" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required 
                />

                <label htmlFor="precio">Precio:</label>
                <input 
                    type="number" 
                    id="precio"
                    min="0"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required 
                />

                <label htmlFor="cantidad">Cantidad:</label>
                <input 
                    type="number" 
                    id="cantidad" 
                    min="0"
                    step="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required 
                />

                <fieldset>
                    <legend>Tipo de producto:</legend>

                    <div className="opciones-radio">
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="juegos" 
                                checked={tipo === "juegos"}
                                onChange={(e) => setTipo(e.target.value)}
                                required 
                            />
                            Videojuegos
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="consola" 
                                checked={tipo === "consola"}
                                onChange={(e) => setTipo(e.target.value)}
                            />
                            Consolas
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="accesorio" 
                                checked={tipo === "accesorio"}
                                onChange={(e) => setTipo(e.target.value)}
                            />
                            Accesorios
                        </label>
                    </div>
                </fieldset>
                

                <div className="botones-opuestos">
                    <button 
                        type="button" 
                        onClick={onCerrar}
                        className="boton-negativo"
                    >
                        Cerrar
                    </button>

                    <button type="submit">Enviar</button>
                </div>
            </form>
        </article>
    )
}

export default FormularioProducto