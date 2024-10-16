import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const Estado = sequelize.define(
    "tb_estado",
    {
        int_estadoMantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        str_estadoMantenimiento_descripcion: {
            type: DataTypes.STRING(255)
        },
        str_estadoMantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    }
)