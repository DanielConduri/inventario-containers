import { registroBien } from "../../models/mantenimiento/registroBien.models.js"

const crearRegistroBienMantenimiento = async (req, res) => {
    try {
        const {
            int_bien_id,
            int_registro_id,
            str_registroBien_motivo,
        } = req.body;


        const newRegistroBienM = await registroBien.create({
            int_bien_id,
            int_registro_id,
            str_registroBien_motivo
        });

        if (newRegistroBienM) {
            return res.json({
                status: true,
                message: "Registro del bien para mantenimiento creado correctamente",
                body: newRegistroBienM
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el registro del bien en mantenimiento ${error}`,
            data: {},
        });
    }
};

const editarRegistroBienMantenimiento = async (req, res) => {
    try {
        const { int_registroBien_id, str_registroBien_motivo } = req.body;
        const { id } = req.param;
        const registroBienMantenimientoDB = await registroBien.findOne({
            where: { int_registroBien_id: id }
        });
        if (!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro del bien en mantenimiento",
                body: {}
            });
        }
        const registroBienMantenimientoUpdate = await registroBien.update(
            {
                str_registroBien_motivo: str_registroBien_motivo
            },
            {
                where: { int_registroBien_id: id }
            }
        );
        if (registroBienMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Registro del bien en mantenimiento actualizado correctamente",
                body: registroBienMantenimientoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el registro del bien en mantenimiento ${error}`,
            data: {},
        });
    }
};

const cambiarRegistrobienMantenimiento = async (req, res) => {
    try {
        
        const { id } = req.param;
        const registroBienMantenimientoDB = await registroBien.findOne({
            where: { int_registroBien_id: id }
        });
        if (!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro del bien en mantenimiento",
                body: {}
            });
        }

        let estado = "";
        if(registroBienMantenimientoDB.str_registroBien_estado === "ACTIVO"){
            estado = "INACTIVO"; 
        } else {
            estado = "ACTIVO"; 
        }

        const registroBienMantenimientoUpdate = await registroBien.update(
            {
                str_registroBien_estado: estado
            },
            {
                where: {int_registroBien_id: id}
            }
        )

        if(registroBienMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Estado de registro del bien en mantenimiento actualizado correctamente",
                body: registroBienMantenimientoUpdate
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el registro del bien en mantenimiento ${error}`,
            data: {},
          });
    }
};

const obtenerRegistrosBienMantenimiento = async (req, res) => {
    try {
        const paginationData = req.query;
        const registrosBienMantenimiento = await registroBien.findAll(
            { limit: 5 }
        );
        if(registrosBienMantenimiento.length === 0) {
            return res.json({
                status: false,
                message: "No se encontraron Registro de bienes en mantenimiento",
                body: {}
            });    
        }

        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                registroBien,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Registro de bienes en mantenimiento obtenidos",
                body: datos,
                total: total
            })
        }

        const { datos, total } = await paginarDatos(
            paginationData.page,
            paginationData.size,
            registroBien,
            paginationData.parameter,
            paginationData.data
        );

        if(registrosBienMantenimiento) {
            return res.json({
                status: true,
                message: "Registro de bienes en mantenimiento obtenidos",
                body: datos,
                total: total
            });
        }
        
     
        
    } catch (error) {
        return res.status(500).json({
            message:`Error al obtener los registros de bienes en mantenimiento ${error}`,
            data:{}
        })
    }
};

const obtenerRegistroBienMantenimientoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registroBienMantenimientoDB = await registroBien.findOne({
            where: {int_registroBien_id: id }
        });
        if(!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el Registro de biene en mantenimiento",
                body: {}
            });
        }
        return res.json({
            status: true,
            message: "Registro de bien en mantenimiento obtenido correctamente",
            body: registroBienMantenimientoDB
        });
    } catch (error) {
        return res.status(500).json({
            message:`Error al obtener el registro de bien en mantenimiento ${error}`,
            data:{}
        })
    }
};

export default {
    crearRegistroBienMantenimiento,
    editarRegistroBienMantenimiento,
    cambiarRegistrobienMantenimiento,
    obtenerRegistrosBienMantenimiento,
    obtenerRegistroBienMantenimientoPorId
}

