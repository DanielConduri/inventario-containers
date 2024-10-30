import { EstadoMantenimiento } from "../../models/mantenimiento/estado.models.js"
import { paginarDatos } from '../../utils/paginacion.utils.js';
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearEstadoMantenimiento = async (req, res) => {
    try {
        const { descripcion,nombre } = req.body;
        const descripcionM = descripcion.toUpperCase();         //Covnertir a mayúsculas
        const nombreM = nombre.toUpperCase();
        const estadoMantenimientoDB = await EstadoMantenimiento.findOne({    //Comprobar si existe el estado a registrar
            where: { str_estado_mantenimiento_nombre: nombreM }
        });
        if(estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "Ya existe el estado de mantenimiento",
                body: {},
            });
        }

        const newEstadoMantenimiento = await EstadoMantenimiento.create({    //Insertar el nuevo estado
            str_estado_mantenimiento_descripcion: descripcionM,
            str_estado_mantenimiento_nombre: nombreM
        });
        if(newEstadoMantenimiento) {
            insertarAuditoria(
                "null",
                "tb_estado_mantenimiento",
                "INSERT",
                newEstadoMantenimiento,
                req.ip,
                req.headers.host,
                req,
                "Se ha insertado un estado de mantenimiento nuevo"
            );
            return res.json({
                status: true,
                message: "Estado de mantenimiento creado correctamente",
                body: newEstadoMantenimiento
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:  `Error al crear el nivel de mantenimiento ${error}`,
            data: {}
        });
    }
};

const editarEstadoMantenimiento = async (req, res) => {
    try {
        const {descripcion,nombre } = req.body;
        const { id } = req.params;
        
        const descripcionM = descripcion.toUpperCase();
        // const nombreM = nombre.toUpperCase();
        const estadoMantenimientoDB = await EstadoMantenimiento.findOne({
            where: { int_estado_mantenimiento_id: id }
        });
        if(!estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de mantenimiento",
                body: {},
            });
        }
        const estadoMantenimientoUpdate = await EstadoMantenimiento.update(
            {
                str_estado_mantenimiento_descripcion: descripcionM,
                dt_fecha_actualizacion: new Date()
            },
            {
                where: { int_estado_mantenimiento_id: id}
            }
        );

        if(estadoMantenimientoUpdate) {

            const nuevo = await EstadoMantenimiento.findOne({
                where: { int_estado_mantenimiento_id: id }
            });

            insertarAuditoria(
                estadoMantenimientoDB,
                "tb_estado_mantenimiento",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha actualizado el estado de mantenimiento con id: " + estadoMantenimientoDB.int_estado_mantenimiento_id
            );
            return res.json({
                status: true,
                message: "Estado de mantenimiento actualizado correctamente",
                body: estadoMantenimientoUpdate
            });
        }  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al editar el estado de mantenimiento ${error}`,
            data: {}
        });
    }
};

const cambiarEstadoMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const estadoMantenimientoDB = await EstadoMantenimiento.findOne({
            where: { int_estado_mantenimiento_id: id }
        });
        if(!estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de mantenimiento",
                body: {},
            })
        }
        
        let estado = "";    //Cambiar estado INACTIVO O ACTIVO
        if(estadoMantenimientoDB.str_estado_mantenimiento_estado === "ACTIVO"){
            estado = "INACTIVO";
        } else {
            estado = "ACTIVO";
        }
        const estadoMantenimientoUpdate = await EstadoMantenimiento.update(
            {
                str_estado_mantenimiento_estado: estado
            },
            {
                where: { int_estado_mantenimiento_id: id }
            }
        );

        if(estadoMantenimientoUpdate) {
            const nuevo = await EstadoMantenimiento.findOne({
                where: { int_estado_mantenimiento_id: id }
            });
            insertarAuditoria(
                estadoMantenimientoDB,
                "tb_estado_mantenimiento",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha actualizado el estado de mantenimiento con id: " + estadoMantenimientoDB.int_estado_mantenimiento_id
            );
            return res.json({
                status: true,
                message: "Estado de mantenimiento actualizado correctamente",
                body: estadoMantenimientoUpdate
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al eliminar el estado de mantenimiento ${error}`,
            data: {}
        })
    }
};

const obtenerEstadosMantenimiento = async (req, res) => {
    try {
       
        const paginationData = req.query;
        const estadosMantenimiento = await EstadoMantenimiento.findAll(
            {limit:5}
        );

        if(!estadosMantenimiento.length === 0) {
            return res.json({
                status: false,
                message: "No se encontraron estados de mantenimiento",
                body: {},
            });
        }

        if(paginationData.page === "undefined") {
            const {datos, total} = await paginarDatos(
                1,
                10,
                EstadoMantenimiento,
                "",
                ""
            );
            if(estadosMantenimiento) {
                return res.json({
                    status: true,
                    message: "Estados de mantenimiento encontrados correctamente",
                    body: datos,
                    total: total
                })
            }
        }

        const {datos, total} = await paginarDatos(
            paginationData.page,
            paginationData.size,
            EstadoMantenimiento,
            paginationData.parameter,
            paginationData.data
        );

        if(estadosMantenimiento) {
            return res.json({
                status: true,
                message: "Estados de mantenimiento encontrados correctamente",
                body: datos,
                total: total
            })
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener los estados de mantenimiento ${error}`,
            data: {}
        })
    }
};

const obtenerEstadoMantenimientoPorId = async (req, res) => {
    try {
        
        const { id } = req.params;
        const estadoMantenimientoDB = await EstadoMantenimiento.findOne({
            where: { int_estado_mantenimiento_id: id }
        });

        if(!estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de mantenimiento",
                data: {},
            })          
        }
        return res.json({
            status: true,
            message: "Estado de mantenimiento obtenido correctamente",
            body: estadoMantenimientoDB
        })
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el estado de mantenimiento ${error}`,
            data: {}
        })
    }
};


export default {
    crearEstadoMantenimiento,
    editarEstadoMantenimiento,
    cambiarEstadoMantenimiento,
    obtenerEstadosMantenimiento,
    obtenerEstadoMantenimientoPorId 
}