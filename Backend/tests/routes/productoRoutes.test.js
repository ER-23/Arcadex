import { jest, describe, test, expect, afterEach } from "@jest/globals";
import request from "supertest";

import app from "../../src/app.js";
import Producto from "../../src/models/Producto.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

afterEach(() => {
    jest.resetAllMocks();
});

describe("Rutas de productos", () => {
    test("GET /api/productos debe devolver todos los productos", async () => {
        const productosSimulados = [
            {
                _id: "123",
                nombre: "Elden Ring",
                precio: 899,
                cantidad: 10,
                tipo: "juegos"
            },
            {
                _id: "456",
                nombre: "PlayStation 5",
                precio: 9999,
                cantidad: 5,
                tipo: "consola"
            }
        ];

        jest.spyOn(Producto, "find").mockResolvedValue(productosSimulados);

        const respuesta = await request(app).get("/api/productos");

        expect(respuesta.status).toBe(200);

        expect(respuesta.body).toEqual(productosSimulados);
    });

    test("GET /api/productos/:id debe devolver un producto", async () => {
        const productoSimulado = {
            _id: "123",
            nombre: "Elden Ring",
            precio: 899,
            cantidad: 10,
            tipo: "juegos"
        };

        jest.spyOn(Producto, "findById").mockResolvedValue(productoSimulado);

        const respuesta = await request(app).get("/api/productos/123");

        expect(respuesta.status).toBe(200);

        expect(respuesta.body).toEqual(productoSimulado);
    });

    test("GET /api/productos/:id debe responder si el producto no existe", async () => {

        jest.spyOn(Producto, "findById").mockResolvedValue(null);

        const respuesta = await request(app).get("/api/productos/999");

        expect(respuesta.status).toBe(404);
    });

    test("POST /api/productos debe rechazar peticiones sin token", async () => {
        const respuesta = await request(app)
            .post("/api/productos")
            .send({
                nombre: "Elden Ring",
                precio: 899,
                cantidad: 10,
                tipo: "juegos"
            });
        
        expect(respuesta.status).toBe(401);
        
        expect(respuesta.body).toEqual({
            mensaje: "Acceso no autorizado"
        });
    });

    test("POST /api/productos debe rechazar un token inválido", async () => {

        const respuesta = await request(app)
            .post("/api/productos")
            .set("Authorization", "Bearer token_falso")
            .send({
                nombre: "Elden Ring",
                precio: 899,
                cantidad: 10,
                tipo: "juegos"
            });

        expect(respuesta.status).toBe(401);
        
        expect(respuesta.body).toEqual({
            mensaje: "jwt malformed"
        });
    });

    test("POST /api/productos debe permitir el acceso con un token válido", async () => {

        const token = jwt.sign(
            { id: "usuario123" },
            process.env.JWT_SECRET
        );

        const productoSimulado = {
            _id: "789",
            nombre: "Elden Ring",
            precio: 899,
            cantidad: 10,
            tipo: "juegos"
        };

        jest.spyOn(Producto, "create").mockResolvedValue(productoSimulado);

        const respuesta = await request(app)
            .post("/api/productos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nombre: "Elden Ring",
                precio: 899,
                cantidad: 10,
                tipo: "juegos"
            });

        expect(respuesta.status).toBe(201);

        expect(respuesta.body).toEqual(productoSimulado);
    });

    test("PUT /api/productos/:id debe actualizar un producto", async () => {

        const token = jwt.sign(
            { id: "usuario123" },
            process.env.JWT_SECRET
        );

        const productoActualizado = {
            _id: "123",
            nombre: "Elden Ring Shadow of the Erdtree",
            precio: 1099,
            cantidad: 8,
            tipo: "juegos"
        };

        jest.spyOn(Producto, "findByIdAndUpdate").mockResolvedValue(productoActualizado);

        const respuesta = await request(app)
            .put("/api/productos/123")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nombre: "Elden Ring Shadow of the Erdtree",
                precio: 1099,
                cantidad: 8,
                tipo: "juegos"
            });

        expect(respuesta.status).toBe(200);

        expect(respuesta.body).toEqual(productoActualizado);

    });

    test("PUT /api/productos/:id debe responder 404 si el producto no existe", async () => {

        const token = jwt.sign(
            { id: "usuario123" },
            process.env.JWT_SECRET
        );

        jest.spyOn(Producto, "findByIdAndUpdate").mockResolvedValue(null);

        const respuesta = await request(app)
            .put("/api/productos/999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nombre: "Producto inexistente",
                precio: 500,
                cantidad: 5,
                tipo: "juegos"
            });

        expect(respuesta.status).toBe(404);

        expect(respuesta.body).toEqual({
            mensaje: "Producto no encontrado"
        });
    });

    test("DELETE /api/productos/:id debe eliminar un producto", async () => {

        const token = jwt.sign(
            { id: "usuario123" },
            process.env.JWT_SECRET
        );

        jest.spyOn(Producto, "findByIdAndDelete").mockResolvedValue({
                _id: "123",
                nombre: "Elden Ring",
                precio: 899,
                cantidad: 10,
                tipo: "juegos"
            });

        const respuesta = await request(app)
            .delete("/api/productos/123")
            .set("Authorization", `Bearer ${token}`);

        expect(respuesta.status).toBe(200);

        expect(respuesta.body).toEqual({
            mensaje: "Producto eliminado correctamente"
        });
    });

    test("DELETE /api/productos/:id debe responder 404 si el producto no existe", async () => {

        const token = jwt.sign(
            { id: "usuario123" },
            process.env.JWT_SECRET
        );

        jest.spyOn(Producto, "findByIdAndDelete").mockResolvedValue(null);

        const respuesta = await request(app)
            .delete("/api/productos/999")
            .set("Authorization", `Bearer ${token}`);

        expect(respuesta.status).toBe(404);

        expect(respuesta.body).toEqual({
            mensaje: "Producto no encontrado"
        });
    });
});