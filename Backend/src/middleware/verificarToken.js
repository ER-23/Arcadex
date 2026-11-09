import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "Acceso no autorizado"
            });
        }

        const token = authHeader.split(" ")[1];

        const verificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = verificado.id;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};

export default verificarToken;