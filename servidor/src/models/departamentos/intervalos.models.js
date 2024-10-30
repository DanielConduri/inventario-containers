import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Intervalos = sequelize.define(
    "tb_intervalos",
    {
        int_intervalo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tm_intervalo_inicio: {
            type: DataTypes.TIME,
        },
        tm_intervalo_fin: {
            type: DataTypes.TIME,
        },
        str_intervalo_estado: {
            type: DataTypes.STRING(255),
            defaultValue: "ACTIVO",
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        schema: "inventario",
        timestamps: false,
        freezeTableName: true,
    }
);