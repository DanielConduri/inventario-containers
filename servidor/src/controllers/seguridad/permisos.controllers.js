import { QueryTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Permisos } from "../../models/seguridad/permisos.models.js";
import jwt from "jsonwebtoken";
import { jwtVariables } from "../../config/variables.config.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
export const obtenerPermisos = async (req, res) => {
  try {
    const permisos = await sequelize.query(
      "SELECT * FROM seguridad.tb_permisos",
      { type: QueryTypes.SELECT }
    );

    if (!permisos || permisos.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron permisos",
      });
    } else {
      return res.json({
        status: true,
        message: "Permisos encontrados",
        body: permisos,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerPermisosPorPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const permisos = await sequelize.query(
      `select menus.int_menu_id, menus.int_menu_padre, menus.str_menu_nombre,permisos.bln_ver, permisos.bln_crear, permisos.bln_editar, permisos.bln_eliminar,menus.str_menu_icono
    from seguridad.tb_permisos as permisos join seguridad.tb_menus as menus on permisos.int_menu_id = menus.int_menu_id
    where int_perfil_id='${id}' and menus.int_menu_id<>1 and menus.str_menu_estado='ACTIVO'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    

    if (!permisos || permisos.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron permisos",
        body: permisos,
      });
    }
    res.json({
      status: true,
      message: "Permisos encontrados",
      body: permisos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const obtenerPermisosPorRol = async (req, res) => {
  try {
    const { rol } = req.params;
    const { token } = req.cookies;

    console.log('--> ROL', rol)

    const usuario = jwt.verify(token, jwtVariables.jwtSecret);

    console.log('--> USUARIO', usuario)

    if (rol === "@d$") {

      console.log('entra al if ----')
      //el rol es proviniente de la cookie y podemos consultar los permisos del usuario
      const permisosUser = await permisosRol(usuario.perfil_id);
      const menusUser = await menusRol(usuario.perfil_id);
      const menus = obtenerMenusPrincipales(menusUser);
      return res.json({
        status: true,
        message: "Permisos encontrados",
        menus: menus,
        permisos: permisosUser,
      });
    }
    const datos = await sequelize.query(
      `select perfiles.int_perfil_id ,roles.int_rol_id, perfiles.int_perfil_id
      from seguridad.tb_personas as personas join seguridad.tb_perfiles as perfiles on personas.int_per_id = perfiles.int_per_id
      join seguridad.tb_roles as roles on roles.int_rol_id= perfiles.int_rol_id
      where personas.int_per_idcas='${usuario.idCas}' and roles.str_rol_nombre='${rol}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    
    //obtengo los permisos del rol y lso menus
    const permisos = await permisosRol(datos[0].int_perfil_id);
    const menusConSubmenus = await menusRol(datos[0].int_perfil_id);

    
    if (!permisos || permisos.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron permisos para este Rol",
        body: permisos,
      });
    }
    // Función para obtener los submenus de un menu dado
    function obtenerSubmenus(menuId, permisosF) {
      const submenus = permisosF.filter(
        (menu) => menu.int_menu_padre === menuId
      );
      submenus.forEach((submenu) => {
        submenu.submenus = obtenerSubmenus(submenu.int_menu_id, permisosF);
      });
      return submenus;
    }
    // Función para obtener los menus principales
    function obtenerMenusPrincipales(permisosF) {
      const menusPrincipales = permisosF.filter(
        (menu) => menu.int_menu_padre === 1
      );

      menusPrincipales.forEach((menu) => {
        
        menu.submenus = obtenerSubmenus(menu.int_menu_id, permisosF);
      });

      return menusPrincipales;
    }
    //funcion para obtener los permisos de un perfil
    async function permisosRol(perfil_id) {
      const permisosRolDatos = await sequelize.query(
        `select menus.int_menu_id, menus.int_menu_padre,menus.str_menu_path, menus.str_menu_nombre,permisos.bln_ver, permisos.bln_crear, permisos.bln_editar, permisos.bln_eliminar
        from seguridad.tb_permisos as permisos join seguridad.tb_menus as menus on permisos.int_menu_id = menus.int_menu_id
        where int_perfil_id='${perfil_id}'  and menus.str_menu_estado='ACTIVO' and bln_ver='true'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      return permisosRolDatos;
    }

    //funcion para obtener los menus de un perfil
    async function menusRol(perfil_id) {
      const menusRolDatos = await sequelize.query(
        `select menus.int_menu_id, menus.int_menu_padre,menus.str_menu_path, menus.str_menu_nombre,menus.str_menu_icono
      from seguridad.tb_permisos as permisos join seguridad.tb_menus as menus on permisos.int_menu_id = menus.int_menu_id
      where int_perfil_id='${perfil_id}'  and menus.str_menu_estado='ACTIVO' and bln_ver='true'`,

        {
          type: QueryTypes.SELECT,
        }
      );
      return menusRolDatos;
    }

    // Obtener los menus y submenus
    const menus = obtenerMenusPrincipales(menusConSubmenus);

    /*
    //obtener el rol actual
    const rolActual = await sequelize.query(
      `	SELECT
      roles.int_rol_id,
      perfiles.int_perfil_id,
      roles.str_rol_nombre
      FROM seguridad.tb_roles AS roles 
      JOIN seguridad.tb_perfiles as perfiles on roles.int_rol_id= perfiles.int_rol_id  
      JOIN seguridad.tb_personas as personas on personas.int_per_id = perfiles.int_per_id
      WHERE personas.int_per_idcas = '${usuario.idCas}'and roles.str_rol_nombre = '${rol}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    */
    const usuarioToken = {
      idCas: usuario.idCas,
      perfil_id: datos[0].int_perfil_id,
      rol_id: datos[0].int_rol_id,
    };

    const tokenF = jwt.sign(usuarioToken, jwtVariables.jwtSecret, {
      expiresIn: "7d",
    });
    
    res.set('Authorization', 'Bearer ' + tokenF); // Establece el nuevo token en la cabecera "Authorization"

    res.cookie("token", tokenF, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });

    res.json({
      status: true,
      message: "Permisos encontrados",
      menus: menus,
      permisos: permisos,
      accessToken:tokenF,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearPermiso = async (req, res) => {
  const { id_perfil } = req.params;
  const permisos = req.body;

  //recorrer el arreglo de permisos e insertar en la base de datos
  permisos.map(
    async ({ int_menu_id, bln_ver, bln_editar, bln_crear, bln_eliminar }) => {


      const permiso = await Permisos.create({
        int_perfil_id: id_perfil,
        int_menu_id: int_menu_id,
        bln_ver: bln_ver,
        bln_editar: bln_editar,
        bln_crear: bln_crear,
        bln_eliminar: bln_eliminar,
      });
    }
  );

  return res.json({
    status: true,
    message: "Permisos creados",
  });
};

export const actualizarPermiso = async (req, res) => {
  try {
    const { id_perfil } = req.params;
    const permisos = req.body;
    
    const ver = "bln_ver";
    const editar = "bln_editar";
    const crear = "bln_crear";
    const eliminar = "bln_eliminar";

    //opcion 1
    let bandera = await actualizarPermisosInterno();
    
    async function actualizarPermisosInterno() {
      let cont = 0;
      await Promise.all(
        permisos.map(
          async ({
            int_menu_id,
            bln_ver,
            bln_editar,
            bln_crear,
            bln_eliminar,
          }) => {

            //antes de actualizar verificar si el permiso es el mismo

            const verificarPermiso = await Permisos.findOne({
              where: {
                int_perfil_id: id_perfil,
                int_menu_id: int_menu_id,
              },
            });
            if (verificarPermiso.bln_ver != bln_ver) {
              //actualizar y guardar en la tabla de auditoria

              actualizarPermisoDePerfil(id_perfil, ver, int_menu_id, bln_ver);
              cont = cont + 1;
            }
            if (verificarPermiso.bln_editar != bln_editar) {
              //actualizar y guardar en la tabla de auditoria
              actualizarPermisoDePerfil(
                id_perfil,
                editar,
                int_menu_id,
                bln_editar
              );
              cont = cont + 1;
            }
            if (verificarPermiso.bln_crear != bln_crear) {
              //actualizar y guardar en la tabla de auditoria
              actualizarPermisoDePerfil(
                id_perfil,
                crear,
                int_menu_id,
                bln_crear
              );
              cont = cont + 1;
            }
            if (verificarPermiso.bln_eliminar != bln_eliminar) {
              //actualizar y guardar en la tabla de auditoria
              actualizarPermisoDePerfil(
                id_perfil,
                eliminar,
                int_menu_id,
                bln_eliminar
              );
              cont = cont + 1;
              
            }
          }
        )
      );
     
      return cont;
    }
    
    if (bandera == 0) {
      return res.json({
        status: false,
        message: "No se encontraron cambios en los permisos",
      });
    }
    insertarAuditoria(
      null,
      "tb_permisos",
      "UPDATE",
      permisos,
      req.ip,
      req.headers.host,
      req,
      "Se ha actualizado un permiso"
    
    );
    return res.json({
      status: true,
      message: "Permisos actualizados",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function actualizarPermisoDePerfil(
  id_perfil,
  permiso,
  int_menu_id,
  valor
) {
  //actualizar permiso con un query
  const actualizoPermiso = await sequelize.query(
    `UPDATE seguridad.tb_permisos
    SET ${permiso}=${valor}
    WHERE int_perfil_id='${id_perfil}' and int_menu_id ='${int_menu_id}'`
  );
  
}

export const eliminarPermiso = async (req, res) => {};

export default {
  obtenerPermisos,
  obtenerPermisosPorPerfil,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
  obtenerPermisosPorRol,
};
