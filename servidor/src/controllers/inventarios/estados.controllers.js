import { sequelize } from "../../database/database.js";
import { DataTypes } from "sequelize";
import { Estados } from "../../models/inventario/estados.models.js";

const obtenerEstados = async (req, res) => {
    try {
        const estados = await Estados.findAll();
        if (estados.length === 0 || !estados) {
            return res.json({
                status: false,
                message: "No se encontraron estados"
            });
        } else {
            return res.json({
                status: true,
                message: "Estados obtenidos",
                body: estados,
            });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
};

const obtenerEstado =   async (req, res) => {
    
    try {
        const { int_estado_bien_id } = req.params;
        const estado = await Estados.findOne({
            where: {
                int_estado_bien_id: int_estado_bien_id
            }
        });
    
        return res.json({
            status: true,
            message: "Estado obtenido correctamente",
            body: estado,
        });
    } catch (error) {
        return  res.status(500).json({ message: error.message });
    }

};

const obtenerEstadosActivos = async (req, res) => {
    try {
        const estados = await Estados.findAll({
            where: {
                str_estado_bien_estado: "ACTIVO"
            }
        });
        if (estados.length === 0 || !estados) {
            return res.json({
                status: false,
                message: "No se encontraron estados activos"
            });
        } else {
            return res.json({
                status: true,
                message: "Estados obtenidos",
                body: estados,
            });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const insertarEstado = async (req, res) => {
    const { str_estado_bien_nombre } = req.body;
    try{
        const nuevoEstado = await Estados.create({
            str_estado_bien_nombre
        });
        return res.json({
            status: true,
            message: "Estado insertado correctamente",
            body: nuevoEstado
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const actualizarEstado = async (req, res) => {
    

    const { int_estado_bien_id } = req.params;
    const { str_estado_bien_nombre } = req.body;
    try {
        const estado = await Estados.findOne({
            where: {
                int_estado_bien_id: int_estado_bien_id
            }
        });
        if(!estado || estado.length === 0){
            return res.json({
                status: false,
                message: "No se encontró el estado"
            });
        } 
        estado.str_estado_bien_nombre = str_estado_bien_nombre;
        await estado.save();
        return res.json({
            status: true,
            message: "Estado actualizado correctamente",
            body: estado,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

const eliminarEstado = async (req, res) => {
    const { int_estado_bien_id } = req.params;
    try {
        const estado = await Estados.findOne({
            where: {
                int_estado_bien_id: int_estado_bien_id
            }
        });
        if (!estado) {
            return res.json({
                status: false,
                message: "No se encontró el estado"
            });
        } else if (estado.str_estado_bien_estado == "ACTIVO"){
            estado.str_estado_bien_estado = "INACTIVO";
        } else {
            estado.str_estado_bien_estado = "ACTIVO";
        }

        await estado.save();
        return res.json({
            status: true,
            message: "Estado actualizado correctamente",
            body: estado,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export default {
    obtenerEstados,
    obtenerEstado,
    obtenerEstadosActivos,
    insertarEstado,
    actualizarEstado,
    eliminarEstado
};
