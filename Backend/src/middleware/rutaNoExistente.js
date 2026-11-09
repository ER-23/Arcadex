const rutaNoEncontrada = (req, res, next) => {
    const error = new Error(
        `Ruta no encontrada: ${req.originalUrl}`
    );

    error.status = 404;

    next(error);
};

export default rutaNoEncontrada;