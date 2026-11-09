import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import conectarDB from "./config/database.js";
import rutaNoEncontrada from "./middleware/rutaNoExistente.js";
import manejarErrores from "./middleware/errorMiddleware.js";
import productoRoutes from "./routes/productoRoutes.js";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

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

const PORT = process.env.PORT || 3000;

const iniciarServidor= async () => {
    await conectarDB();

    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en el puerto ${PORT}`);
    });
};

iniciarServidor();