import { Estado } from "../../models/mantenimiento/estado.models.js"
import { paginarDatos } from '../../utils/paginacion.utils.js';

const crearEstadoMantenimiento = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const descripcionM = descripcion.toUpperCase();         //Covnertir a mayúsculas
        const estadoMantenimientoDB = await Estado.findOne({    //Comprobar si existe el estado a registrar
            where: { str_estadoMantenimiento_descripcion: descripcionM }
        });
        if(estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "Ya existe el estado de mantenimiento",
                body: {},
            });
        }

        const newEstadoMantenimiento = await Estado.create({    //Insertar el nuevo estado
            str_estadoMantenimiento_descripcion: descripcionM
        });
        if(newEstadoMantenimiento) {
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
        const {descripcion } = req.body;
        const { id } = req.param;
        const descripcionM = descripcion.toUpperCase();
        const estadoMantenimientoDB = await Estado.findOne({
            where: { int_estadoMantenimiento_id: id }
        });
        if(!estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de mantenimiento",
                body: {},
            });
        }
        const estadoMantenimientoUpdate = await Estado.update(
            {
                str_estadoMantenimiento_descripcion: descripcionM
            },
            {
                where: { int_estadoMantenimiento_id: id}
            }
        );
        if(estadoMantenimientoUpdate) {
            return res.json({
                status: true,
                message: "Estado de mantenimiento actualizado correctamente",
                body: estadoMantenimientoUpdate
            });
        }  
    } catch (error) {
        return res.status(500).json({
            message: `Error al editar el estado de mantenimiento ${error}`,
            data: {}
        });
    }
};

const cambiarEstadoMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const estadoMantenimientoDB = await Estado.findOne({
            where: { int_estadoMantenimiento_id: id }
        });
        if(!estadoMantenimientoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de mantenimiento",
                body: {},
            })
        }
        
        let estado = "";    //Cambiar estado INACTIVO O ACTIVO
        if(estadoMantenimientoDB.str_estadoMantenimiento_estado === "ACTIVO"){
            estado = "INACTIVO";
        } else {
            estado = "INACTIVO";
        }
        const estadoMantenimientoUpdate = await Estado.update(
            {
                str_estadoMantenimiento_estado: estado
            },
            {
                where: { int_estadoMantenimiento_id: id }
            }
        );

        if(estadoMantenimientoUpdate) {
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
        console.log("estadosxd")
        const paginationData = req.query;
        const estadosMantenimiento = await Estado.findAll(
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
                Estado,
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
            Estado,
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
        console.log('Ingreso a obtener estado mantenimiento por id')
        const { id } = req.params;
        const estadoMantenimientoDB = await Estado.findOne({
            where: { int_estadoMantenimiento_id: id }
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