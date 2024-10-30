import { Op } from "sequelize";
import { sequelize } from "../database/database.js";
import { Dias } from "../models/horario/dias.models.js";


//funcion para crear los dias de Lunes a Viernes
export const createDias = async () => {
    try {
        const dias = [
            {
                str_dia_nombre: "Lunes",
                int_dia_orden: 1
            },
            {
                str_dia_nombre: "Martes",
                int_dia_orden: 2
            },
            {
                str_dia_nombre: "Miércoles",
                int_dia_orden: 3
            },
            {
                str_dia_nombre: "Jueves",
                int_dia_orden: 4
            },
            {
                str_dia_nombre: "Viernes",
                int_dia_orden: 5
            }
        ];
        await Dias.bulkCreate(dias);

    } catch (error) {
        console.error("Error creating dias: ", error);
    }
};
