import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const registroBien = sequelize.define(
    "tb_registroBien",
    {
        int_registroBien_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_bien_id: {
            type: DataTypes.INTEGER,
        },
        int_registro_id: {
            type: DataTypes.INTEGER
        },
        str_registroBien_motivo: {
            type: DataTypes.TEXT
        },
        str_registroBien_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        str_registroBien_fecha: {
            type: DataTypes.DATE,
            defaultValueL: DataTypes.NOW
        }
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
)