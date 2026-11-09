import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
    },

    precio: {
        type: Number,
        required: true,
        min: 0
    },

    cantidad: {
        type: Number,
        required: true,
        min: 0
    },

    tipo: {
        type:String,
        required: true,
        enum: ["juegos", "consola", "accesorio"]
    }
});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;