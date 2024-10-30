import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const EstadoMantenimiento = sequelize.define(
    "tb_estado_mantenimiento",
    {
        int_estado_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        str_estado_mantenimiento_nombre: {
            type: DataTypes.STRING(255)
        },
        str_estado_mantenimiento_descripcion: {
            type: DataTypes.TEXT
        },
        str_estado_mantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dt_fecha_actualizacion: {
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