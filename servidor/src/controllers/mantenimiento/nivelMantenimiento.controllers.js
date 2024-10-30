import { sequelize } from "../../database/database.js";
import { nivelMantenimiento } from "../../models/mantenimiento/nivelMantenimiento.models.js";
import { Soporte } from "../../models/mantenimiento/soporte.models.js";
import { TipoMantenimiento } from "../../models/mantenimiento/tipoMantenimiento.models.js"
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
const crearNivelMantenimiento = async (req, res) => {
  try {
    const { descripcion, idTipoMantenimiento, idSoporte } = req.body;
   
    //poner a mayusculas la descripcion
    const descripcionM = descripcion.toUpperCase(); 
    //comprobar si existe el nivel de mantenimiento
    const nivelMantenimientoDB = await nivelMantenimiento.findOne({
        where: { str_nivel_mantenimiento_descripcion: descripcionM },
    });
    if (nivelMantenimientoDB) {
      return res.json({
        status: false,
        message: "Ya existe el nivel de mantenimiento",
        body: {},
      });
    }
    //crear el nivel de mantenimiento
    const newNivelMantenimiento = await nivelMantenimiento.create({
      str_nivel_mantenimiento_descripcion: descripcionM,
      int_tipo_mantenimiento_id: idTipoMantenimiento,
      int_soporte_id: idSoporte
    });
    if (newNivelMantenimiento) {
      insertarAuditoria(
        "Null",
        "tb_nivel_mantenimiento",
        "INSERT",
        newNivelMantenimiento,
        req.ip,
        req.headers.host,
        req,
        "Se ha creado un nuevo nivel de mantenimiento"
      )
      return res.json({
        status: true,
        message: "Nivel de mantenimiento creado correctamente",
        body: newNivelMantenimiento,
      });
    }
  } catch (error) {
   
    return res.status(500).json({
      message: `Error al crear el nivel de mantenimiento ${error}`,
      data: {},
    });
  }
};

const editarNivelMantenimiento = async (req, res) => {
  try {
    const { descripcion, idTipoMantenimiento, idSoporte } = req.body;
    const { id } = req.params;
    const descripcionM = descripcion.toUpperCase();
    const nivelMantenimientoDB = await nivelMantenimiento.findOne({
      where: { int_nivel_mantenimiento_id: id },
    });
    if (!nivelMantenimientoDB) {
      return res.json({
        status: false,
        message: "No existe el nivel de mantenimiento",
        body: {},
      });
    }
    const nivelMantenimientoUpdate = await nivelMantenimiento.update(
      {
        str_nivel_mantenimiento_descripcion: descripcionM,
        int_tipo_mantenimiento_id: idTipoMantenimiento,
        int_soporte_id: idSoporte,
        dt_fecha_actualizacion: new Date(),
        
      },
      {
        where: { int_nivel_mantenimiento_id: id },
      }
      );
      // console.log('hasta aqui llega ', req.body, '---', req.params)
    if (nivelMantenimientoUpdate) {
      const nuevo = await nivelMantenimiento.findOne({
        where: { int_nivel_mantenimiento_id: id },
      });
      insertarAuditoria(
        nivelMantenimientoDB,
        "tb_nivel_mantenimiento",
        "UPDATE",
        nuevo,
        req.ip,
        req.headers.host,
        req,
        "Se ha editado un nivel de mantenimiento"
      )
      return res.json({
        status: true,
        message: "Nivel de mantenimiento actualizado correctamente",
        body: nivelMantenimientoUpdate,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Error al editar el nivel de mantenimiento ${error}`,
      data: {},
    });
  }
};

const cambiarEstadoNivelMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const nivelMantenimientoDB = await nivelMantenimiento.findOne({
      where: { int_nivel_mantenimiento_id: id },
    });
    if (!nivelMantenimientoDB) {
      return res.json({
        status: false,
        message: "No existe el nivel de mantenimiento",
        body: {},
      });
    }
    //cambiar estado INACTIVO O ACTIVO
    let estado = "";
    if (nivelMantenimientoDB.str_nivel_mantenimiento_estado === "ACTIVO") {
      estado = "INACTIVO";
    } else {
      estado = "ACTIVO";
    }
    const nivelMantenimientoUpdate = await nivelMantenimiento.update(
      {
        str_nivel_mantenimiento_estado: estado,
      },
      {
        where: { int_nivel_mantenimiento_id: id },
      }
    );
    if (nivelMantenimientoUpdate) {
      const nuevo = await nivelMantenimiento.findOne({
        where: { int_nivel_mantenimiento_id: id },
      });
      insertarAuditoria(
        nivelMantenimientoDB,
        "tb_nivel_mantenimiento",
        "UPDATE",
        nuevo,
        req.ip,
        req.headers.host,
        req,
        "Se ha cambiado el estado de un nivel de mantenimiento"
      )
      return res.json({
        status: true,
        message: "Nivel de mantenimiento actualizado correctamente",
        body: nivelMantenimientoUpdate,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error al eliminar el nivel de mantenimiento ${error}`,
      data: {},
    });
  }
};




async function datosPaginacion(datos) {
  const array = [];
  try {
    for (let nivelM of datos) {
      const planificacion = await sequelize.query(
        `SELECT
        nm.int_nivel_mantenimiento_id,
        nm.str_nivel_mantenimiento_descripcion,
        nm.str_nivel_mantenimiento_estado,
        nm.int_tipo_mantenimiento_id,
        tm.str_tipo_mantenimiento_descripcion,
        nm.dt_fecha_creacion
        FROM mantenimiento.tb_nivel_mantenimiento nm
        INNER JOIN mantenimiento.tb_tipo_mantenimiento tm
        ON nm.int_tipo_mantenimiento_id = tm.int_tipo_mantenimiento_id`
        ,
        { type: QueryTypes.SELECT }
      );
      array.push(planificacion);
    }
    return array;
  } catch (error) {
    
  }
}

const obtenerNivelesMantenimiento = async (req, res) => {
    try{

        const paginationData = req.query;
        const nivelesMantenimiento = await sequelize.query(
          `SELECT
          nm.int_nivel_mantenimiento_id,
          nm.str_nivel_mantenimiento_descripcion,
          nm.str_nivel_mantenimiento_estado,
          nm.int_tipo_mantenimiento_id,
          tm.str_tipo_mantenimiento_descripcion,
          sp.int_soporte_id,
          sp.str_soporte_nombre,
          nm.dt_fecha_creacion
          FROM mantenimiento.tb_nivel_mantenimiento nm
          INNER JOIN mantenimiento.tb_tipo_mantenimiento tm
          ON nm.int_tipo_mantenimiento_id = tm.int_tipo_mantenimiento_id
          INNER JOIN mantenimiento.tb_soporte sp 
		      ON nm.int_soporte_id = sp.int_soporte_id`
          /*,
          { type: QueryTypes.SELECT }*/
        );

        if(paginationData.page === "undefined"){
          const {datos, total} = await paginarDatos(
            1,
            10,
            nivelMantenimiento,
            "",
            ""
          );
          return res.json({
            status: true,
            message: "Niveles de mantenimiento encontrados",
            body: nivelesMantenimiento[0],
            total: total,
          });
        }
        // const nivelesMantenimiento = await nivelMantenimiento.findAll({
        //     limit: 5,
        // });
        if(!nivelesMantenimiento  || nivelesMantenimiento.length === 0){
            return res.json({
                status:false,
                message:"No se encontraron niveles de mantenimiento",
                body:{}
            })
        }else{
            const {datos, total} = await paginarDatos(
                paginationData.page,
                paginationData.size,
                nivelMantenimiento,
                paginationData.parameter,
                paginationData.data
            );
            
            return res.json({
                status:true,
                message:"Niveles de mantenimiento encontrados",
                body:nivelesMantenimiento[0],
                total:total
            })
        }
    }catch(error){
        return res.status(500).json({
            message:`Error al obtener los niveles de mantenimiento ${error}`,
            data:{}
        })
    }
}
const obtenerNivelMantenimientoPorId = async (req, res) => {
    try{
        const { id } = req.params;
        let nivelMantenimientoDB = await nivelMantenimiento.findOne({
            where: { int_nivel_mantenimiento_id: id }
        });

        if(!nivelMantenimientoDB){
            return res.json({
                status: false,
                message: "No existe el nivel de mantenimiento",
                body: {}
            })
        }

        const nombreSoporte = await Soporte.findOne({
          where: { int_soporte_id: nivelMantenimientoDB.int_soporte_id }
      });

        const nombreTipo = await TipoMantenimiento.findOne({
          where: {int_tipo_mantenimiento_id: nivelMantenimientoDB.int_tipo_mantenimiento_id}
        })

      // console.log(nombreSoporte.dataValues.str_soporte_nombre);
      nivelMantenimientoDB.dataValues.str_soporte_nombre = nombreSoporte.dataValues.str_soporte_nombre;
      nivelMantenimientoDB.dataValues.str_soporte_descripcion = nombreSoporte.dataValues.str_soporte_descripcion;
      nivelMantenimientoDB.dataValues.str_tipo_mantenimiento_nombre = nombreTipo.dataValues.str_tipo_mantenimiento_nombre
      // console.log('lo que sale ---->', nivelMantenimientoDB.dataValues.str_tipo_mantenimiento_nombre)

        return res.json({
            status: true,
            message: "Nivel de mantenimiento",
            body: nivelMantenimientoDB
        })
    }catch(error){
      console.log(error.message);
        return res.status(500).json({
            message:`Error al obtener el nivel de mantenimiento ${error}`,
            data:{}
        })
    }
}

export default {
  crearNivelMantenimiento,
  editarNivelMantenimiento,
  cambiarEstadoNivelMantenimiento,
  obtenerNivelesMantenimiento,
  obtenerNivelMantenimientoPorId,
};
