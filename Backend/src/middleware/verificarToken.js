import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("Acceso no autorizado");

            error.status = 401;

            throw error;
        }

        const token = authHeader.split(" ")[1];

        const verificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = verificado.id;

        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError") {

            error.status = 401;
        }
        next(error);
    }
};

export default verificarToken;