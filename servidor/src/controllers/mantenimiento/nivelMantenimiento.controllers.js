import { nivelMantenimiento } from "../../models/mantenimiento/nivelMantenimiento.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
const crearNivelMantenimiento = async (req, res) => {
  try {
    const { descripcion, idTipoMantenimiento } = req.body;
    //poner a mayusculas la descripcion
    const descripcionM = descripcion.toUpperCase();
    //comprobar si existe el nivel de mantenimiento
    const nivelMantenimientoDB = await nivelMantenimiento.findOne({
        where: { str_nivelMantenimiento_descripcion: descripcionM },
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
      str_nivelMantenimiento_descripcion: descripcionM,
      int_tipoMantenimiento_id: idTipoMantenimiento,
    });
    if (newNivelMantenimiento) {
      return res.json({
        status: true,
        message: "Nivel de mantenimiento creado correctamente",
        body: newNivelMantenimiento,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error al crear el nivel de mantenimiento ${error}`,
      data: {},
    });
  }
};

const editarNivelMantenimiento = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const { id } = req.params;
    const descripcionM = descripcion.toUpperCase();
    const nivelMantenimientoDB = await nivelMantenimiento.findOne({
      where: { int_nivelMantenimiento_id: id },
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
        str_nivelMantenimiento_descripcion: descripcionM,
      },
      {
        where: { int_nivelMantenimiento_id: id },
      }
    );
    if (nivelMantenimientoUpdate) {
      return res.json({
        status: true,
        message: "Nivel de mantenimiento actualizado correctamente",
        body: nivelMantenimientoUpdate,
      });
    }
  } catch (error) {
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
      where: { int_nivelMantenimiento_id: id },
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
    if (nivelMantenimientoDB.str_nivelMantenimiento_estado === "ACTIVO") {
      estado = "INACTIVO";
    } else {
      estado = "ACTIVO";
    }
    const nivelMantenimientoUpdate = await nivelMantenimiento.update(
      {
        str_nivelMantenimiento_estado: estado,
      },
      {
        where: { int_nivelMantenimiento_id: id },
      }
    );
    if (nivelMantenimientoUpdate) {
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

const obtenerNivelesMantenimiento = async (req, res) => {
    try{

        const paginationData = req.query;

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
            body: datos,
            total: total,
          });
        }

        const nivelesMantenimiento = await nivelMantenimiento.findAll({
            limit: 5,
        });
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
            console.log(total)
            return res.json({
                status:true,
                message:"Niveles de mantenimiento encontrados",
                body:datos,
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
        const nivelMantenimientoDB = await nivelMantenimiento.findOne({
            where: { int_nivelMantenimiento_id: id }
        });
        if(!nivelMantenimientoDB){
            return res.json({
                status: false,
                message: "No existe el nivel de mantenimiento",
                body: {}
            })
        }
        return res.json({
            status: true,
            message: "Nivel de mantenimiento",
            body: nivelMantenimientoDB
        })

    }catch(error){
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
