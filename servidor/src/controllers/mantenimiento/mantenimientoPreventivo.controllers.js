import { sequelize } from "../../database/database.js";
import { MantenimientoPreventivo } from "../../models/mantenimiento/mantenimientoPreventivo.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { PlanificacionBien } from "../../models/mantenimiento/planificacionBien.models.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { Planificacion } from "../../models/mantenimiento/planificacion.models.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearMantenimientoPreventivo = async (req, res) => {
    try {
        
        const { 
            int_nivel_mantenimiento_id,
            bienesDescripcion,
            idPlanificacion
         } = req.body;


         //verificar que no exista un mantenimiento preventivo con el mismo id de planificacion
            const mantenimientoPreventivoDB = await MantenimientoPreventivo.findOne({
                where : { int_planificacion_id : idPlanificacion }
            });
            if(mantenimientoPreventivoDB) {
                return res.json({
                    status: false,
                    message: "Ya existe un registro de mantenimiento preventivo con el mismo id de planificacion",
                    body: {}
                });
            }
            


         
        //idPlanificacion es el id de la planificacion
       
        //creamos los registros en la tabla tb_planificacion_bien
        bienesDescripcion.forEach(async (codigoBien) => {
            const newmantenimientoPreventivo = await MantenimientoPreventivo.create({
                int_planificacion_id: idPlanificacion,
                int_nivel_mantenimiento_id,
                str_codigo_bien: codigoBien.codigo,
                int_planificacion_id: idPlanificacion,
                str_mantenimiento_descripcion: codigoBien.descripcion
            });
        });




    
        return res.json({
                status: true,
                message: "Registro de mantenimiento Preventivo creado correctamento",
                body:{}
        })
        
    } catch (error) {
        return res.status(500).json({
            message: `Error al crear el registro en mantenimiento preventivo${error}`,
            data: {},
        });
    }
};

const obtenerMantenimientoPreventivoPorIdPlanificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const mantenimientoPreventivoDB = await MantenimientoPreventivo.findOne({
            where : { int_planificacion_id: id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        //encuentro todos los bienes de planificacionBien que tengan el id de la planificacion
        const bienes = await MantenimientoPreventivo.findAll({
            where: { int_planificacion_id: id }, raw: true
        });

        //hallo los nombres de los bienes
        const bienesNombres = await Promise.all(
            bienes.map(async (bien) => {
                const nombreBien = await Bienes.findOne({
                    where: { str_codigo_bien: bien.str_codigo_bien }, raw: true
                });
                const bienes = {
                    str_codigo_bien: bien.str_codigo_bien,
                    str_bien_nombre: nombreBien.str_bien_nombre
                }
                return bienes;
            })
        );

        //agrego los nombres de los bienes al objeto de mantenimientoPreventivoDB
        bienes.bienes = bienesNombres;

        return res.json({
            status: true,
            message: "Registro de mantenimiento preventivo encontrado correctamente",
            body: bienes
        });

    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el registro de mantenimiento preventivo ${error}`,
            data: {}
        })
    }
};

const editarMantenimientoPreventivo = async (req, res) => {
    try {
        const { 
            // int_nivel_mantenimiento_id,
            str_mantenimiento_descripcion,

        } = req.body;
        console.log('imprimiento el update mantenimiento preventivo',req.body)
        const { id } = req.params;
        const mantenimientoPreventivoDB = await MantenimientoPreventivo.findOne({
            where : { int_mantenimiento_id : id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        const mantenimientoPreventivoUpdate = await MantenimientoPreventivo.update(
            {
                // int_nivel_mantenimiento_id,
                str_mantenimiento_descripcion,
            },
            {
                where : { int_mantenimiento_id : id }
            }
        );
       
        if(mantenimientoPreventivoUpdate) {
            const nuevo = await MantenimientoPreventivo.findOne({
                where : { int_mantenimiento_id : id }
            });
            insertarAuditoria(
                mantenimientoPreventivoDB,
                "tb_mantenimiento_preventivo",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se actualizó un registro de mantenimiento preventivo con id " + id,
            )
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
//cuando envía todos los datos de la planificación
const editarMantenimientosPreventivos = async (req, res) => {
    try{
        const {
            bienesDescripcion,
            idPlanificacion,
            estadoPlanificacion,
            responsablesMantenimiento
        } = req.body;

        console.log(responsablesMantenimiento)

        /**
         * bienesDescripcion = [
         *     {
         *        codigo: "CODIGO1",
         *        descripcion: "NOMBRE1",
         *        int_mantenimiento_id: 1
         *    },
         *    {
         *        codigo: "CODIGO2",
         *        descripcion: "NOMBRE2",
         *        int_mantenimiento_id: 2
         *    }
         * ]
         */
        const planificacionDB = await Planificacion.findOne({
            where : { int_planificacion_id : idPlanificacion }
        });

        if(!planificacionDB) {
            return res.json({
                status: false,
                message: "No existe la planificacion",
                body: {}
            });
        }
        
        //actualizar el estado de la planificacion
        const planificacionUpdate = await Planificacion.update(
            {
                str_planificacion_estado: estadoPlanificacion
            },
            {
                where : { int_planificacion_id : idPlanificacion }
            }
        );

        //verificar que exista un mantenimiento preventivo con el mismo id de planificacion
        const mantenimientoPreventivoDB = await MantenimientoPreventivo.findOne({
            where : { int_planificacion_id : idPlanificacion }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe un registro de mantenimiento preventivo con el id de planificacion",
                body: {}
            });
        }

        //actualizar los registros de la tabla mantenimiento preventivo
        bienesDescripcion.forEach(async (bien) => {
            const mantenimientoPreventivoUpdate = await MantenimientoPreventivo.update(
                {
                    str_mantenimiento_descripcion: bien.descripcion,
                    dt_fecha_actualizacion: new Date()
                },
                {
                    where : { int_mantenimiento_id : bien.int_mantenimiento_id }
                }
            );
        });

        //actualizar los responsables de mantenimiento
        responsablesMantenimiento.forEach(async (responsable) => {
            const mantenimientoPreventivoUpdateRes = await MantenimientoPreventivo.update(
                {
                    str_mantenimiento_preventivo_responsable_nombre: responsable.nombre,
                    str_mantenimiento_preventivo_responsable_id: responsable.cedula,
                    dt_fecha_actualizacion: new Date()
                },
                {
                    where : { int_mantenimiento_id : responsable.int_mantenimiento_id }
                }
            );
        });
        // console.log('imprimiendo el update',planificacionUpdate)

        insertarAuditoria(
            planificacionDB,
            "tb_planificacion",
            "UPDATE",
            planificacionUpdate,
            req.ip,
            req.headers.host,
            req,
            "Se actualizó un registro de planificación con id " + idPlanificacion,
        )

        return res.json({
            status: true,
            message: "Registro de mantenimiento preventivo actualizado correctamente",
            body: {}
        });

    }catch(error) {
        return res.status(500).json({
            message: `Error al editar el registro de mantenimiento preventivo ${error}`,
            data: {},
        });
    }
}


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
        
        
        const paginationData = req.query;
        const mantenimientoPreventivoDB = await MantenimientoPreventivo.findAll(
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
                MantenimientoPreventivo,
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
            MantenimientoPreventivo,
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
        const mantenimientoPreventivoDB = await MantenimientoPreventivo.findOne({
            where : { int_planificacion_id: id }
        });
        if(!mantenimientoPreventivoDB) {
            return res.json({
                status: false,
                message: "No existe el registro de mantenimiento preventivo",
                body: {}
            });
        }

        //encuentro todos los bienes de planificacionBien que tengan el id de la planificacion
        const bienes = await MantenimientoPreventivo.findAll({
            where: { int_planificacion_id: id }, raw: true
        });

       let data = {};

        //hallo los nombres de los bienes
        const bienesNombres = await Promise.all(
            bienes.map(async (bien) => {
                const nombreBien = await Bienes.findOne({
                    where: { str_codigo_bien: bien.str_codigo_bien }, raw: true
                });
                const bienes ={
                    str_codigo_bien: bien.str_codigo_bien,
                    str_nombre_bien: nombreBien.str_bien_nombre
                }
                return bienes;
            })
        );


        //agrego los nombres de los bienes al objeto de mantenimientoPreventivoDB
        // mantenimientoPreventivoDB.dataValues.bienes = bienesNombres;
        // console.log(bienes)
        data.bienes = bienes
        data.bienesNombre = bienesNombres
  
        



        return res.json({
            status: true,
            message: "Registro de mantenimiento preventivo encontrado correctamente",
            body: data
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
    obtenerMantenimientoPreventivoPorId,
    editarMantenimientosPreventivos,
    obtenerMantenimientoPreventivoPorIdPlanificacion
}