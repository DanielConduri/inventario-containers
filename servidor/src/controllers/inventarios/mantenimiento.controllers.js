import { Mantenimiento } from '../../models/mantenimiento/mantenimiento.models.js';
import { paginarDatos } from '../../utils/paginacion.utils.js';


const crearBienMantenimiento = async (req, res) => {
    try {
        const {
            int_registroBien_id,
            int_nivelMantenimiento_id,
            int_mantenimiento_diagnostico
        } = req.body;

        const newBienMantenimiento = Mantenimiento.create({
            int_registroBien_id,
            int_nivelMantenimiento_id,
            int_mantenimiento_diagnostico
        });
        if (newBienMantenimiento) {
            return res.json({
                status: true,
                message: "Mantenimiento creado correctamente",
                body: newPlanificacionBien
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el mantenimiento ${error}`,
            data: {}
        })
    }
};

const editarBienMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            int_registroBien_id,
            int_nivelMantenimiento_id,
            int_mantenimiento_diagnostico
        } = req.body;
        const bienMantenimientoDB = await Mantenimiento.findOne({
            where: { int_mantenimiento_id: id }
        });
        if (!bienMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el mantenimiento",
                body: {}
            });
        }
        const bienMantenimientoUpdate = Mantenimiento.update(
            {
                int_registroBien_id,
                int_nivelMantenimiento_id,
                int_mantenimiento_diagnostico
            },
            {
                where: { int_mantenimiento_id: id }
            }
        );
        if (bienMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Mantenimiento actualizado correctamente",
                body: planificacionBien
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al actualizar Mantenimiento del bien ${error}`,
            data: {}
        })
    }
};

const cambiarBienMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const bienMantenimiento = await Mantenimiento.findOne({
            where: { int_mantenimiento_id: id }
        });
        if (!bienMantenimiento) {
            return res.json({
                status: false,
                message: "No existe el mantenimiento",
                body: {}
            })
        }
        let estado = "";
        if (bienMantenimiento.str_mantenimiento_estado === "ACTIVO") {
            estado = "INACTIVO";
        }
        else {
            estado = "ACTIVO";
        }
        const bienMantenimientoUpdate = await Mantenimiento.update(
            {
                str_mantenimiento_estado: estado
            },
            {
                where: { int_mantenimiento_id: id }
            }
        );
        return res.json({
            status: true,
            message: "Mantnimiento del bien actualizada correctamente",
            body: planificacionBienEstado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al cambiar el estado del mantenimiento ${error}`,
            data: {}
        })
    }
};

const obtenerBienesMantenimiento = async (req, res) => {
    try {

        const paginationData = req.query;
        if(paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                Mantenimiento,
                "",
                ""
            );
            return res.json({
                status: true,
                message:"Lista de mantenimientos",
                body: datos,
                total: total
            })
        }

        const mantenimiento = await Mantenimiento.findAll({
            limit: 5
        });
        if(mantenimiento.length === 0 || !mantenimiento) {
            return res.json({
                status: false,
                message: "No hay mantenimientos registrados",
                body: {}
            })
        } else {
            const { datos, total } = await paginarDatos(
                paginationData.page,
                paginationData.size,
                Mantenimiento,
                paginationData.parameter,
                paginationData.data
            );
            console.log('datos', datos)
            console.lof('total', total)
            return res.json({
                status: true,
                message: "Lista de mantenimiento",
                body: datos,
                total: total
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener los mantenimientos de bienes ${error}`,
            data: {}
        })
    }
};

const obtenerBienMantenimientoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const bienMantenimiento = await Mantenimiento.findOne({
            where: { int_mantenimiento_id: id }
        });
        if (!bienMantenimiento) {
            return res.json({
                status: false,
                message: "No existe el mantenimiento",
                body: {}
            })
        }
        return res.json({
            status: true,
            message: "Mantenimiento encontrado",
            body: planificacionBien
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener el mantenimiento del bien ${error}`,
            data: {}
        })
    }
};

export default {
    crearBienMantenimiento,
    editarBienMantenimiento,
    cambiarBienMantenimiento,
    obtenerBienesMantenimiento,
    obtenerBienMantenimientoPorId
}