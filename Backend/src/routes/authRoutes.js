import express from "express";
import { iniciarSesion, crearUsuario } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", iniciarSesion);
router.post("/registro", crearUsuario);

export default router;