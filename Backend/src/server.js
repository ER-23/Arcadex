import dotenv from "dotenv";
import conectarDB from "./config/database.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    await conectarDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Servidor ejecutandose en el puerto ${PORT}`);
    });
};

iniciarServidor();