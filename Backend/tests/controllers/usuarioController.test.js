import { jest, describe, test, expect, afterEach } from "@jest/globals";
import Usuario from "../../src/models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    iniciarSesion,
    crearUsuario
} from "../../src/controllers/authController.js";

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Controlador de usuarios", () => {

    test("Debe iniciar sesión correctamente", async () => {
        const usuarioSimulado = {
            _id: "123",
            nombre: "Admin",
            correo: "admin@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario,"findOne").mockResolvedValue(usuarioSimulado);

        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        jest.spyOn(jwt, "sign").mockReturnValue("token_simulado");

        const req = {
            body: {
                correo: "admin@arcadex.com",
                password: "123456"
            }
        };

        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "admin@arcadex.com"
        });

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Inicio de sesion exitoso",
            token: "token_simulado",
            usuario: {
                id: "123",
                nombre: "Admin",
                correo: "admin@arcadex.com"
            }
        });

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe generar un error 401 cuando el usuario no existe", async () => {

        jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

        jest.spyOn(bcrypt, "compare");

        jest.spyOn(jwt, "sign");

        const req = {
            body: {
                correo: "desconocido@arcadex.com",
                password: "123456"
            }
        };

        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "desconocido@arcadex.com"
        });

        expect(bcrypt.compare).not.toHaveBeenCalled();
        
        expect(jwt.sign).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Credenciales incorrectas",
                status: 401
            })
        );

        expect(res.json).not.toHaveBeenCalled();
    });

    test("Debe generar un error 401 cuando la contraseña es incorrecta", async () => {
        const usuarioSimulado = {
            _id: "123",
            nombre: "Admin",
            correo: "admin@arcadex.com",
            password: "password_encriptado"
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(usuarioSimulado);

        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        jest.spyOn(jwt, "sign");

        const req = {
            body: {
                correo: "admin@arcadex.com",
                password: "incorrecta"
            }
        };

        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "admin@arcadex.com"
        });

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "incorrecta",
            "password_encriptado"
        );

        expect(jwt.sign).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Credenciales incorrectas",
                status: 401
            })
        );

        expect(res.json).not.toHaveBeenCalled();
    });

    test("Debe generar un error 500 cuando falla la consulta", async () => {

        const errorDB = new Error("Error de conexión con MongoDB");

        jest.spyOn(Usuario, "findOne").mockRejectedValue(errorDB);

        const req = {
            body: {
                correo: "admin@arcadex.com",
                password: "123456"
            }
        };

        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        await iniciarSesion(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "admin@arcadex.com"
        });

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error de conexión con MongoDB",
                status: 500
            })
        );

        expect(res.json).not.toHaveBeenCalled();
    });

    test("Debe crear un usuario correctamente", async () => {

        const datosUsuario = {
            nombre: "Admin",
            correo: "admin@arcadex.com",
            password: "123456"
        };

        const passwordEncriptada = "password_encriptado";

        const usuarioCreado = {
            _id: "123",
            nombre: "Admin",
            correo: "admin@arcadex.com",
            password: passwordEncriptada
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

        jest.spyOn(bcrypt, "hash").mockResolvedValue(passwordEncriptada);

        jest.spyOn(Usuario, "create").mockResolvedValue(usuarioCreado);

        const req = {
            body: datosUsuario
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await crearUsuario(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "admin@arcadex.com"
        });

        expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

        expect(Usuario.create).toHaveBeenCalledWith({
            nombre: "Admin",
            correo: "admin@arcadex.com",
            password: passwordEncriptada
        });

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Usuario creado correctamente",
            usuario: {
                id: "123",
                nombre: "Admin",
                correo: "admin@arcadex.com"
            }
        });

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe generar un error 400 cuando faltan campos obligatorios", async () => {

        jest.spyOn(Usuario, "findOne");

        jest.spyOn(bcrypt, "hash");

        jest.spyOn(Usuario, "create");

        const req = {
            body: {
                nombre: "Admin",
                correo: "",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await crearUsuario(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Todos los campos son obligatorios",
                status: 400
            })
        );

        expect(Usuario.findOne).not.toHaveBeenCalled();

        expect(bcrypt.hash).not.toHaveBeenCalled();

        expect(Usuario.create).not.toHaveBeenCalled();

        expect(res.status).not.toHaveBeenCalled();
    });

    test("Debe generar un error 409 cuando el correo ya está registrado", async () => {

        const usuarioExistente = {
            _id: "123",
            nombre: "Admin",
            correo: "admin@arcadex.com"
        };

        jest.spyOn(Usuario, "findOne").mockResolvedValue(usuarioExistente);

        jest.spyOn(bcrypt, "hash");

        jest.spyOn(Usuario, "create");

        const req = {
            body: {
                nombre: "Otro admin",
                correo: "admin@arcadex.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await crearUsuario(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            correo: "admin@arcadex.com"
        });

        expect(bcrypt.hash).not.toHaveBeenCalled();

        expect(Usuario.create).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "El correo ya está registrado",
                status: 409
            })
        );

        expect(res.status).not.toHaveBeenCalled();
    });

    test("Debe generar un error cuando falla la creación del usuario", async () => {
        const errorDB = new Error("Error al guardar en MongoDB");

        jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

        jest.spyOn(bcrypt, "hash").mockResolvedValue("password_encriptado");

        jest.spyOn(Usuario, "create").mockRejectedValue(errorDB);

        const req = {
            body: {
                nombre: "Admin",
                correo: "admin@arcadex.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await crearUsuario(req, res, next);

        expect(Usuario.findOne).toHaveBeenCalled();

        expect(bcrypt.hash).toHaveBeenCalled();

        expect(Usuario.create).toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al guardar en MongoDB"
            })
        );

        expect(res.status).not.toHaveBeenCalled();
    });
});