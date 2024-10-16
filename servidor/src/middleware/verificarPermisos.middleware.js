import { sequelize } from "../database/database.js";
import { QueryTypes } from "sequelize";
// Verificar permisos del usuario para acceder a la ruta

// verificar el tipo de usuario para acceder a la ruta

const verificarPermisos = async (req, res, next) => {

    try {
        
        const perfil_id = req.usuario.perfil_id;
        //const perfil_id =100;
    
        const consulta = await sequelize.query(
            `select roles.str_rol_nombre, per.int_perfil_id, per.int_per_id, personas.str_per_nombres
            from seguridad.tb_roles as roles join seguridad.tb_perfiles as per
            on roles.int_rol_id = per.int_rol_id join seguridad.tb_personas as personas
            on personas.int_per_id= per.int_per_id
            where per.int_perfil_id='${perfil_id}'`, { type: QueryTypes.SELECT }
        );
        if(!consulta || consulta.length === 0){
            return res.status(401).json({
                status: false,
                message: "Acceso denegado, prueba iniciando sesión nuevamente",
            });
        }

        console.log("Consulta", consulta);

        if(consulta[0].str_rol_nombre === "PÚBLICO"){
           next();
        }else{
            return res.status(401).json({
                status: false,
                message: "Acceso denegado, prueba iniciando sesión nuevamente",
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

export default verificarPermisos;
