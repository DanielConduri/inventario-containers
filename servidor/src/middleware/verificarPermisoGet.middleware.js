import { sequelize } from "../database/database.js";
import { QueryTypes } from "sequelize";

const verificarPermisoGet = async (req, res, next, menu) => {
    try {
        const perfil_id = req.usuario.perfil_id;
        const menu_id = menu;
        const query = `SELECT bln_ver FROM seguridad.tb_permisos WHERE int_perfil_id = ${perfil_id} AND int_menu_id = ${menu_id}`;
        if(!query){
            return res.status(400).json({
                status: false,
                message: "No se encontró el menú",
            });
        }
        if(query.bln_ver==="true"){
            next();
        }else{
            return res.status(400).json({
                status: false,
                message: "No tiene permiso para esta acción",
            });
        }

        
    } catch (error) {
        console.log("Error en el middleware", error.message);
        res.status(400).json({
            status: false,
            message: "Token no válido",
        });
    }
}
export default verificarPermisoGet;