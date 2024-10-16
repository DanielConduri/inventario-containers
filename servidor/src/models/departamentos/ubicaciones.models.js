import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Ubicaciones = sequelize.define(
    "tb_ubicaciones",
    {
        int_ubicacion_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        int_ubicacion_cod: {
            type: DataTypes.INTEGER,
        },
        str_ubicacion_nombre: {
            type: DataTypes.STRING 
        }, 
        dt_fecha_actualizacion: {
            type: DataTypes.DATE

        }

    },
    {
        schema: "inventario",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    },
);