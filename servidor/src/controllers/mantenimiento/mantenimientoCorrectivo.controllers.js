import { mantenimientoCorrectivo } from "../../models/mantenimiento/mantenimientoCorrectivo.js"
import { paginarDatos } from "../../utils/paginacion.utils.js";

const crearMantenimientoCorrectivo = async (req, res) => {
    try {
        const { 
            int_bien_id,
            str_correctivo_problema,
            str_correctivo_solucion,
            str_correctivo_telefono,
            int_correctivo_nivel_mantenimiento,
            str_correctivo_nivel_nombre,
            //str_correctivo_nombre_mantenimiento,
            str_correctivo_nombre_nivel_mantenimiento,
            str_correctivo_tecnico_responsable,
            str_correctivo_cedula_custodio,
            str_correctivo_nombre_custodio,
            dt_fecha_ingreso,
            dt_fecha_entrega
        } = req.body;
        console.log(req.body)
        const newmantenimientoCorrectivo = await mantenimientoCorrectivo.create({
            int_bien_id,
            str_correctivo_problema,
            str_correctivo_solucion,
            str_correctivo_telefono,
            int_correctivo_nivel_mantenimiento,
            //str_correctivo_nombre_mantenimiento,
            str_correctivo_nombre_nivel_mantenimiento: str_correctivo_nivel_nombre,
            str_correctivo_tecnico_responsable,
            str_correctivo_cedula_custodio,
            str_correctivo_nombre_custodio,
            dt_fecha_ingreso,
            dt_fecha_entrega
        });

        if(newmantenimientoCorrectivo) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento Correctivocreado correctamento",
                body: newmantenimientoCorrectivo
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error al crear el registro en mantenimiento Correctivo ${error}`,
            data: {},
        });
    }
};

const editarMantenimientoCorrectivo = async (req, res) => {
    try {
        const { str_correctivo_problema, str_correctivo_solucion, } = req.body;
        console.log(req.body)
        const { id } = req.params;
        const mantenimientoCorrectivoDB = await mantenimientoCorrectivo.findOne({
            where : { int_correctivo_id : id }
        });
        if(!mantenimientoCorrectivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        const mantenimientoCorrectivoUpdate = await mantenimientoCorrectivo.update(
            {
                str_correctivo_problema: str_correctivo_problema,
                str_correctivo_solucion: str_correctivo_solucion
            },
            {
                where : { int_correctivo_id : id }
            }
        );

        if(mantenimientoCorrectivoUpdate) {
            return res.json({
                status: true,
                message: "Registro de mantenimiento correctivo actualizado correctamente",
                body: mantenimientoCorrectivoUpdate
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el registro de mantenimiento correctivo ${error}`,
            data: {},
        });
    }
};

const eliminarMantenimientoCorrectivo = async (req, res) => {
    /*try {
        const { id } = req.params;
        console.log(id)
        const mantenimientoCorrectivoDB = await mantenimientoCorrectivo.findOne({
            where : { int_correctivo_id : id }
        });
        if(!mantenimientoCorrectivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento correctivo",
                body: {}
            });
        }

        let estado = "";
        if(mantenimientoCorrectivoDB.str_correctivo_estado === "ACTIVO") {
            estado = "INACTIVO";
        } else {
            estado = "ACTIVO";
        }

        const mantenimientoCorrectivoUpdate = await mantenimientoCorrectivo.update(
            {
                str_correctivo_estado: estado
            },
            {
                where : { int_correctivo_id : id }
            }
        );

        if(mantenimientoCorrectivoUpdate) {
            return res.json({
                status: true,
                message: "Estado del Registro de mantenimiento correctivo actualizado correctamente",
                body: mantenimientoCorrectivoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el registro de mantenimiento correctivo ${error}`,
            data: {},
        });
    }*/
};

const obtenerMantenimientosCorrectivos = async (req, res) => {
    try {
        const paginationData = req.query;
        console.log('ingreso a obtener mantenimientos prventivos')
        const mantenimientoCorrectivoDB = await mantenimientoCorrectivo.findAll(
            { limit: 5 }
        );
        if(mantenimientoCorrectivoDB.length === 0) {
            return res.json({
                status: false,
                message: "No existen registros de mantenimiento correctivos",
                body: {}
            });
        }

        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(
                1,
                10,
                mantenimientoCorrectivo,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Registro de bienes en mantenimiento correctivo obtenidos correctamente",
                body: datos,
                total: total
            })
        }

        const { datos, total } = await paginarDatos(
            paginationData.page,
            paginationData.size,
            mantenimientoCorrectivo,
            paginationData.parameter,
            paginationData.data
        );

        if(mantenimientoCorrectivoDB) {
            return res.json({
                status: true,
                message: "Registros de mantenimiento orrectivos obtenidos correctamente ",
                body: datos,
                total: total
            });
        }

        
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener los registros de mantenimiento correctivos${error}`,
            data: {},
        });
    }
};

const obtenerMantenimientoCorrectivoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const mantenimientoCorrectivoDB = await mantenimientoCorrectivo.findOne({
            where : { int_correctivo_id : id }
        });
        if(!mantenimientoCorrectivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento correctivo",
                body: {}
            });
        }
        return res.json({
            status: true,
            message: "Registro de mantenimiento correctivo encontrado correctamente",
            body: mantenimientoCorrectivoDB
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el registro de mantenimiento correctivo ${error}`,
            data: {}
        })
    }
};


export default {
    crearMantenimientoCorrectivo,
    editarMantenimientoCorrectivo,
    eliminarMantenimientoCorrectivo,
    obtenerMantenimientosCorrectivos,
    obtenerMantenimientoCorrectivoPorId
}