// Verificar los permisos del usuario para acceder a la ruta
import { jwtVariables } from "../config/variables.config.js";
import jwt from "jsonwebtoken";

function verificarToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Acceso denegado, prueba iniciando sesión nuevamente",
        });
    }
    try {
        const verificado = jwt.verify(token, jwtVariables.jwtSecret);
        req.usuario = verificado;
        next();
    } catch (error) {
      console.log("Error en el middleware",error.message);
        res.status(400).json({
            status: false,
            message: "Token no válido",
        });
    }

};
export default verificarToken;
