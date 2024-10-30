import { TipoMantenimiento } from "../../models/mantenimiento/tipoMantenimiento.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
const crearTipoMantenimiento = async (req, res) => {
  try {
    const { descripcion,nombre } = req.body;
    //mayusculas
    const descripcionM = descripcion.toUpperCase();
    const nombreM = nombre.toUpperCase();
    //comprobar si existe el tipo de mantenimiento
    const tipoMantenimientoDB = await TipoMantenimiento.findOne({
      where: { str_tipo_mantenimiento_nombre: nombreM },
    });
    if (tipoMantenimientoDB) {
      return res.json({
        status: false,
        message: "Ya existe el tipo de mantenimiento",
        body: {},
      });
    }
    //crear el tipo de mantenimiento
    const newTipoMantenimiento = await TipoMantenimiento.create({
      str_tipo_mantenimiento_descripcion: descripcionM,
      str_tipo_mantenimiento_nombre: nombreM,
    });
    if (newTipoMantenimiento) {
      insertarAuditoria(
        "Null",
        "tb_tipo_mantenimiento",
        "INSERT",
        newTipoMantenimiento,
        req.ip,
        req.headers.host,
        req,
        "Se ha creado un nuevo tipo de mantenimiento"
      );
      return res.json({
        status: true,
        message: "Tipo de mantenimiento creado correctamente",
        body: newTipoMantenimiento,
      });
    }
  } catch (error) {
    
    return res.status(500).json({
      message: `Error al crear el tipo de mantenimiento ${error}`,
      data: {},
    });
  }
};

const obtenerTipoMantenimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    //comprobar si existe el tipo de mantenimiento
    const tipoMantenimiento = await TipoMantenimiento.findOne({
      where: { int_tipo_mantenimiento_id: id },
    });
    if (!tipoMantenimiento) {
      return res.json({
        status: false,
        message: "No existe el tipo de mantenimiento",
        body: {},
      });
    }
    return res.json({
      status: true,
      message: "Tipo de mantenimiento encontrado",
      body: tipoMantenimiento,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: `Error al obtener el tipo de mantenimiento ${error}`,
      data: {},
    });
  }
};

const actualizarTipoMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;

    //comprobar si existe el tipo de mantenimiento
    const tipoMantenimientoDB = await TipoMantenimiento.findOne({
      where: { int_tipo_mantenimiento_id: id },
    });
    if (!tipoMantenimientoDB) {
      return res.json({
        status: false,
        message: "No existe el tipo de mantenimiento",
        body: {},
      });
    }
    //actualizar el tipo de mantenimiento
    const tipoMantenimiento = await TipoMantenimiento.update(
      {
        str_tipo_mantenimiento_descripcion: descripcion,
        dt_fecha_actualizacion: new Date(),

      },
      {
        where: { int_tipo_mantenimiento_id: id },
      }
    );
    if (tipoMantenimiento) {
      const nuevo = await TipoMantenimiento.findOne({
        where: { int_tipo_mantenimiento_id: id },
      });
      insertarAuditoria(
        tipoMantenimientoDB,
        "tb_tipo_mantenimiento",
        "UPDATE",
        nuevo,
        req.ip,
        req.headers.host,
        req,
        "Se ha actualizado un tipo de mantenimiento"
      );
      return res.json({
        status: true,
        message: "Tipo de mantenimiento actualizado correctamente",
        body: tipoMantenimiento,
      });
    }
  } catch (error) {
    
    return res.status(500).json({
      message: `Error al actualizar el tipo de mantenimiento ${error}`,
      data: {},
    });
  }
};

const cambiarEstadoTipoMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    //comprobar si existe el tipo de mantenimiento
    const tipoMantenimientoDB = await TipoMantenimiento.findOne({
      where: { int_tipo_mantenimiento_id: id },
    });
    if (!tipoMantenimientoDB) {
      return res.json({
        status: false,
        message: "No existe el tipo de mantenimiento",
        body: {},
      });
    }
    //cambiar estado
    let estado = "";
    if (tipoMantenimientoDB.str_tipo_mantenimiento_estado === "ACTIVO") {
      estado = "INACTIVO";
    } else {
      estado = "ACTIVO";
    }
    const tipoMantenimientoEstado = await TipoMantenimiento.update(
      {
        str_tipo_mantenimiento_estado: estado,
      },
      {
        where: { int_tipo_mantenimiento_id: id },
      }
    );

    return res.json({
      status: true,
      message: "Tipo de mantenimiento actualizado correctamente",
      body: tipoMantenimientoEstado,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: `Error al cambiar el estado del tipo de mantenimiento ${error}`,
      data: {},
    });
  }
};

const obtenerTiposMantenimiento = async (req, res) => {
  try {
    const paginationData = req.query;
    
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(
        1,
        10,
        TipoMantenimiento,
        "",
        ""
      );
      //llamo a la funcion para hallar el nombre del soporte
        
      return res.json({
        status: true,
        message: "Tipos de mantenimiento encontrados",
        body: datos,
        total: total,
      });
    }
    const tiposMantenimiento = await TipoMantenimiento.findAll({ limit: 5 });

    if (tiposMantenimiento.length === 0 || !tiposMantenimiento) {
      return res.json({
        status: false,
        message: "No existen tipos de mantenimiento",
        body: {},
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        TipoMantenimiento,
        paginationData.parameter,
        paginationData.data
      );

      //llamo a la funcion para hallar el nombre del soporte
      return res.json({
        status: true,
        message: "Tipos de mantenimiento encontrados",
        body: datos,
        total: total,
      });
    }
  } catch (error) {
    
    return res.status(500).json({
      message: `Error al obtener los tipos de mantenimiento ${error}`,
      data: {},
    });
  }
};


export default {
  crearTipoMantenimiento,
  obtenerTipoMantenimientoPorId,
  actualizarTipoMantenimiento,
  cambiarEstadoTipoMantenimiento,
  obtenerTiposMantenimiento,
};
