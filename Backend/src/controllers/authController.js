import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const iniciarSesion = async (req, res, next) => {
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

        console.log("Inicio de sesion exitoso")

    } catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        
        console.log("Error al iniciar sesion")

        next(error);
    }
};

export const crearUsuario = async (req, res, next) => {
    try {
        const { nombre, correo, password } = req.body;

        // Verificar que se reciban todos los datos
        if (!nombre || !correo || !password) {
            const error = new Error("Todos los campos son obligatorios");
            error.status = 400;
            throw error;
        }

        // Comprobar si el correo ya está registrado
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            const error = new Error("El correo ya está registrado");
            error.status = 409;
            throw error;
        }

        // Encriptar contraseña
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            password: passwordEncriptada
        });

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });

        console.log("Nuevo usuario creado con exito")

    } catch (error) {
        if (error.code === 11000) {
            error.status = 409;
        }

        console.log("Error al crear el nuevo usuario")

        next(error);
    }
};