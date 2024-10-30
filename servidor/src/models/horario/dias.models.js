import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Dias = sequelize.define(
    "tb_dias",
    {
        int_dia_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_dia_nombre: {
            type: DataTypes.STRING
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        int_dia_orden: {
            type: DataTypes.INTEGER
        },

    },
    {
        schema: "horario",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    },
);