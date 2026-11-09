import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body

        const usuario = await Usuario.findOne({ correo });

        if(!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const passwordValido = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValido) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            mensaje: "Inicio de sesion exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al iniciar sesion",
            error: error.message
        });
    }
};