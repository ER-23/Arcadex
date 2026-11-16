import express from "express";
import cors from "cors";

import rutaNoEncontrada from "./middleware/rutaNoExistente.js";
import manejarErrores from "./middleware/errorMiddleware.js";
import productoRoutes from "./routes/productoRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/productos", productoRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de Arcadex");
});

app.use(rutaNoEncontrada);

app.use(manejarErrores);

export default app;