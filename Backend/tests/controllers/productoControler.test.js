import { jest, describe, test, expect, afterEach } from "@jest/globals";
import Producto from "../../src/models/Producto.js";
import { obtenerProductos, 
         obtenerProducto,
         crearProducto,
         actualizarProducto,
         eliminarProducto
} from "../../src/controllers/productoController.js";

//Restaura los mocks despues de cada prueba
afterEach(() => {
    jest.restoreAllMocks();
});

describe("Controlador de productos", () => {
    test("Debe devolver todos los productos", async () => {

        //Simulamos los productos de MongoDB
        const productos = [
            {
                nombre: "Minecraft",
                precio: 500,
                cantidad: 10,
                tipo: "juegos"
            },
            {
                nombre: "Playstation 5",
                precio: 12000,
                cantidad: 5,
                tipo: "consola"
            }
        ];

        //Simulamos find
        jest.spyOn(Producto, "find").mockResolvedValue(productos);

        //simulamos req, res y next
        const req = {};

        const  res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        //Ejecutamos el controlador
        await obtenerProductos(req, res, next);

        //Comprobamos los resultados
        expect(Producto.find).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(
            productos
        );

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe devolver un producto cuando existe", async () => {

        const productoSimulado = {
            _id: "123",
            nombre: "Minecraft",
            precio: 500,
            cantidad: 10,
            tipo: "juegos"
        };

        jest.spyOn(Producto, "findById").mockResolvedValue(productoSimulado);

        const req = {
            params: { id: "123" }
        };

        const res = {
            status:jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await obtenerProducto(req, res, next);

        expect(Producto.findById).toHaveBeenCalledWith("123");

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(productoSimulado);

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe generar un error 404 cuando el producto no existe", async () => {

        jest.spyOn(Producto, "findById").mockResolvedValue(null);

        const req = {
            params: { id: "999" }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await obtenerProducto(req, res, next);

        expect(Producto.findById).toHaveBeenCalledWith("999");

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Producto no encontrado",
                status: 404
            })
        );

        expect(res.status).not.toHaveBeenCalled();
    });

    test("Debe crear un producto correctamente", async () => {

        const datosProducto = {
            nombre: "Mario Kart 8 Deluxe",
            precio: 1000,
            cantidad: 15,
            tipo: "juegos"
        };

        //Producto que simula que mongo creó un producto
        const productoCreado = {
            _id: "456",
            ...datosProducto
        };

        jest.spyOn(Producto, "create").mockResolvedValue(productoCreado);

        const req = {
            body: datosProducto
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await crearProducto(req, res, next);

        expect(Producto.create).toHaveBeenCalledWith(datosProducto);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith(productoCreado);

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe actualizar un producto correctamente", async () => {

        const datosActualizados = {
            nombre: "Minecraft Deluxe",
            precio: 600,
            cantidad: 20,
            tipo: "juegos"
        };

        const productoActualizado = {
            _id: "456",
            ...datosActualizados
        };

        jest.spyOn(Producto, "findByIdAndUpdate").mockResolvedValue(productoActualizado);

        const req = {
            params: { id: "456" },
            body: datosActualizados
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await actualizarProducto(req, res, next);

        expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith(
            "456",
            datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(productoActualizado);

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe generar un error 404 cuando el producto no existe", async () => {

        jest.spyOn(Producto, "findByIdAndUpdate").mockResolvedValue(null);

        const req = {
            params: { id: "999" },
            body: { precio: 600 }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await actualizarProducto(req, res, next);

        expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith(
            "999",
            { precio: 600 },
            {
                new: true,
                runValidators: true
            }
        );

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Producto no encontrado",
                status: 404
            })
        );

        expect(res.status).not.toHaveBeenCalled();
    });

    test("Debe eliminar un producto correctamente", async () => {
        jest.spyOn(Producto, "findByIdAndDelete").mockResolvedValue({
            _id: "456",
            nombre: "Minecraft",
            precio: 500,
            cantidad: 10,
            tipo: "juegos"
        });

        const req = {
            params: { id: "456" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await eliminarProducto(req, res, next);

        expect(Producto.findByIdAndDelete).toHaveBeenCalledWith("456");

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Producto eliminado correctamente"
        });

        expect(next).not.toHaveBeenCalled();
    });

    test("Debe generar un error 404 cuando el producto no existe", async () => {

        jest.spyOn(Producto, "findByIdAndDelete").mockResolvedValue(null);

        const req = {
            params: { id: "999" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await eliminarProducto(req, res, next);

        expect(Producto.findByIdAndDelete).toHaveBeenCalledWith("999");

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Producto no encontrado",
                status: 404
            })
        );

        expect(res.status).not.toHaveBeenCalled();
    });
});