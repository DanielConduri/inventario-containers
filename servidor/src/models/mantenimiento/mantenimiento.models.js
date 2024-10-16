import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const Mantenimiento = sequelize.define(
    "tb_mantenimiento",
    {
        int_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_registroBien_id: {
            type: DataTypes.INTEGER
        },
        int_nivelMantenimiento_id: {
            type: DataTypes.INTEGER
        },
        int_mantenimiento_diagnostico: {
            type: DataTypes.TEXT
        },
        str_mantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        dt_mantenimiento_fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
)