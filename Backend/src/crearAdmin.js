import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import conectarDB from "./config/database.js";
import Usuario from "./models/Usuario.js";

async function crearAdmin() {
    try {
        await conectarDB();

        const { ADMIN_NOMBRE, ADMIN_CORREO, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NOMBRE || !ADMIN_CORREO || !ADMIN_PASSWORD) {
            throw new Error("Faltan las credenciales del administrador en .env");
        }

        const usuarioExistente = await Usuario.findOne({
            correo: ADMIN_CORREO
        });

        if (usuarioExistente) {
            console.log("El administrador ya existe.");
            return;
        }
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

        const nuevoAdmin = new Usuario({
            nombre: ADMIN_NOMBRE,
            correo: ADMIN_CORREO,
            password: passwordHash
        });

        await nuevoAdmin.save();

        console.log("Administradir creado correctamente.");
    } catch (error) {
        console.error("Error al crear administrador:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
}

crearAdmin();