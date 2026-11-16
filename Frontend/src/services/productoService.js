import { obtenerToken } from "./authService";

const PRODUCTO_URL = `${API_URL}/api/productos`;

function obtenerHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${obtenerToken()}`
    }
}

export async function obtenerProductos() {
    const respuesta = await fetch(PRODUCTO_URL);

    if(!respuesta.ok) {
        throw new Error("No se pudieron obtener los productos.");
    }

    return await respuesta.json();
}

export async function crearProducto(producto) {
    const respuesta = await fetch(PRODUCTO_URL, {
        method:"POST",
        headers: obtenerHeaders(),
        body: JSON.stringify(producto)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo registrar el producto.");
    }

    return await respuesta.json();
}

export async function actualizarProducto(id, producto) {
    const respuesta = await PRODUCTO_URL(`${API_URL}/${id}`, {
        method: "PUT",
        headers: obtenerHeaders(),
        body: JSON.stringify(producto)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el producto.");
    }

    return await respuesta.json();
}

export async function eliminarProducto(id) {
    const respuesta =  await PRODUCTO_URL(`${API_URL}/${id}`, {
        method:"DELETE",
        headers: obtenerHeaders()
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto.");
    }

    return await respuesta.json();
}