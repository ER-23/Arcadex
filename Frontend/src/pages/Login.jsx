import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarLogin(e) {
        e.preventDefault();

        try {
            setCargando(true);
            setError("");

            await iniciarSesion({
                correo,
                password
            });

            navigate("/productos");

        } catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="login">
            <h1>Acceso de administrador</h1>

            <form onSubmit={manejarLogin}>

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

                {error && <p>{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Ingresando..." : "Iniciar sesión"}
                </button>

            </form>
        </main>
    );
}

export default Login;