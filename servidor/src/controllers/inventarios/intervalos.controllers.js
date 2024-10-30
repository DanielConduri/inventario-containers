import { Intervalos } from "../../models/departamentos/intervalos.models.js";

import { paginarDatos } from "../../utils/paginacion.utils.js";

import { Op } from "sequelize";

const obtenerIntervalos = async (req, res) => {
    try {
        const paginationData = req.query;

        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(1, 10, Intervalos, '', '');
            return res.json({
                status: true,
                message: "Intervalos encontrados",
                body: datos,
                total: total,
            });
        }
        const intervalos = await Intervalos.findAll({ limit: 5 });
        if (intervalos.length === 0 || !intervalos) {
            return res.json({
                status: false,
                message: "No se encontraron intervalos"
            });
        } else {
            const { datos, total } = await paginarDatos(
                paginationData.page, 
                paginationData.size, 
                Intervalos, 
                paginationData.parameter, 
                paginationData.data
            );
                
            return res.json({
                status: true,
                message: "Intervalos obtenidos",
                body: datos,
                total: total,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const obtenerIntervalo = async (req, res) => {
    try {
        const { int_intervalo_id } = req.params;

        const intervalo = await Intervalos.findOne({
            where: {
                int_intervalo_id: int_intervalo_id,
            }
        });

        if(!intervalo){
            return res.json({
                status: false,
                message: "No se encontraron intervalos"
            });
        } else {
            return res.json({
                status: true,
                message: "Intervalo encontrado",
                body: intervalo,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const crearIntervalo = async (req, res) => {
    try {
        const { tm_intervalo_inicio, tm_intervalo_fin } = req.body;

        const nuevoIntervalo = await Intervalos.create({
            tm_intervalo_inicio: tm_intervalo_inicio,
            tm_intervalo_fin: tm_intervalo_fin,
        });

        return res.json({
            status: true,
            message: "Intervalo creado correctamente",
            body: nuevoIntervalo,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const actualizarIntervalo = async (req, res) => {
    try {
        const { int_intervalo_id } = req.params;
        const { tm_intervalo_inicio, tm_intervalo_fin } = req.body;

        const intervalo = await Intervalos.findOne({
            where: {
                int_intervalo_id: int_intervalo_id,
            }
        });

        if(!intervalo){
            return res.json({
                status: false,
                message: "No se encontraron intervalos"
            });
        } else {
            intervalo.tm_intervalo_inicio = tm_intervalo_inicio;
            intervalo.tm_intervalo_fin = tm_intervalo_fin;
            intervalo.dt_fecha_actualizacion = new Date();
            await intervalo.save();

            return res.json({
                status: true,
                message: "Intervalo actualizado correctamente",
                body: intervalo,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    obtenerIntervalos,
    obtenerIntervalo,
    crearIntervalo,
    actualizarIntervalo,
};