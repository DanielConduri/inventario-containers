import { PlanificacionBien } from "../../models/mantenimiento/planificacionBien.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";

const crearPlanificacionBien = async (req, res) => {
    try {
        const { codigosBienes, idPlanificacion } = req.body;

        //codigoBienes es un array de codigos de bienes string
        //idPlanificacion es el id de la planificacion
       
        //creamos los registros en la tabla tb_planificacion_bien
        codigosBienes.forEach(async (codigoBien) => {
            const planificacionBien = await PlanificacionBien.create({
                str_codigo_bien: codigoBien,
                int_planificacion_id: idPlanificacion
            });
        });
        
        return res.json({
            status: true,
            message: "Planificación creada correctamente",
            body: {}
        }) 
    } catch (error) {
        
        return res.status(500).json({
            message: `Error al crear la planificacion ${error}`,
            data: {}
        })
    }
}

const obtenerPlanificacionBienPorId = async (req, res) => {
    try {
        const { id } = req.params;

        //comprobar si existe la planificacion
        const planificacionBien = await PlanificacionBien.findAll({
            where: { int_planificacion_bien_id: id },
        });
        
        if (!planificacionBien) {
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        return res.json({
            status: true,
            message: "Planificacion encontrada",
            body: planificacionBien
        })
    } catch (error) {
        
        return res.status(500).json({
            message: `Error al obtener la planificacion ${error}`,
            data: {}
        })
    }
}

const obtenerPlanificacionesBien = async (req, res) => {
    try {
        const paginationData = req.query;
        const planificacionesBien = await PlanificacionBien.findAll({limit:5});
        if (!planificacionesBien) {
            return res.json({
                status: false,
                message: "No existen planificaciones",
                body: {}
            })
        }

        if(paginationData.page ==="undefined"){
            const {datos, total} = await paginarDatos(
                1,
                10,
                PlanificacionBien,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Lista de planificaciones",
                body: datos,
                total: total
            })
        }
        const {datos, total} = await paginarDatos(
            paginationData.page,
            paginationData.size,
            PlanificacionBien,
            paginationData.parameter,
            paginationData.data
        );
        return res.json({
            status: true,
            message: "Planificaciones encontradas",
            body: datos,
            total: total
        })
    } catch (error) {
        
        return res.status(500).json({
            message: `Error al obtener las planificaciones ${error}`,
            data: {}
        })
    }
}

const cambiarEstadoPlanificacionBien = async (req, res) => {
    try {
        const { id } = req.params;

        const planificacionBien = await PlanificacionBien.findOne({
            where: { int_planificacion_bien_id: id },
        });
        //comprobar si existe la planificacion
        if (!planificacionBien) {
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        //cambiar estado
        let estado = "";
        if (planificacionBien.str_planificacion_bien_estado === "ACTIVO") {
            estado = "INACTIVO";
        }
        else {
            estado = "ACTIVO";
        }
        const planificacionBienEstado = await PlanificacionBien.update({
            str_planificacionBien_estado: estado
        }, {
            where: { int_planificacionBien_id: id },
        });

        return res.json({
            status: true,
            message: "Planificacion actualizada correctamente",
            body: planificacionBienEstado
        })

    } catch (error) {
        
        return res.status(500).json({
            message: `Error al cambiar el estado de la planificacion ${error}`,
            data: {}
        })
    }
}

const actualizarPlanificacionBien = async (req, res) => {
    try {
        const { id } = req.params;

        const planificacionBien = await PlanificacionBien.findOne({
            where: { int_planificacion_bien_id: id },
        });
        //comprobar si existe la planificacion
        if (!planificacionBien) {
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        //actualizar datos
        const { codigosBienes, idPlanificacion } = req.body;
        //codigoBienes es un array de codigos de bienes string
        
        //actualizamos todos los registros con el id de la planificacion
        const planificacionBienUpdate = await PlanificacionBien.update({
            str_codigo_bien: codigosBienes,
            int_planificacion_id: idPlanificacion
        }, {
            where: { int_planificacion_bien_id: id },
        });

        return res.json({
            status: true,
            message: "Planificacion actualizada correctamente",
            body: planificacionBienUpdate
        })


    } catch (error) {
       
        return res.status(500).json({
            message: `Error al actualizar la planificacion ${error}`,
            data: {}
        })
    }
}

export default {
    crearPlanificacionBien,
    obtenerPlanificacionBienPorId,
    obtenerPlanificacionesBien,
    cambiarEstadoPlanificacionBien,
    actualizarPlanificacionBien
}

