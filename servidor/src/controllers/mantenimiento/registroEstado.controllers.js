import { registroEstado } from "../../models/mantenimiento/registroEstado.models.js"

const crearRegistroEstadoMantenimiento = async (req, res) => {
    try {
        const {
            int_persona_id,
            int_estado_id,
            str_registroEstado_observacion
        } = req.body;

        const newRegistroEstadoMantenimiento = await registroEstado.create({
            int_persona_id,
            int_estado_id,
            str_registroEstado_observacion
        });
        if (newRegistroEstadoMantenimiento) {
            return res.json({
                status: true,
                message: "Registro de estado de mantenimiento creado correctamente",
                body: newEstadoMantenimiento
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el registro de estado en mantenimiento ${error}`,
            data: {}
        });
    }

};

const editarRegistroEstadoMantenimiento = async (req, res) => {
    try {
        const { str_registroEstado_observacion } = req.body;
        const { id } = req.param;
        const registroEstadoMantenimientoDB = await registroEstado.findOne({
            where: { int_registroEstado_id: id }
        });
        if (!registroEstadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de estado en mantenimiento",
                body: {},
            });
        }

        const registroEstadoMantenimientoUpdate = await registroEstado.update(
            {
                str_registroEstado_observacion: str_registroEstado_observacion
            },
            {
                whrere: { int_registroEstado_id: id }
            }
        );
        if (registroEstadoMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Registro de estado de mantenimiento actualizado correctamente",
                body: registroEstadoMantenimientoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el registro de estado de mantenimiento ${error}`,
            data: {}
        });
    }
};

const cambiarRegistroEstadoMantenimiento = async (req, res) => {
    try {
        const { id } = req.param;
        const registroEstadoMantenimientoDB = await registroEstado.findOne({
            whrer : { int_registroEstado_id: id }
        });
        if(!registroEstadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de estado de mantenimiento",
                body: {},
            })
        }
        let estado = "";    //Cambiar estado INACTIVO O ACTIVO
        if(registroEstadoMantenimientoDB.str_registroEstado_estado === "ACTIVO"){
            estado = "INACTIVO";
        } else {
            estado = "INACTIVO";
        }

        const registroEstadoMantenimientoUpdate = await registroEstado.update(
            {
                str_registroEstado_estado: estado
            },
            {
                whrere: { int_registroEstado_id: id }  
            }
        );
        if(registroEstadoMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Registro de estado de mantenimiento actualizado correctamente",
                body: registroEstadoMantenimientoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el registro de estado de mantenimiento ${error}`,
            data: {}
        })
    }
};

const obtenerRegistrosEstadoMantenimiento = async (req, res) => {
    try {
        const paginationData = req.query;
        const registroEstadoM = await registroEstado.findAll(
            { limit: 5 }
        );
        if(registroEstadoM.length === 0) {
            return res.json({
                status: false,
                message: "No se encontraron registros de estados de mantenimiento",
                body: {},
            });
        }

        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                registroEstado,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Registros de estados de mantenimiento encontrados",
                body: datos,
                total: total
            })
        }

        const { datos, total } = await paginarDatos(
            paginationData.page,
            paginationData.size,
            registroEstado,
            paginationData.parameter,
            paginationData.data
        );

        if(registroEstadoM) {
            return res.json({
                status: true,
                message: "Registros de estados de mantenimiento encontrados",
                body: datos,
                total: total
            })
        }

  
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener los registros de estados de mantenimiento ${error}`,
            data: {}
        })
    }
};

const obtenerRegistroEstadoMantenimientoPorId = async (req, res) => {
    try {
        const { int_registroEstado_id } =req.params;
        const { id } = req.params;
        const registroEstadoMantenimientoDB = await registroEstado.findOne({
            where: { int_registroEstado_id: id}
        });

        if(!registroEstadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de estado de mantenimiento",
                data: {},
            })  
        }

        return res.json({
            status: true,
            message: "Registro de estado de mantenimiento obtenido correctamente",
            body: estadoMantenimientoDB
        })

    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el registro de estado de mantenimiento ${error}`,
            data: {}
        })       
    }
};

export default {
    crearRegistroEstadoMantenimiento,
    editarRegistroEstadoMantenimiento,
    cambiarRegistroEstadoMantenimiento,
    obtenerRegistrosEstadoMantenimiento,
    obtenerRegistroEstadoMantenimientoPorId
}



