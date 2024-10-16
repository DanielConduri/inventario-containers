import { Planificacion } from "../../models/mantenimiento/planificacion.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";

const crearPlanificacion = async (req, res) => {
    try{
        const { fechaInicio, fechaFin, ubicacionId, } = req.body;
        //comprobar si existe la planificacion por fechas y ubicacion 
        const planificacionDB = await Planificacion.findOne({
            where:{dt_fecha_inicio: fechaInicio, dt_fecha_fin: fechaFin, int_ubicacion_id: ubicacionId},
        });
        if(planificacionDB){
            return res.json({
                status: false,
                message: "Ya existe la planificacion",
                body: {}
            })
        }
        //crear la planificacion
        const newPlanificacion = await Planificacion.create({
            dt_fecha_inicio: fechaInicio,
            dt_fecha_fin: fechaFin,
            int_ubicacion_id: ubicacionId
        });
        if(newPlanificacion){
            return res.json({
                status: true,
                message: "Planificacion creada correctamente",
                body: newPlanificacion
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: `Error al crear la planificacion ${error}`,
            data: {}
        })
    }
}

const obtenerPlanificacionPorId = async (req, res) => {
    try{
        const {id} = req.params;

        const planificacion = await Planificacion.findOne({
            where:{int_planificacion_id: id},
        });
        //comprobar si existe la planificacion
        if(!planificacion){
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        return res.json({
            status: true,
            message: "Planificacion encontrada",
            body: planificacion
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener la planificacion ${error}`,
            data: {}
        })
    }
}

const obtenerPlanificaciones = async (req, res) => {
    try{
        const paginationData = req.query;
        //comprobar si existnen
        const planificaciones = await Planificacion.findAll(
            {limit:5}
        );
        if(planificaciones.length === 0){
            return res.json({
                status: false,
                message: "No existen planificaciones",
                body: {}
            })
        }

        if(paginationData.page === "undefined"){
            const {datos, total} = await paginarDatos(
                1,
                10,
                Planificacion,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Planificaciones encontradas",
                body: datos,
                total: total
            })
        }
        const {datos, total} = await paginarDatos(
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
            total: total
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener las planificaciones ${error}`,
            data: {}
        })
    }
}

const actualizarPlanificacion = async (req, res) => {
    try{
        const {id} = req.params;
        const {fechaInicio, fechaFin, ubicacionId} = req.body;
        //comprobar si existe la planificacion
        const planificacionDB = await Planificacion.findOne({
            where:{int_planificacion_id: id},
        });
        if(!planificacionDB){
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        //actualizar la planificacion
        const planificacion = await Planificacion.update({
            dt_fecha_inicio: fechaInicio,
            dt_fecha_fin: fechaFin,
            int_ubicacion_id: ubicacionId
        },{
            where:{int_planificacion_id: id}
        });
        if(planificacion){
            return res.json({
                status: true,
                message: "Planificacion actualizada correctamente",
                body: planificacion
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: `Error al actualizar la planificacion ${error}`,
            data: {}
        })
    }
}

const cambiarEstadoPlanificacion = async (req, res) => {
    try{
        const { id }= req.params;
        //comprobar si existe la planificacion
        const planificacionDB = await Planificacion.findOne({
            where:{int_planificacion_id: id},
        });
        if(!planificacionDB){
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        //cambiar estado de la planificacion
        let estado = "";
        if(planificacionDB.str_planificacion_estado === "ACTIVO"){
            estado = "INACTIVO";
        }
        if(planificacionDB.str_planificacion_estado === "INACTIVO"){
            estado = "ACTIVO";
        }
        const planificacion = await Planificacion.update({
            str_planificacion_estado: estado
        },{
            where:{int_planificacion_id: id}
        });
        if(planificacion){
            return res.json({
                status: true,
                message: "Estado de la planificacion actualizado correctamente",
                body: planificacion
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: `Error al cambiar el estado de la planificacion ${error}`,
            data: {}
        })
    }
}





export default {
    crearPlanificacion,
    obtenerPlanificacionPorId,
    obtenerPlanificaciones,
    actualizarPlanificacion,
    cambiarEstadoPlanificacion
}