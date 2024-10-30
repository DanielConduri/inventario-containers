import { EstadoPrestamo } from "../../models/prestamos/estados.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearEstadoPrestamo = async (req, res) => {
    try {
        const { descripcion, nombre } = req.body;
        const descripcionM = descripcion.toUpperCase();
        const nombreM = nombre.toUpperCase();
        const estadoPrestamoDB = await EstadoPrestamo.findOne({
            where: { str_estado_prestamo_nombre: nombreM }
        });
        if (estadoPrestamoDB) {
            return res.json({
                status: false,
                message: "Ya existe el estado de prestamo",
                body: {},
            });
        }

        const newEstadoPrestamo = await EstadoPrestamo.create({
            str_estado_prestamo_descripcion: descripcionM,
            str_estado_prestamo_nombre: nombreM
        });
        if (newEstadoPrestamo) {
            insertarAuditoria(
                "null",
                "tb_estado_prestamo",
                "INSERT",
                newEstadoPrestamo,
                req.ip,
                req.headers.host,
                req,
                "Se ha insertado un estado de prestamo nuevo"
            );
            return res.json({
                status: true,
                message: "Estado de prestamo creado correctamente",
                body: newEstadoPrestamo
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el estado de prestamo${error}`,
            data: {}
        });
    }
}

const editarEstadoPrestamo = async (req, res) => {
    try {
        const { descripcion, nombre } = req.body;
        const { id } = req.params;

        const descripcionM = descripcion.toUpperCase();
        const nombreM = nombre.toUpperCase();
        const estadoPrestamoDB = await EstadoPrestamo.findOne({
            where: { int_estado_prestamo_id: id }
        });
        if (!estadoPrestamoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de prestamo",
                body: {},
            });

        }
        const editEstadoPrestamoUpdate = await EstadoPrestamo.update({
            str_estado_prestamo_descripcion: descripcionM,
            str_estado_prestamo_nombre: nombreM
        }, {
            where: { int_estado_prestamo_id: id }
        });
        if (editEstadoPrestamoUpdate) {

            const editEstadoPrestamo = await EstadoPrestamo.findOne({
                where: { int_estado_prestamo_id: id }
            });

            insertarAuditoria(
                "null",
                "tb_estado_prestamo",
                "UPDATE",
                editEstadoPrestamo,
                req.ip,
                req.headers.host,
                req,
                "Se ha editado un estado de prestamo"
            );
            return res.json({
                status: true,
                message: "Estado de prestamo editado correctamente",
                body: editEstadoPrestamo
            });
            // if (editEstadoPrestamo) {
            // }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al editar el estado de prestamo ${error}`,
            data: {}
        });
    }

}

const cambiarEstadoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const estadoPrestamoDB = await EstadoPrestamo.findOne({
            where: { int_estado_prestamo_id: id }
        });
        if (!estadoPrestamoDB) {
            return res.json({
                status: false,
                message: "No existe el estado de prestamo",
                body: {},
            });
        }
        let estado = '';
        if (estadoPrestamoDB.str_estado_prestamo_estado === 'ACTIVO') {
            estado = 'INACTIVO';
        } else {
            estado = 'ACTIVO';
        }
        const estadoPrestamoUpdate = await EstadoPrestamo.update({
            str_estado_prestamo_estado: estado
        }, {
            where: { int_estado_prestamo_id: id }
        });
        if (estadoPrestamoUpdate) {
            const estadoPrestamo = await EstadoPrestamo.findOne({
                where: { int_estado_prestamo_id: id }
            });
            insertarAuditoria(
                "null",
                "tb_estado_prestamo",
                "UPDATE",
                estadoPrestamo,
                req.ip,
                req.headers.host,
                req,
                "Se ha cambiado el estado de prestamo" + estadoPrestamo.int_estado_prestamo_id
            );
            return res.json({
                status: true,
                message: "Estado de prestamo cambiado correctamente",
                body: estadoPrestamo
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al cambiar el estado de prestamo ${error}`,
            data: {}
        });
    }

}

const obtenerEstadosPrestamo = async (req, res) => {
    try {
        const paginationData = req.query;
        const estadosPrestamo = await EstadoPrestamo.findAll(
            {limit: 5}
        )
        
        if (!estadosPrestamo.length === 0) {
            return res.json({
                status: false,
                message: "No existen estados de prestamo",
                body: {},
            });
        }

        if (paginationData.page === "undefined") {
            const {datos, total} = await paginarDatos(
                1,
                10,
                EstadoPrestamo,
                "",
                ""
            );
            if (estadosPrestamo) {
                return res.json({
                    status: true,
                    message: "Estados de prestamo encontrados",
                    body: datos,
                    total: total
                });
            }
        }

        const {datos, total} = await paginarDatos(
            paginationData.page,
            paginationData.size,
            EstadoPrestamo,
            paginationData.parameter,
            paginationData.data
        );

        if (estadosPrestamo) {
            return res.json({
                status: true,
                message: "Estados de prestamo encontrados",
                body: datos,
                total: total
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener los estados de prestamo ${error}`,
            data: {}
        });
    }

}

const obtenerEstadoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const estadoPrestamo = await EstadoPrestamo.findOne({
            where: { int_estado_prestamo_id: id }
        });
        if (!estadoPrestamo) {
            return res.json({
                status: false,
                message: "No existe el estado de prestamo",
                body: {},
            });
        }
        return res.json({
            status: true,
            message: "Estado de prestamo encontrado",
            body: estadoPrestamo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener el estado de prestamo ${error}`,
            data: {}
        });
    }

}

export default {
    crearEstadoPrestamo,
    editarEstadoPrestamo,
    cambiarEstadoPrestamo,
    obtenerEstadosPrestamo,
    obtenerEstadoPrestamo
}