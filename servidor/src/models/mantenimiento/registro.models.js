import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const Registro = sequelize.define(
    "tb_registro",
    {
        int_registro_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_soporte_id: {
            type: DataTypes.INTEGER
        },
        str_registro_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        str_registro_fecha: {
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