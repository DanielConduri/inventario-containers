import { sequelize } from "../database/database.js";
import { QueryTypes } from "sequelize";

const verificarPermisoDelete = async (req, res, next) => {
  /*try {
    //imprimir por consola la url base
    console.log("URL BASE", req.baseUrl);
    const match = req.baseUrl.match(/\/([^/]+)\/?$/); // Busca el último segmento de la ruta
    const baseUrl = match ? match[1] : '';
    console.log("URL BASE", baseUrl);

    //obtener el perfil_id del token
    const perfil_id = req.usuario.perfil_id;


    //consulto en la base de datos el permiso de eliminar

    const permiso = await sequelize.query(
        `SELECT A.bln_eliminar
         FROM seguridad.tb_permisos AS A
         INNER JOIN seguridad.tb_menus AS tm ON A.int_menu_id = tm.int_menu_id
         WHERE A.int_perfil_id = ${perfil_id} AND tm.str_menu_path like '${baseUrl}'`,
        {
            type: QueryTypes.SELECT,
        }
    );
      

    console.log("PERMISO", permiso[0].bln_eliminar );
    if (permiso[0].bln_eliminar == true) {
      console.log("TIENE PERMISO PARA ELIMINAR");
      next();
    } else {
      console.log("NO TIENE PERMISO PARA ELIMINAR");
      res.json({
        status: false,
        message: "No tiene permiso para eliminar",
      });
    }
  } catch (error) {
    console.log(error);
  }*/
};

export default verificarPermisoDelete;
