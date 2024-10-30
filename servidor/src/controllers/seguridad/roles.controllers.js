import { Roles } from "../../models/seguridad/roles.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
//obtener todos los roles de la BD
export const obtenerRoles = async (req, res) => { 
  try {
    
    const select = Object.keys(req.query).length===0;
    // para enviar roles activos cuando quiera crear un perfil a un usuario
    if(select){
      const rolesSelect = await Roles.findAll(
       {
        where : {
          str_rol_estado : 'ACTIVO'
        }
       } 
      );
      if (!rolesSelect || rolesSelect.lenght === 0) {
        return res.json({
          status: false,
          message: "Roles no encontrados",
          body: rolesSelect,
        });
      }else{
        return res.json({
          status: true,
          message: "Roles encontrados",
          body: rolesSelect,
        });
    } 
  }
   const paginationData = req.query;

    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Roles,'','');
      return res.json({
        status: true,
        message: "Roles encontrados",
        body: datos,
        total,
      });
    }

    const roles = await Roles.findAll({ limit: 5});
    if (!roles || roles.lenght === 0) {
      return res.json({
        status: false,
        message: "Roles no encontrados",
        body: roles,
      });
    }else{
      const { datos, total } = await paginarDatos(paginationData.page, paginationData.size, Roles, paginationData.parameter,paginationData.data);
      return res.json({
        status: true,
        message: "Roles encontrados",
        body: datos,
        total,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//obtener un rol específico de la BD
const obtenerRol = async (req, res) => {
  const { rol_id } = req.params;
  try {
    
    const rol = await Roles.findOne({
      where: {
        int_rol_id: rol_id,
      },
    });
    if (!rol) {
      return res.json({
        status: false,
        message: "Rol no encontrado",
        body: rol,
      });
    } 
      res.json({
        status: true,
        message: "Rol encontrado",
        body: rol,
      });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Actualizar rol
const actualizarRol = async (req, res) => {
  try {
    const { rol_id } = req.params;
    const { rol_nombre, rol_descripcion} = req.body;

    try {
      const rol = await Roles.findOne({
        where: {
          int_rol_id: rol_id,
        },
      });

      //validar que no esten vacios y retornar "datos vacios"
      if (!validar(rol_nombre, rol_descripcion)) {
        return res.json({
          status: false,
          message: "Debe llenar todos los campos",
        });
      }
      if (!rol || rol.lenght === 0) {
        return res.json({
          status: false,
          message: "Rol no encontrado",
        });
      } else {
        rol.str_rol_nombre = rol_nombre;
        rol.str_rol_descripcion = rol_descripcion;
        await rol.save();

        insertarAuditoria(
          rol,
          "tb_roles",
          "UPDATE",
          rol,
          req.ip,
          req.hearders.host,
          req,
          "Se ha actualizado un rol"
        )

        return res.json({
          status: true,
          message: "Rol actualizado",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Eliminar rol
const eliminarRol = async (req, res) => {
  try {
    const { rol_id } = req.params;
    const rol = await Roles.findOne({
      where: {
        int_rol_id: rol_id,
      },
    });
    //antes de cambiar el estado del rol, comprobar que no esté asignado a una persona
    const estado_rol = rol.dataValues.str_rol_estado;

    //Cambio de estado verificando en la base de datos
    if (estado_rol === "ACTIVO") {
      await Roles.update(
        {
          str_rol_estado: "INACTIVO",
        },
        {
          where: {
            int_rol_id: rol_id,
          },
        }
      );
      return res.json({
        status: true,
        message: "Rol con estado INACTIVO",
      });
    } else {
      await Roles.update(
        {
          str_rol_estado: "ACTIVO",
        },
        {
          where: {
            int_rol_id: rol_id,
          },
        }
      );
      insertarAuditoria(
        rol,
        "tb_roles",
        "UPDATE",
        rol,
        req.ip,
        req.hearders.host,
        req,
        "Se ha actualizado un rol"
      )
      return res.json({
        status: true,
        message: "Rol con estado ACTIVO",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const insertarRol = async (req, res) => {
  let {  rol_nombre, rol_descripcion } = req.body;
  rol_nombre= rol_nombre.toUpperCase();
  rol_descripcion= rol_descripcion.toUpperCase();
  
  try {
    try {
      const rol = await Roles.create({
        str_rol_nombre: rol_nombre,
        str_rol_descripcion: rol_descripcion,
      });
      if (!rol || rol.lenght === 0) {
        return res.json({
          status: false,
          message: "Error al ingresar el rol",
        });
      } 
      insertarAuditoria(
        "Null",
        "tb_roles",
        "INSERT",
        rol,
        req.ip,
        req.hearders.host,
        req,
        "Se ha insertado un rol"
      )
      return res.json({
          status: true,
          message: "Rol ingresado correctamente",
      });

      
    } catch (error) {
      return res.json({
        status: false,
        message: "No se puede ingresar un rol con el mismo nombre",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

function validar(nombre, descripcion) {
  if (nombre === "" || descripcion === "") return 0;
  else return 1;
}

function validarRol(rol) {
  if (rol === "") return 0;
  else return 1;
}

export default {
  obtenerRoles,
  obtenerRol,
  actualizarRol,
  eliminarRol,
  insertarRol,
};
