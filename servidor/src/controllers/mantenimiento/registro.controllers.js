import { Registro } from "../../models/mantenimiento/registro.models.js"
import { paginarDatos } from "../../utils/paginacion.utils.js";

const crearRegistroMantenimiento = async (req, res) => {
    try {
        const { int_soporte_id } = req.body;
        const newRegistroM = await Registro.create({
            int_soporte_id
        });
        if (newRegistroM) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento creado correctamento",
                body: newRegistroM
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el registro en mantenimiento ${error}`,
            data: {},
        });
    }
};

const editarRegistroMantenimiento = async (req, res) => {
    try {
        const { int_soporte_id } = req.body;
        const { id } = req.param;
        const registroBienMantenimientoDB = await Registro.findOne({
            where: { int_registro_id: id }
        });
        if (!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro en mantenimiento",
                body: {}
            });
        }
        const registroBienMantenimientoUpdate = await Registro.update(
            {
                int_soporte_id: int_soporte_id
            },
            {
                where: { int_registro_id: id }
            }
        );
        if (registroBienMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento actualizado correctamente",
                body: registroBienMantenimientoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el registro de mantenimiento ${error}`,
            data: {},
        });
    }
};


const cambiarRegistroMantenimiento = async (req, res) => {
    try {

        const { id } = req.param;
        const registroBienMantenimientoDB = await Registro.findOne({
            where: { int_registro_id: id }
        });
        if (!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro en mantenimiento",
                body: {}
            });
        }

        let estado = "";
        if (registroBienMantenimientoDB.str_registro_estado === "ACTIVO") {
            estado = "INACTIVO";
        } else {
            estado = "ACTIVO";
        }

        const registroBienMantenimientoUpdate = await Registro.update(
            {
                str_registro_estado: estado
            },
            {
                where: { int_registro_id: id }
            }
        );

        if (registroBienMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Estado del registro de mantenimiento actualizado correctamente",
                body: registroBienMantenimientoUpdate
            });
        }


    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el registro de mantenimiento ${error}`,
            data: {},
        });
    }
};


const obtenerRegistrosMantenimiento = async (req, res) => {
    try {
        const paginationData = req.query;
        const registrosMantenimiento = await Registro.findAll(
            { limit: 5 }
        );
        if (registrosMantenimiento.length === 0) {
            return res.json({
                status: false,
                message: "No se encontraron Registros en mantenimiento",
                body: {}
            });
        }

        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                Registro,
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

        const { datos, total } = await paginarDatos(
            paginationData.page,
            paginationData.size,
            Registro,
            paginationData.parameter,
            paginationData.data
        );
        return res.json({
            status: true,
            message: "Registros de mantenimiento obtenidos correctamente",
            body: datos,
            total: total
        });



    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener los registros de mantenimiento ${error}`,
            data: {},
        });
    }
};


const obtenerRegistroMantenimientoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registroBienMantenimientoDB = await Registro.findOne({
            where: { int_registro_id: id }
        });
        if (!registroBienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el registro en mantenimiento",
                body: {}
            });
        }
        return res.json({
            status: true,
            message: "Registro de mantenimiento obtenido correctamente",
            body: registroBienMantenimientoDB
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el registro de mantenimiento ${error}`,
            data: {}
        })
    }
};

export default {
    crearRegistroMantenimiento,
    editarRegistroMantenimiento,
    cambiarRegistroMantenimiento,
    obtenerRegistrosMantenimiento,
    obtenerRegistroMantenimientoPorId
}

