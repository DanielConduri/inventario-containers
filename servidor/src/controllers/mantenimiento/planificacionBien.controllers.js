import { PlanificacionBien } from "../../models/mantenimiento/planificacionBien.models.js";


const crearPlanificacionBien = async (req, res) => {
    try {
        const { bienId, motivo, diagnostico, personaId } = req.body;
        //mayusculas
        const motivoM = motivo.toUpperCase();
        const diagnosticoM = diagnostico.toUpperCase();

        //comprobar si existe la planificacion por bienId, motivo, diagnostico y personaId
        const planificacionBienDB = await PlanificacionBien.findOne({
            where: { int_bien_id: bienId, str_planificacionBien_motivo: motivoM, str_planificacionBien_diagnostico: diagnosticoM, int_persona_id: personaId },
        });
        if (planificacionBienDB) {
            return res.json({
                status: false,
                message: "Ya existe la planificacion",
                body: {}
            })
        }
        //crear la planificacion
        const newPlanificacionBien = await PlanificacionBien.create({
            int_bien_id: bienId,
            str_planificacionBien_motivo: motivoM,
            str_planificacionBien_diagnostico: diagnosticoM,
            int_persona_id: personaId
        });
        if (newPlanificacionBien) {
            return res.json({
                status: true,
                message: "Planificacion creada correctamente",
                body: newPlanificacionBien
            })
        }
    } catch (error) {
        console.log(error);
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
        const planificacionBien = await PlanificacionBien.findOne({
            where: { int_planificacionBien_id: id },
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
        console.log(error);
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
        console.log(error);
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
            where: { int_planificacionBien_id: id },
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
        if (planificacionBien.str_planificacionBien_estado === "ACTIVO") {
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
        console.log(error);
        return res.status(500).json({
            message: `Error al cambiar el estado de la planificacion ${error}`,
            data: {}
        })
    }
}

const actualizarPlanificacionBien = async (req, res) => {
    try {
        const { id } = req.params;
        const { bienId, motivo, diagnostico, personaId } = req.body;
        //mayusculas
        const motivoM = motivo.toUpperCase();
        const diagnosticoM = diagnostico.toUpperCase();

        //comprobar si existe la planificacion
        const planificacionBienDB = await PlanificacionBien.findOne({
            where: { int_planificacionBien_id: id },
        });
        if (!planificacionBienDB) {
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            })
        }
        //actualizar la planificacion
        const planificacionBien = await PlanificacionBien.update({
            int_bien_id: bienId,
            str_planificacionBien_motivo: motivoM,
            str_planificacionBien_diagnostico: diagnosticoM,
            int_persona_id: personaId
        }, {
            where: { int_planificacionBien_id: id }
        });
        if (planificacionBien) {
            return res.json({
                status: true,
                message: "Planificacion actualizada correctamente",
                body: planificacionBien
            })
        }

    } catch (error) {
        console.log(error);
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

