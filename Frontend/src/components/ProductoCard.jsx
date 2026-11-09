import { obtenerToken } from "../services/authService"

function ProductoCard({ id, nombre, precio, cantidad, tipo, onEditar, onEliminar }) {
    const token = obtenerToken();

    return (
        <article className="tarjeta">
            <div>
                <h3>{nombre}</h3>
                <p>Precio: ${precio}</p>
                <p>Existencias: {cantidad}</p>
                <p>Categoría: {tipo}</p>
            </div>

            {token && (
                <div className="botones-opuestos">
                    <button className="boton-negativo" onClick={() => onEliminar(id)}>Eliminar</button>
                    <button className="boton-intermedio" onClick={onEditar}>Editar</button>
                </div>
            )}
            
        </article>
    )
}

export default ProductoCard