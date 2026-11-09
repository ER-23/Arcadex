import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body

        const usuario = await Usuario.findOne({ correo });

        if(!usuario) {
            const error = new Error("Credenciales incorrectas");
            error.status = 401;
            throw error;
        }

        const passwordValido = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValido) {
            const error = new Error("Credenciales incorrectas");
            error.status = 401;
            throw error;
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
        error.status = 500;
        next(error);
    }
};