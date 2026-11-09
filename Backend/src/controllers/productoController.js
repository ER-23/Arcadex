import Producto from "../models/Producto.js";
import { randomUUID } from "crypto";
import { leerProductos, guardarProductos } from "../services/productoStorage.js";


const validarProducto = (datos) => {
    const { nombre, precio, cantidad, tipo } = datos;

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
        throw Object.assign(
            new Error('El nombre es obligatorio'),
            { status: 400 }
        );
    }

    if (precio === undefined || precio === null || precio === '' ||
        !Number.isFinite(Number(precio)) || Number(precio) < 0) {
        throw Object.assign(
            new Error('El precio debe ser un número mayor o igual a cero'),
            { status: 400 }
        );
    }

    if (cantidad === undefined || cantidad === null || cantidad === '' ||
        !Number.isInteger(Number(cantidad)) || Number(cantidad) < 0) {
        throw Object.assign(
            new Error('La cantidad debe ser un entero mayor o igual a cero'),
            { status: 400 }
        );
    }

    if (!['juegos', 'consola', 'accesorio'].includes(tipo)) {
        throw Object.assign(
            new Error('El tipo de producto no es válido'),
            { status: 400 }
        );
    }

    return {
        nombre: nombre.trim(),
        precio: Number(precio),
        cantidad: Number(cantidad),
        tipo
    };
};

//Obtener todos los productos
export const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await leerProductos();

        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
};

export const obtenerProducto = async (req, res, next) => {
    try {
        const productos = await leerProductos();

        const producto = productos.find(
            p => p._id === req.params.id
        );

        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }

        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
};

export const crearProducto = async (req, res, next) => {
    try {
        const productos = await leerProductos();

        const datosValidados = validarProducto(req.body);

        const nuevoProducto = {
            ...datosValidados,
            _id: randomUUID()
        };

        productos.push(nuevoProducto);

        await guardarProductos(productos);

        res.status(201).json(nuevoProducto);
    } catch (error) {
        next(error);
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const productos = await leerProductos();

        const indice = productos.findIndex(
            p => p._id === req.params.id
        );

        if (indice === -1) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }

        const datosValidados = validarProducto({
            ...productos[indice],
            ...req.body
        });

        const productoActualizado = {
            ...datosValidados,
            _id: productos[indice]._id
        };
        
        productos[indice] = productoActualizado;

        await guardarProductos(productos);

        res.status(200).json(productoActualizado);

    } catch (error) {
        next(error);
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const productos = await leerProductos();

        const indice = productos.findIndex(
            p => p._id === req.params.id
        );

        if (indice === -1) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }

        productos.splice(indice, 1);

        await guardarProductos(productos);

        res.status(200).json({
            mensaje: 'Producto eliminado correctamente'
        });

    } catch (error) {
        next(error);
    }
}