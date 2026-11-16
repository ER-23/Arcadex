import { jest, describe, test, expect, afterEach } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import app from "../../src/app.js";
import Usuario from "../../src/models/Usuario.js";

dotenv.config();

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Rutas de autenticación", () => {

    test("POST /api/auth/login debe iniciar sesión correctamente", async () => {

        const usuarioSimulado = {
            _id: "usuario123",
            nombre: "Administrador",
            correo: "admin@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(usuarioSimulado);

        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        const respuesta = await request(app)
            .post("/api/auth/login")
            .send({
                correo: "admin@arcadex.com",
                password: "password123"
            });

        expect(respuesta.status).toBe(200);

        expect(respuesta.body.mensaje).toBe("Inicio de sesion exitoso");

        expect(respuesta.body.token).toBeDefined();

        expect(respuesta.body.usuario).toEqual({
            id: "usuario123",
            nombre: "Administrador",
            correo: "admin@arcadex.com"
        });
    });

    test("POST /api/auth/login debe rechazar una contraseña incorrecta", async () => {

        const usuarioSimulado = {
            _id: "usuario123",
            nombre: "Administrador",
            correo: "admin@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(usuarioSimulado);

        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        jest.spyOn(jwt, "sign");

        const respuesta = await request(app)
            .post("/api/auth/login")
            .send({
                correo: "admin@arcadex.com",
                password: "contraseña_incorrecta"
            });

        expect(respuesta.status).toBe(401);

        expect(respuesta.body).toEqual({
            mensaje: "Credenciales incorrectas"
        });

        expect(jwt.sign).not.toHaveBeenCalled();
    });

    test("POST /api/auth/login debe rechazar un correo no registrado", async () => {

        jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

        const compararPassword = jest.spyOn(bcrypt, "compare");

        const respuesta = await request(app)
            .post("/api/auth/login")
            .send({
                correo: "inexistente@arcadex.com",
                password: "password123"
            });

        expect(respuesta.status).toBe(401);

        expect(respuesta.body).toEqual({
            mensaje: "Credenciales incorrectas"
        });

        expect(compararPassword).not.toHaveBeenCalled();
    });

    test("POST /api/auth/registro debe registrar un usuario correctamente", async () => {

        jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

        jest.spyOn(bcrypt, "hash").mockResolvedValue("password_encriptado");

        const usuarioCreado = {
            _id: "usuario456",
            nombre: "Nuevo Administrador",
            correo: "nuevo@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario, "create").mockResolvedValue(usuarioCreado);

        const respuesta = await request(app)
            .post("/api/auth/registro")
            .send({
                nombre: "Nuevo Administrador",
                correo: "nuevo@arcadex.com",
                password: "password123"
            });

        expect(respuesta.status).toBe(201);

        expect(respuesta.body).toEqual({
            mensaje: "Usuario creado correctamente",
            usuario: {
                id: "usuario456",
                nombre: "Nuevo Administrador",
                correo: "nuevo@arcadex.com"
            }
        });

        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

        expect(Usuario.create).toHaveBeenCalledWith({
            nombre: "Nuevo Administrador",
            correo: "nuevo@arcadex.com",
            password: "password_encriptado"
        });
    });

    test("POST /api/auth/registro debe rechazar campos faltantes", async () => {

        const buscarUsuario = jest.spyOn(Usuario, "findOne");

        const encriptarPassword = jest.spyOn(bcrypt, "hash");

        const crearUsuario = jest.spyOn(Usuario, "create");

        const respuesta = await request(app)
            .post("/api/auth/registro")
            .send({
                nombre: "Nuevo Administrador",
                password: "password123"
            });

        expect(respuesta.status).toBe(400);

        expect(respuesta.body).toEqual({
            mensaje: "Todos los campos son obligatorios"
        });

        expect(buscarUsuario).not.toHaveBeenCalled();

        expect(encriptarPassword).not.toHaveBeenCalled();

        expect(crearUsuario).not.toHaveBeenCalled();
    });

    test("POST /api/auth/registro debe rechazar un correo ya registrado", async () => {

        const usuarioExistente = {
            _id: "usuario123",
            nombre: "Administrador",
            correo: "admin@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(usuarioExistente);

        const encriptarPassword = jest.spyOn(bcrypt, "hash");

        const crearUsuario = jest.spyOn(Usuario, "create");

        const respuesta = await request(app)
            .post("/api/auth/registro")
            .send({
                nombre: "Otro Administrador",
                correo: "admin@arcadex.com",
                password: "password123"
            });

        expect(respuesta.status).toBe(409);

        expect(respuesta.body).toEqual({
            mensaje: "El correo ya está registrado"
        });

        expect(encriptarPassword).not.toHaveBeenCalled();

        expect(crearUsuario).not.toHaveBeenCalled();
    });
});