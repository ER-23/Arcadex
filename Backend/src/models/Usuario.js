import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
    nombre: {
        type:String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Usuario = mongoose.model("Usuario", usuariosSchema);

export default Usuario;