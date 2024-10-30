import { Soporte } from "../../models/mantenimiento/soporte.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearSoporte = async (req, res) => {
    try{
        const { nombre,descripcion} = req.body;
        //mayusculas
        const nombreM = nombre.toUpperCase();
        //comprobar si existe el soporte
        const soporteDB = await Soporte.findOne({
            where: {str_soporte_nombre: nombreM}
        });
        if(soporteDB){
            return res.json({
                status: false,
                message: "Ya existe el soporte",
                body: {}
            })
        }
        const nuevoSoporte = await Soporte.create({
            str_soporte_descripcion: descripcion,
            str_soporte_nombre: nombreM,
        });
        if(nuevoSoporte){
            console.log("soporte creado")
            insertarAuditoria(
                "Null",
                "tb_soporte",
                "INSERT",
                nuevoSoporte,
                req.ip,
                req.headers.host,
                req,
                "Se ha creado un nuevo soporte"
            )
            return res.json({
                status: true,
                message: "Soporte creado correctamente",
                body: nuevoSoporte
            })
        }

    }catch(error){
        
        return res.status(500).json({
            message: `Error al crear el soporte ${error}`,
            data: {}
        })
    }
}

const editarSoporte = async (req, res) => {
    try{
        const { nombre, descripcion } = req.body;
        const { id } = req.params;
        const nombreM = nombre.toUpperCase();
        const soporteDB = await Soporte.findOne({
            where: { int_soporte_id: id }
        });
        if(!soporteDB){
            return res.json({
                status: false,
                message: "No existe el soporte",
                body: {}
            })
        }
        const soporteUpdate = await Soporte.update({
            str_soporte_descripcion: descripcion,
            str_soporte_nombre: nombreM,
            dt_fecha_actualizacion: new Date()
        },{
            where: { int_soporte_id: id }
        });
        if(soporteUpdate){
            const nuevo = await Soporte.findOne({
                where: { int_soporte_id: id }
            });
            insertarAuditoria(
                soporteDB,
                "tb_soporte",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha editado un soporte"
            )
            return res.json({
                status: true,
                message: "Soporte actualizado correctamente",
                body: soporteUpdate
            })
        }

    }catch(error){
        
        return res.status(500).json({
            message: `Error al editar el soporte ${error}`,
            data: {}
        })
    }

}

const cambiarEstadoSoporte = async (req, res) => {
    try{
        const { id } = req.params;
        const soporteDB = await Soporte.findOne({
            where: { int_soporte_id: id }
        });
        if(!soporteDB){
            return res.json({
                status: false,
                message: "No existe el soporte",
                body: {}
            })
        }
        let estado ="";
        if(soporteDB.str_soporte_estado === "ACTIVO"){
            estado = "INACTIVO";
        }
        else{
            estado = "ACTIVO";
        }
        const soporteUpdate = await Soporte.update({
            str_soporte_estado: estado
        },{
            where: { int_soporte_id: id }
        });
        if(soporteUpdate){
            const nuevo = await Soporte.findOne({
                where: { int_soporte_id: id }
            });
            insertarAuditoria(
                soporteDB,
                "tb_soporte",
                "UPDATE",
                nuevo,
                req.ip,
                req.headers.host,
                req,
                "Se ha editado el estado de un soporte"
            )
            return res.json({
                status: true,
                message: "Estado del soporte actualizado correctamente",
                body: soporteUpdate
            })
        }

    }catch(error){
        
        return res.status(500).json({
            message: `Error al cambiar el estado del soporte ${error}`,
            data: {}
        })
    }

}

const obtenerSoportePorId = async (req, res) => {
    try
    {
        const { id } = req.params;
        const soporteDB = await Soporte.findOne({
            where: { int_soporte_id: id }
        });
        if(!soporteDB){
            return res.json({
                status: false,
                message: "No existe el soporte",
                body: {}
            })
        }
        return res.json({
            status: true,
            message: "Estado del soporte",
            body: soporteDB
        })

    }catch(error){
        
        return res.status(500).json({
            message: `Error al obtener el estado del soporte ${error}`,
            data: {}
        })
    }
}
const obtenerSoportes = async(req, res) => {
    try{
        
        const paginatioData = req.query;

        if(paginatioData.page ==="undefined"){
            const {datos, total} = await paginarDatos(
                1,
                10,
                Soporte,
                "",
                ""
            );
            return res.json({
                status: true,
                message: "Lista de soportes",
                body: datos,
                total: total
            })
        }

        const soportes = await Soporte.findAll({
            limit: 5
        });
        if(soportes.length === 0 || !soportes){
            return res.json({
                status: false,
                message: "No hay soportes registrados",
                body: {}
            })
        }else{
            const {datos, total} = await paginarDatos(
                paginatioData.page,
                paginatioData.size,
                Soporte,
                paginatioData.parameter,
                paginatioData.data
            );
            return res.json({
                status: true,
                message: "Lista de soportes",
                body: datos,
                total: total
            })
        }
    }catch(error){
        
        return res.status(500).json({
            message: `Error al obtener los soportes ${error}`,
            data: {}
        })
    }
}


export default {
    crearSoporte,
    editarSoporte,
    cambiarEstadoSoporte,
    obtenerSoportePorId,
    obtenerSoportes
}