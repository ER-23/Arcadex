import API_URL from "./api.js";

const AUTH_URL = `${API_URL}/api/auth`;

export async function iniciarSesion(credenciales) {
    const respuesta = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credenciales)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al iniciar sesión");
    }

    sessionStorage.setItem("token", datos.token);

    sessionStorage.setItem("usuario", JSON.stringify(datos.usuario));

    return datos;
}

export async function crearUsuario(usuario) {
    const respuesta = await fetch(`${AUTH_URL}/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al crear usuario");
    }

    return datos;
}

export function obtenerToken() {
    return sessionStorage.getItem("token");
}

export function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
}