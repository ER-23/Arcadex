import Producto from "../models/Producto.js";

//Obtener todos los productos
export const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await Producto.find();

        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
};

export const obtenerProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            const error = new Error("Producto no encontrado");
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
        const nuevoProducto = await Producto.create(req.body);

        res.status(201).json(nuevoProducto);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
        
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if(!producto) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json(producto);

    } catch (error) {
        next(error);
    }
}

export const eliminarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
}