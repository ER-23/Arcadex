const manejarErrores = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    res.status(status).json({
        mensaje: err.message || "Error interno del servidor"
    });

    console.log(`Error: ${err.message} \nEstado:${err.status}`)
};

export default manejarErrores;