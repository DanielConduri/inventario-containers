import { Planificacion } from "../../models/mantenimiento/planificacion.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { PlanificacionBien } from "../../models/mantenimiento/planificacionBien.models.js";
import { MantenimientoPreventivo } from "../../models/mantenimiento/mantenimientoPreventivo.models.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearPlanificacion = async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin,
      ubicacionId,
      nombreCentro,
      cantidadBienes,
      codigosBienes,
      int_nivel_mantenimiento_id,
      str_planificacion_estado,
    } = req.body;
    //comprobar si existe la planificacion por fechas y ubicacion
    const planificacionDB = await Planificacion.findOne({
      where: {
        dt_fecha_inicio: fechaInicio,
        dt_fecha_fin: fechaFin,
        int_ubicacion_id: ubicacionId,
        str_planificacion_centro: nombreCentro,
        str_planificacion_estado: str_planificacion_estado,
      },
    });
    if (planificacionDB) {
      return res.json({
        status: false,
        message: "Ya existe la planificacion",
        body: {},
      });
    }

    //crear el codigo de la planificacion de la forma: PLANIFICACION-AÑO-MES-DIA
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    const planificacionCodigo = `PLANIFICACION-${anio}-${mes}-${dia}`;
    //crear la planificacion
    const newPlanificacion = await Planificacion.create({
      dt_fecha_inicio: fechaInicio,
      dt_fecha_fin: fechaFin,
      int_ubicacion_id: ubicacionId,
      str_planificacion_centro: nombreCentro,
      str_planificacion_codigo: planificacionCodigo,
      int_planificacion_cantidad_bienes: cantidadBienes,
      str_planificacion_estado: str_planificacion_estado,
    });

    if (newPlanificacion) {
      //creamos en MantenimientoPreventivo con todos los codigosBienes
      codigosBienes.forEach(async (codigoBien) => {
        const newmantenimientoPreventivo = await MantenimientoPreventivo.create(
          {
            int_planificacion_id: newPlanificacion.int_planificacion_id,
            int_nivel_mantenimiento_id,
            str_codigo_bien: codigoBien,
          }
        );
      });
      insertarAuditoria(
        "Null",
        "tb_planificacion",
        "INSERT",
        newPlanificacion,
        req.ip,
        req.headers.host,
        req,
        "Se ha creado una nueva planificacion"
      )
      return res.json({
        status: true,
        message: "Planificacion creada correctamente",
        body: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error al crear la planificacion ${error}`,
      data: {},
    });
  }
};

const obtenerPlanificacionPorId = async (req, res) => {
  try {
    let bienesData = [];
    const { id } = req.params;
    
    let planificacion = await Planificacion.findOne({
      where: { int_planificacion_id: id },
    });
    //comprobar si existe la planificacion
    if (!planificacion) {
      return res.json({
        status: false,
        message: "No existe la planificacion",
        body: {},
      });
    }
    
    const bienes = await MantenimientoPreventivo.findAll({
      where: { int_planificacion_id: id },
    });
    
    for (const bien of bienes) {
      const bienData = await Bienes.findOne({
        where: { str_codigo_bien: bien.str_codigo_bien },
      });
      bienesData.push(bienData);
    }
    
    planificacion.dataValues.bienes = bienesData;
    // console.log('lo que llega ->', bienes)
    planificacion.dataValues.int_nivel_mantenimiento_id = bienes[0].int_nivel_mantenimiento_id;
    // console.log('lo que viene en res',planificacion)
    return res.json({
      status: true,
      message: "Planificacion encontrada",
      body: planificacion,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error al obtener la planificacion ${error}`,
      data: {},
    });
  }
};

const obtenerPlanificaciones = async (req, res) => {
  try {
    const paginationData = req.query;
    //comprobar si existnen
    const planificaciones = await Planificacion.findAll({ limit: 5 });
    if (planificaciones.length === 0) {
      return res.json({
        status: false,
        message: "No existen planificaciones",
        body: {},
      });
    }

    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Planificacion, "", "");
      return res.json({
        status: true,
        message: "Planificaciones encontradas",
        body: datos,
        total: total,
      });
    }
    const { datos, total } = await paginarDatos(
      paginationData.page,
      paginationData.size,
      Planificacion,
      paginationData.parameter,
      paginationData.data
    );

    return res.json({
      status: true,
      message: "Planificaciones encontradas",
      body: datos,
      total: total,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error al obtener las planificaciones ${error}`,
      data: {},
    });
  }
};

const actualizarPlanificacion = async (req, res) => {
  try {
    // console.log("Aqui elimina")
    const { id } = req.params;
    const {
      fechaInicio,
      fechaFin,
      ubicacionId,
      nombreCentro,
      cantidadBienes,
      codigosBienes,
      int_nivel_mantenimiento_id,
      str_planificacion_estado,
    } = req.body;


    //comprobar si existe la planificacion
    const planificacionDB = await Planificacion.findOne({
      where: { int_planificacion_id: id },
    });
    if (!planificacionDB) {
      return res.json({
        status: false,
        message: "No existe la planificacion",
        body: {},
      });
    }
    //actualizar la planificacion
    const planificacion = await Planificacion.update(
      {
        dt_fecha_inicio: fechaInicio,
        dt_fecha_fin: fechaFin,
        int_ubicacion_id: ubicacionId,
        str_planificacion_centro: nombreCentro,
        int_planificacion_cantidad_bienes: cantidadBienes,
        str_planificacion_estado: str_planificacion_estado,
        int_nivel_mantenimiento_id,
        dt_fecha_actualizacion: new Date(),
      },
      {
        where: { int_planificacion_id: id },
      }
    );

    //actualizar los bienes de la planificacion

    //borrar los bienes de la planificacion
    const bienes = await MantenimientoPreventivo.destroy({
      where: { int_planificacion_id: id },
    });

    //crear los nuevos bienes de la planificacion
    codigosBienes.forEach(async (codigoBien) => {
      const newmantenimientoPreventivo = await MantenimientoPreventivo.create({
        int_planificacion_id: id,
        int_nivel_mantenimiento_id: int_nivel_mantenimiento_id,
        str_codigo_bien: codigoBien,
        
      });
    });

    const nuevo = await Planificacion.findOne({
      where: { int_planificacion_id: id },
    });
    insertarAuditoria(
      planificacionDB,
      "tb_planificacion",
      "UPDATE",
      nuevo,
      req.ip,
      req.headers.host,
      req,
      "Se ha actualizado una planificación"
    )
    return res.json({
      status: true,
      message: "Planificacion actualizada correctamente",
      body: planificacion,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error al actualizar la planificacion ${error}`,
      data: {},
    });
  }
};

const cambiarEstadoPlanificacion = async (req, res) => {
  try {
    const { id } = req.params;
    //comprobar si existe la planificacion
    const planificacionDB = await Planificacion.findOne({
      where: { int_planificacion_id: id },
    });
    if (!planificacionDB) {
      return res.json({
        status: false,
        message: "No existe la planificacion",
        body: {},
      });
    }
    //cambiar estado de la planificacion
    let estado = "";
    if (planificacionDB.str_planificacion_estado === "ACTIVO") {
      estado = "INACTIVO";
    }
    if (planificacionDB.str_planificacion_estado === "INACTIVO") {
      estado = "ACTIVO";
    }
    const planificacion = await Planificacion.update(
      {
        str_planificacion_estado: estado,
      },
      {
        where: { int_planificacion_id: id },
      }
    );
    if (planificacion) {
      return res.json({
        status: true,
        message: "Estado de la planificacion actualizado correctamente",
        body: planificacion,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error al cambiar el estado de la planificacion ${error}`,
      data: {},
    });
  }
};

export default {
  crearPlanificacion,
  obtenerPlanificacionPorId,
  obtenerPlanificaciones,
  actualizarPlanificacion,
  cambiarEstadoPlanificacion,
};
