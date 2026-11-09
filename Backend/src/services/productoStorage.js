import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaArchivo = path.join(__dirname, '../data/productos.json');

// Leer todos los productos
export const leerProductos = async () => {
    const contenido = await fs.readFile(rutaArchivo, 'utf-8');

    console.log("Archivo leido correctamente");

    return JSON.parse(contenido);
};

// Guardar todos los productos
export const guardarProductos = async (productos) => {
    await fs.writeFile(
        rutaArchivo,
        JSON.stringify(productos, null, 2),
        'utf-8'
    );

    console.log("Productos guardados correctamente");
};