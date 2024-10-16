import { sequelize } from "../../database/database.js";
import { mantenimientoPreventivo } from "../../models/mantenimiento/mantenimientoPreventivo.js"
import { paginarDatos } from "../../utils/paginacion.utils.js";

const crearMantenimientoPreventivo = async (req, res) => {
    try {
        
        const { 
            int_bien_id,
            str_preventivo_tipo,
            str_preventivo_descripcion,
            str_preventivo_centro,
            str_preventivo_tecnico_responsable,
            dt_fecha_mantenimiento,
         } = req.body;
         console.log(req.body);
        const newmantenimientoPreventivo = await mantenimientoPreventivo.create({
            int_bien_id,
            str_preventivo_tipo,
            str_preventivo_descripcion,
            str_preventivo_centro,
            str_preventivo_tecnico_responsable,
            dt_fecha_mantenimiento,

        });

        if(newmantenimientoPreventivo) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento Preventivo creado correctamento",
                body: newmantenimientoPreventivo
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al crear el registro en mantenimiento preventivo${error}`,
            data: {},
        });
    }
};

const editarMantenimientoPreventivo = async (req, res) => {
    try {
        const { str_preventivo_descripcion } = req.body;
        const { id } = req.params;
        const mantenimientoPreventivoDB = await mantenimientoPreventivo.findOne({
            where : { int_preventivo_id : id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        const mantenimientoPreventivoUpdate = await mantenimientoPreventivo.update(
            {
                str_preventivo_descripcion: str_preventivo_descripcion
            },
            {
                where : { int_preventivo_id : id }
            }
        );
       
        if(mantenimientoPreventivoUpdate) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento preventivo actualizado correctamente",
                body: mantenimientoPreventivoUpdate
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el registro de mantenimiento preventivo ${error}`,
            data: {},
        });
    }
};

const eliminarMantenimientoPreventivo = async (req, res) => {
    /*try {
        const { id } = req.params;
        const mantenimientoPreventivoDB = await mantenimientoPreventivo.findOne({
            where : { int_preventivo_id : id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        let estado = "";
        if(mantenimientoPreventivoDB.str_preventivo_estado === "ACTIVO") {
            estado = "INACTIVO";
        } else {
            estado = "ACTIVO";
        }

        const mantenimientoPreventivoUpdate = await mantenimientoPreventivo.update(
            {
                str_preventivo_estado: estado
            },
            {
                where : { int_preventivo_id : id }
            }
        );

        if(mantenimientoPreventivoUpdate) {
            return res.json({
                status: true,
                message: "Estado del Registro de mantenimiento preventivo actualizado correctamente",
                body: mantenimientoPreventivoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el registro de mantenimiento preventivo ${error}`,
            data: {},
        });
    }*/
};

const obtenerMantenimientosPreventivos = async (req, res) => {
    try {
        console.log('ingreso a obtener mantenimientos prventivos')
        
        const paginationData = req.query;
        const mantenimientoPreventivoDB = await mantenimientoPreventivo.findAll(
            { limit: 5 }
        );
        if(mantenimientoPreventivoDB.length === 0) {
            return res.json({
                status: false,
                message: "No existen registros de mantenimiento preventivos",
                body: {}
            });
        }

        if(paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                mantenimientoPreventivo,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Registro de bienes de mantenimiento preventivo obtenidos correctamente",
                body: datos,
                total: total
            })
        }

        const { datos, total } = await paginarDatos(
            paginationData.page,
            paginationData.size,
            mantenimientoPreventivo,
            paginationData.parameter,
            paginationData.data
        );

        if(mantenimientoPreventivoDB) {
            return res.json({
                status: true,
                message: "Registro de bienes de mantenimiento preventivo obtenidos correctamente",
                body: datos,
                total: total
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener los registros de mantenimiento preventivo${error}`,
            data: {},
        });
    }
};

const obtenerMantenimientoPreventivoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const mantenimientoPreventivoDB = await mantenimientoPreventivo.findOne({
            where : { int_preventivo_id : id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }
        return res.json({
            status: true,
            message: "Registro de mantenimiento preventivo encontrado correctamente",
            body: mantenimientoPreventivoDB
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el registro de mantenimiento preventivo ${error}`,
            data: {}
        })
    }
};


export default {
    crearMantenimientoPreventivo,
    editarMantenimientoPreventivo,
    eliminarMantenimientoPreventivo,
    obtenerMantenimientosPreventivos,
    obtenerMantenimientoPreventivoPorId
}