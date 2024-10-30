import { CentrosIntervalos } from "../../models/departamentos/centrosIntervalos.js";
import { Centros } from "../../models/departamentos/centros.models.js";
import { Intervalos } from "../../models/departamentos/intervalos.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Op } from "sequelize";

const obtenerCentrosIntervalos = async (req, res) => {
    try {
        const paginationData = req.query;
        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(1, 10, CentrosIntervalos, '', '');
            return res.json({
                status: true,
                message: "Centros Intervalos encontrados",
                body: datos,
                total: total,
            });
        }
        const centrosIntervalos = await CentrosIntervalos.findAll({ limit: 5 });
        if (centrosIntervalos.length === 0 || !centrosIntervalos) {
            return res.json({
                status: false,
                message: "No se encontraron Centros Intervalos"
            });
        } else {
            const { datos, total } = await paginarDatos(
                paginationData.page,
                paginationData.size,
                CentrosIntervalos,
                paginationData.parameter,
                paginationData.data
            );
            return res.json({
                status: true,
                message: "Centros Intervalos obtenidos",
                body: datos,
                total: total,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const obtenerCentroIntervalo = async (req, res) => {
    try {
        const { int_centro_intervalo_id } = req.params;
        const centroIntervalo = await CentrosIntervalos.findOne({
            where: {
                int_centro_intervalo_id: int_centro_intervalo_id,
            }
        });
        if (!centroIntervalo) {
            return res.json({
                status: false,
                message: "No se encontraron Centros Intervalos"
            });
        }
        return res.json({
            status: true,
            message: "Centros Intervalos obtenidos",
            body: centroIntervalo,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const crearCentroIntervalo = async (req, res) => {
    try {
        const { int_centro_id, int_intervalo_id, dt_centro_intervalo_fecha } = req.body;

        //lógica para comprobar si el centro y el intervalo existen

        const centro = await Centros.findOne({
            where: {
                int_centro_id: int_centro_id,
            }
        });

        if (!centro) {
            return res.json({
                status: false,
                message: "El centro no existe"
            });
        }

        const intervalo = await Intervalos.findOne({
            where: {
                int_intervalo_id: int_intervalo_id,
            }
        });

        if (!intervalo) {

            return res.json({
                status: false,
                message: "El intervalo no existe"
            });
        }

        //comprobar en CentrosIntervalos si ya existe el centro con el intervalo

        const centroIntervaloExistente = await CentrosIntervalos.findOne({
            where: {
                int_centro_id: int_centro_id,
                int_intervalo_id: int_intervalo_id,
            }
        });

        if (centroIntervaloExistente) {
            return res.json({
                status: false,
                message: "El centro está ocupado con el intervalo seleccionado"
            });
        }


        const nuevoCentroIntervalo = await CentrosIntervalos.create({
            int_centro_id,
            int_intervalo_id,
            dt_centro_intervalo_fecha
        });
        return res.status(201).json({
            status: true,
            message: "Centro Intervalo creado",
            body: nuevoCentroIntervalo,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//
const actualizarCentroIntervalo = async (req, res) => {
    try {
        const { int_centro_intervalo_id } = req.params;
        const { int_centro_id, int_intervalo_id } = req.body;
        const centroIntervalo = await CentrosIntervalos.findOne({
            where: {
                int_centro_intervalo_id: int_centro_intervalo_id,
            }
        });
        if (!centroIntervalo) {
            return res.json({
                status: false,
                message: "No se encontraron Centros Intervalos"
            });
        }
        await CentrosIntervalos.update({
            int_centro_id,
            int_intervalo_id
        }, {
            where: {
                int_centro_intervalo_id: int_centro_intervalo_id,
            }
        });
        return res.json({
            status: true,
            message: "Centro Intervalo actualizado",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const obtenerDisponiblesPorFechaPorCentro = async (req, res) => {
    try {

        const { dt_centro_intervalo_fecha, int_centro_id } = req.body;
        console.log(dt_centro_intervalo_fecha, int_centro_id);


        //obtengo los intervalos que ya están ocupados en la fecha y centro seleccionados
        const intervalosOcupados = await CentrosIntervalos.findAll({
            where: {
                dt_centro_intervalo_fecha: dt_centro_intervalo_fecha,
                int_centro_id: int_centro_id
            }
        });

        //obtengo todos los intervalos
        const intervalos = await Intervalos.findAll();

        //comparo los intervalos ocupados con los intervalos totales

        const intervalosDisponibles = intervalos.filter(intervalo => {
            return !intervalosOcupados.some(intervaloOcupado => intervaloOcupado.int_intervalo_id === intervalo.int_intervalo_id)
        });

        return res.json({
            status: true,
            message: "Intervalos disponibles",
            body: intervalosDisponibles,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    obtenerCentrosIntervalos,
    obtenerCentroIntervalo,
    crearCentroIntervalo,
    actualizarCentroIntervalo,
    obtenerDisponiblesPorFechaPorCentro
};

