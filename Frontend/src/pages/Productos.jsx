import { useState, useEffect } from "react"
import ProductoCard from "../components/ProductoCard";
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from "../services/productoService";
import FormularioProducto from "../components/FormularioProducto";
import { obtenerToken } from "../services/authService";

function Productos () {
    const token = obtenerToken();
    const [popupAbierto, setPopupAbierto] = useState(false);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [editandoProducto, setEditandoProducto] = useState(null);

    useEffect(() => {
        async function cargarProductos() {
            try {
                const datos = await obtenerProductos();
                setProductos(datos);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }

        cargarProductos();
    }, []);

    async function manejarGuardar(producto) {
        try {
            if (editandoProducto) {
                const actualizado = await actualizarProducto(
                    editandoProducto._id,
                    producto
                );

                setProductos(productos.map((p) => {
                    return p._id === actualizado._id ? actualizado : p
                }))

            } else {
                const productoGuardado = await crearProducto(producto);

                setProductos([...productos, productoGuardado]);
            }

            cerrarPopup();

        } catch (error) {
            console.error("Error al guardar:", error);
            setError(error.message);
        }
    }

    function abrirEdicion(producto) {
        setEditandoProducto(producto);
        setPopupAbierto(true);
    }

    function cerrarPopup() {
        setPopupAbierto(false);
        setEditandoProducto(null);
    }

    async function manejarEliminar(id) {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
            return;
        }

        try {
            await eliminarProducto(id);

            setProductos(productos.filter(
                (producto) => producto._id !== id
            ));
            
        } catch (error) {
            console.log("Error al eliminar:", error);
            setError(error.message);
        }
    }

    return (
        <>
            <header>
                <h1>Productos</h1>

                <article>
                    <p>
                        Desde este espacio puede ver una lista de todos los 
                        productos que Ofrecemos. Esperamos que encuentre algo 
                        de su agrado.                        
                    </p>
                </article>

                
                    {token && (
                        <article>
                            <button onClick={() => {
                                setEditandoProducto(null);
                                setPopupAbierto(true);
                            }}>
                                Añadir producto
                            </button>
                        </article>
                    )}
                    
                
            </header>

            <main>
                {popupAbierto && (
                    <FormularioProducto
                        onGuardar={manejarGuardar}
                        onCerrar={() => setPopupAbierto(false)}
                        productoEditar={editandoProducto}
                    />
                )}

                <article id="lista-elementos" className="grid-elementos">
                    {cargando && <p>Cargando productos...</p>}

                    {error && <p>{error}</p>}

                    {!cargando && !error && productos.length === 0 && (
                        <p>No hay productos registrados.</p>
                    )}

                    {productos.map((producto) => (
                        <ProductoCard
                            key={producto._id}
                            id={producto._id}
                            nombre={producto.nombre}
                            precio={producto.precio}
                            cantidad={producto.cantidad}
                            tipo={producto.tipo}
                            onEditar={() => abrirEdicion(producto)}
                            onEliminar={manejarEliminar}
                        />
                    ))}

                </article>
            </main>
        </>
    );
}

export default Productos