import { sequelize } from "../../database/database.js";
import { Menu } from "../../models/seguridad/menu.models.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { Op } from "sequelize";
import { QueryTypes } from "sequelize";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

export const obtenerMenusSubmenus = async (req, res) => {
 
  try {
    const data = await sequelize.query("SELECT * FROM seguridad.tb_menus ", {
      type: sequelize.QueryTypes.SELECT,
    });

    const menus = obtenerMenusdeData();

    function obtenerSubmenus(padre) {
      return data.filter(menu => menu.int_menu_padre === padre)
        .map(menu => ({
          ...menu,
          submenus: obtenerSubmenus(menu.int_menu_id),
        }));
    }
    
    function obtenerMenusdeData() {
      return data.filter(menu => menu.int_menu_padre === null)
        .map(menu => ({
          ...menu,
          submenus: obtenerSubmenus(menu.int_menu_id),
        }));
    }
    const submenusPrincipal = obtenerSubmenus(1);
    
    return res.json({
      status: true,
      message: "Menús encontrados",
      body:submenusPrincipal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerMenus = async (req, res) => {
  try {
    const menu = await Menu.findAll({
      where: {
        [Op.and]: [{ int_menu_id: { [Op.not]: 1 } }],
      },
    });
    res.json({
      status: true,
      message: "Menús encontrados",
      body: menu,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const obtenerSubmenusDeUnMenu = async (req, res) => {
  try {
    
    const { int_menu_id } = req.params;
    const menu = await Menu.findAll({
      where: {
        int_menu_padre: int_menu_id,
      },
    });
    if(!menu || menu.length === 0){
      return res.json({
        status: false,
        message: "No se encontraron submenús",
      });
    }
    
    res.json({
      status: true,
      message: "Submenús encontrados",
      body: menu,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const actualizarMenu = async (req, res) => {
  try {
    const { int_menu_id } = req.params;
    const {
      str_menu_nombre,
      str_menu_icono,
      str_menu_path,
      int_menu_padre,
      str_menu_descripcion
    } = req.body;
    const antiguoValor = await Menu.findOne({
      where: {
        int_menu_id,
      },
    });
    const menu = await Menu.update(
      {
        str_menu_nombre,
        str_menu_icono,
        str_menu_path,
        int_menu_padre,
        str_menu_descripcion
      },
      {
        where: {
          int_menu_id,
        },
      }
    );

    const nuevoValor = await Menu.findOne({
      where: {
        int_menu_id,
      },
    });
    insertarAuditoria(
      antiguoValor,
      "tb_menus",
      "UPDATE",
      nuevoValor,
      req.ip,
      req.headers.host,
      req,
      "Se ha actualizado un menú"

    )
    res.json({
      status: true,
      message: "Menú actualizado correctamente",
      body: menu,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const obtenerMenuPorId = async (req, res) => {
    try {
        const { int_menu_id } = req.params;
        const menu = await Menu.findOne({
            where: {
                int_menu_id
            }
        });
        if(!menu|| menu.length==0) return res.status(404).json({ message: 'Menú no encontrado' });
        res.json({
            status: true,
            message: 'Menú encontrado',
            body: menu
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const eliminarMenu = async (req, res) => {
  try {
    const { int_menu_id } = req.params;
    const menu = await Menu.findOne({
      where: {
        int_menu_id,
      },
    });
    if (!menu) {
      return res.json({
        status: false,
        message: "Menú no encontrado",
      });
    }
    if(menu.str_menu_estado=="ACTIVO"){
      menu.str_menu_estado="INACTIVO";
      res.json({
        status: false,
        message: "Menú desactivado correctamente",
        body: menu,
      });
    }else{
      menu.str_menu_estado="ACTIVO";
       res.json({
        status: false,
        message: "Menú activado correctamente",
        body: menu,
      });
    }
    const nuevoUp = await menu.save();
    const nuevo = await Menu.findOne({
      where: {
        int_menu_id,
      },
    });
    insertarAuditoria(
      menu,
      "tb_menus",
      "UPDATE",
      nuevo,
      req.ip,
      req.headers.host,
      req,
      "Se ha actualizado un menú"
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//crear menu
export const crearMenu = async (req, res) => {
  try {
    const {
      str_menu_nombre,
      str_menu_icono,
      str_menu_path,
      int_menu_padre,
      str_menu_descripcion,
    } = req.body;



    // verificar si el menu ya existe
    const menuExiste = await Menu.findOne({
      where: {
        str_menu_nombre,
      },
    });

    if (menuExiste) {
      return res.json({
        status: false,
        message: "El menú ya existe",
        body: null,
      });
    }
    const menu = await Menu.create({
      str_menu_nombre,
      str_menu_icono,
      str_menu_path,
      int_menu_padre,
      str_menu_descripcion,
    });

    insertarAuditoria(
      null,
      "tb_menus",
      "CREATE",
      menu,
      req.ip,
      req.headers.host,
      req,
      "Se ha creado un menú"
    );

    // actualizar los permisos de  todos los perfiles con este menu nuevo
    const perfilIdPermisos = await sequelize.query(
      `select distinct int_perfil_id from seguridad.tb_permisos`,
      { type: QueryTypes.SELECT }
    );
    

    //creo el permiso con el menu llamando a la funcion de crear permiso
    const permiso = perfilIdPermisos.map(async (perfil) => {
      const crearPermisoNunevo = await sequelize.query(
        `Select seguridad.f_crear_permiso_predeterminado('${perfil.int_perfil_id}','${menu.int_menu_id}')`,
        { type: QueryTypes.SELECT }
      );
      return crearPermisoNunevo;
    });

    return res.json({
      status: true,
      message: "Menú creado con éxito",
      body: menu,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  obtenerMenusSubmenus,
  obtenerMenus,
  actualizarMenu,
  crearMenu,
  obtenerMenuPorId,
  eliminarMenu,
  obtenerSubmenusDeUnMenu
};
