import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Soporte = sequelize.define(
    "tb_soporte",
    {
        int_soporte_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        str_soporte_descripcion: {
            type: DataTypes.STRING(255),
        },
        str_soporte_estado: {
            type: DataTypes.STRING(255),
            defaultValue: "ACTIVO",
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
        },

    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
);