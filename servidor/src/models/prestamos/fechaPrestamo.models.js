import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Prestamo } from "../prestamos/prestamo.models.js";
import { Horario } from "../horario/horario.model.js";

export const FechaPrestamo = sequelize.define(
    "tb_fecha_prestamo",
    {
        int_fecha_prestamo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        int_prestamo_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Prestamo,
                key: "int_prestamo_id",
            },
        },
        int_horario_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Horario,
                key: "int_horario_id",
            },
        },
        dt_fecha_prestamo: {
            type: DataTypes.DATE,
        },
        dt_fecha_devolucion: {
            type: DataTypes.DATE,
            allowNull: true

        },
        dt_fecha_creacion_prestamo:{
            type: DataTypes.DATE,
            // defaultValue: DataTypes.NOW
        },
        str_estado_fecha_prestamo: {
            type: DataTypes.STRING(255),
        },
    },
    {
        schema: "prestamos",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    }
)