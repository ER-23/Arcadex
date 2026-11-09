import Producto from "../models/Producto.js";

//Obtener todos los productos
export const obtenerProductos = async (req,res) => {
    try {
        const productos = await Producto.find();

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ mensaje: error.message});
    }
};

export const actualizarProducto = async (req, res) => {
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
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);

    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

export const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}