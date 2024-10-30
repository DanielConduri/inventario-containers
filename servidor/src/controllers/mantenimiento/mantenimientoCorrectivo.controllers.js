import { MantenimientoCorrectivo } from "../../models/mantenimiento/mantenimientoCorrectivo.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Bienes } from "../../models/inventario/bienes.models.js"
import { CustodiosBien } from "../../models/inventario/custodios_bienes.models.js"
import { Custodios } from "../../models/inventario/custodios.models.js"
import { nivelMantenimiento } from "../../models/mantenimiento/nivelMantenimiento.models.js"
import { EstadoMantenimiento } from "../../models/mantenimiento/estado.models.js"
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearMantenimientoCorrectivo = async (req, res) => {
    try {
        const {
            int_nivel_mantenimiento_id,
            int_estado_mantenimiento_id,
            int_bien_id,
            str_codigo_bien,
            str_mantenimiento_correctivo_motivo,
            int_mantenimiento_diagnostico,
            dt_mantenimiento_correctivo_fecha_revision,
            str_mantenimiento_correctivo_tecnico_responsable,
            str_mantenimiento_correctivo_dependencia,
            str_mantenimiento_correctivo_telefono,
            dt_mantenimiento_correctivo_fecha_entrega,
            str_mantenimiento_correctivo_descripcion_solucion
        } = req.body;


        //obtengo el int_bien_id dado el str_codigo_bien de. De la tabla Bienes
        const bienDB = await Bienes.findOne({
            where: { str_codigo_bien: str_codigo_bien }
        });

        //obtengo el int_custodio_id dado el int_bien_id de la tabla Custodios_bienes
        const custodioDB = await CustodiosBien.findOne({
            where: { int_bien_id: bienDB.dataValues.int_bien_id, str_persona_bien_activo: true }
        });

        //obtengo el nombre del custodio dado el int_custodio_id de la tabla Custodios

        const custodio = await Custodios.findOne({
            where: { int_custodio_id: custodioDB.dataValues.int_custodio_id }
        });

        const nombreCustodio = custodio.dataValues.str_custodio_nombre;




        const newmantenimientoCorrectivo = await MantenimientoCorrectivo.create({
            int_nivel_mantenimiento_id,
            int_estado_mantenimiento_id,
            int_bien_id,
            str_codigo_bien,
            str_mantenimiento_correctivo_motivo,
            int_mantenimiento_diagnostico,
            dt_mantenimiento_correctivo_fecha_revision,
            str_mantenimiento_correctivo_tecnico_responsable,
            str_mantenimiento_correctivo_dependencia,
            str_mantenimiento_correctivo_telefono,
            dt_mantenimiento_correctivo_fecha_entrega,
            str_mantenimiento_correctivo_descripcion_solucion,
            str_mantenimiento_correctivo_custodio: nombreCustodio
        });

        if (newmantenimientoCorrectivo) {
            insertarAuditoria(
                "Null",
                "tb_mantenimiento_correctivo",
                "INSERT",
                newmantenimientoCorrectivo,
                req.ip,
                req.headers.host,
                req,
                "Se ha creado un nuevo registro de mantenimiento Correctivo"
            )
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
        const {
            int_nivel_mantenimiento_id,
            int_estado_mantenimiento_id,
            int_bien_id,
            str_codigo_bien,
            str_mantenimiento_correctivo_motivo,
            int_mantenimiento_diagnostico,
            str_mantenimiento_correctivo_estado,
            dt_mantenimiento_correctivo_fecha_revision,
            str_mantenimiento_correctivo_tecnico_responsable,
            str_mantenimiento_correctivo_dependencia,
            str_mantenimiento_correctivo_telefono,
            dt_mantenimiento_correctivo_fecha_entrega,
            str_mantenimiento_correctivo_descripcion_solucion
        } = req.body;
        
        const { id } = req.params;
        const mantenimientoCorrectivoDB = await MantenimientoCorrectivo.findOne({
            where: { int_mantenimiento_id: id }
        });
        if (!mantenimientoCorrectivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        const mantenimientoCorrectivoUpdate = await MantenimientoCorrectivo.update(
            {
                int_nivel_mantenimiento_id,
                int_estado_mantenimiento_id,
                int_bien_id,
                str_codigo_bien,
                str_mantenimiento_correctivo_motivo,
                int_mantenimiento_diagnostico,
                str_mantenimiento_correctivo_estado,
                dt_mantenimiento_correctivo_fecha_revision,
                str_mantenimiento_correctivo_tecnico_responsable,
                str_mantenimiento_correctivo_dependencia,
                str_mantenimiento_correctivo_telefono,
                dt_mantenimiento_correctivo_fecha_entrega,
                str_mantenimiento_correctivo_descripcion_solucion,
                dt_fecha_actualizacion: new Date(),
            },
            {
                where: { int_mantenimiento_id: id }
            }
        );

        if (mantenimientoCorrectivoUpdate) {
            const nuevo = await MantenimientoCorrectivo.findOne({
                where: { int_mantenimiento_id: id }
            });
            insertarAuditoria(
                mantenimientoCorrectivoDB,
                "tb_mantenimiento_correctivo",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha actualizado el registro de mantenimiento correctivo con id: " + mantenimientoCorrectivoDB.int_mantenimiento_id
            );
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
    try {
        const { id } = req.params;
        
        const mantenimientoCorrectivoDB = await MantenimientoCorrectivo.findOne({
            where: { int_mantenimiento_id: id }
        });
        if (!mantenimientoCorrectivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento correctivo",
                body: {}
            });
        }

        let estado = "";
        if (mantenimientoCorrectivoDB.str_mantenimiento_correctivo_estado === "ACTIVO") {
            estado = "INACTIVO";
        } else {
            estado = "ACTIVO";
        }

        const mantenimientoCorrectivoUpdate = await MantenimientoCorrectivo.update(
            {
                str_mantenimiento_correctivo_estado: estado,
                dt_fecha_actualizacion: new Date()
            },
            {
                where: { int_mantenimiento_id: id }
            }
        );

        if (mantenimientoCorrectivoUpdate) {
            const nuevo = await MantenimientoCorrectivo.findOne({
                where: { int_mantenimiento_id: id }
            });
            insertarAuditoria(
                mantenimientoCorrectivoDB,
                "tb_mantenimiento_correctivo",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha actualizado el estado del registro de mantenimiento correctivo con id: " + mantenimientoCorrectivoDB.int_mantenimiento_id
            );
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
    }
};

const obtenerMantenimientosCorrectivos = async (req, res) => {
    try {
        const paginationData = req.query;
        const mantenimientoCorrectivoDB = await MantenimientoCorrectivo.findAll(
            { limit: 5 }
        );
        if (mantenimientoCorrectivoDB.length === 0) {
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
                MantenimientoCorrectivo,
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
            MantenimientoCorrectivo,
            paginationData.parameter,
            paginationData.data
        );

     



        if (mantenimientoCorrectivoDB) {
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
        const mantenimientoCorrectivoDB = await MantenimientoCorrectivo.findOne({
            where: { int_mantenimiento_id: id }
        });

        
        //obtengo el str_nivel_mantenimiento_descripcion dado el int_nivel_mantenimiento_id
        //obtengo el str_estado_mantenimiento_nombre dado el int_estado_mantenimiento_id

        const nivelMantenimientoDB = await nivelMantenimiento.findOne({
            where: { int_nivel_mantenimiento_id: mantenimientoCorrectivoDB.dataValues.int_nivel_mantenimiento_id }
        });

        const estadoMantenimientoDB = await EstadoMantenimiento.findOne({
            where: { int_estado_mantenimiento_id: mantenimientoCorrectivoDB.dataValues.int_estado_mantenimiento_id }
        });

        //agreggo a mantenimientoCorrectivoDB el str_nivel_mantenimiento_descripcion y el str_estado_mantenimiento_nombre
        mantenimientoCorrectivoDB.dataValues.str_nivel_mantenimiento_descripcion = nivelMantenimientoDB.dataValues.str_nivel_mantenimiento_descripcion;
        mantenimientoCorrectivoDB.dataValues.str_estado_mantenimiento_nombre = estadoMantenimientoDB.dataValues.str_estado_mantenimiento_nombre;


        if (!mantenimientoCorrectivoDB) {
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
    obtenerMantenimientosCorrectivos,
    obtenerMantenimientoCorrectivoPorId,
    eliminarMantenimientoCorrectivo
}