import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion, crearUsuario } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [modo, setModo] = useState("login");

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();

        try {
            setCargando(true);
            setError("");
            setMensaje("");

            if (modo === "login") {
                await iniciarSesion({
                    correo,
                    password
                });

                navigate("/");

            } else {
                const respuesta = await crearUsuario({
                    nombre,
                    correo,
                    password
                });

                setMensaje(respuesta.mensaje);

                setNombre("");
                setCorreo("");
                setPassword("");

                setModo("login");
            }

        } catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }

    function cambiarModo() {
        setModo(modo === "login" ? "registro" : "login");

        setError("");
        setMensaje("");

        setNombre("");
        setCorreo("");
        setPassword("");
    }

    return (
        <main className="login">
            <div className="login-contenido">
                <h1>
                    {modo === "login" 
                        ? "Iniciar sesión"
                        : "Crear una cuenta"}
                </h1>

                <p className="login-descripcion">
                    {modo === "login"
                        ? "Inicia sesión para continuar."
                        : "Regístrate para crear tu cuenta."}
                </p>

                <form className="login-formulario" onSubmit={manejarSubmit}>

                    {modo === "registro" && (
                        <>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="login-mensaje login-error">{error}</p>}
                    {mensaje && <p className="login-mensaje login-exito">{mensaje}</p>}

                    <button type="submit" disabled={cargando}>
                        {cargando 
                            ? "Ingresando..." 
                            : "Iniciar sesión"}
                    </button>

                </form>
                
                <div className="login-cambiar">
                    {modo === "login"
                        ? "¿No tienes una cuenta?" 
                        : "¿Ya tienes una cuenta?"}

                    <button 
                        type="button"
                        onClick={cambiarModo}
                        disabled={cargando}
                    >
                        {modo === "login" 
                            ? "Registrarse" 
                            : "Iniciar sesión"}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Login;