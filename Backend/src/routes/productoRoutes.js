import express from "express";
import verificarToken from "../middleware/verificarToken.js";

import {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productoController.js";

const router = express.Router();

router.get("/", obtenerProductos);

router.get("/:id", obtenerProducto);

router.post("/", verificarToken, crearProducto);

router.put("/:id", verificarToken, actualizarProducto);

router.delete("/:id", verificarToken, eliminarProducto);

export default router;