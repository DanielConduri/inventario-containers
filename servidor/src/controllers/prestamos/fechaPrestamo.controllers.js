import { FechaPrestamo } from "../../models/prestamos/fechaPrestamo.models.js";
import { Prestamo } from "../../models/prestamos/prestamo.models.js";
import { Horario } from "../../models/horario/horario.model.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearFechaPrestamo = async (req, res) => {
    try{
        const { prestamoId, horarioId} = req.body;

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear la fecha del prestamo ${error}`,
            data: {}
        });
    
    }
}

const obtenerFechaPrestamo = async (req, res) => {
    try {
        const fechaPrestamo = await FechaPrestamo.findAll();
        return res.json({
            status: true,
            message: "Fecha de prestamo encontrada",
            body: fechaPrestamo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener la fecha del prestamo ${error}`,
            data: {}
        });
    }

}

export default {
    crearFechaPrestamo,
    obtenerFechaPrestamo
}