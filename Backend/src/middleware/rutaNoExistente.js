const rutaNoEncontrada = (req, res, next) => {
    const error = new Error(
        `Ruta no encontrada: ${req.originalUrl}`
    );

    error.status = 404;

    console.log(`Se trató de llegar a la ruta: ${req.originalUrl}`)

    next(error);
};

export default rutaNoEncontrada;