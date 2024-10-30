import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const TecnicoMantenimiento = sequelize.define(
    "tb_tecnico_mantenimiento",
    {
        int_tecnico_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        str_tecnico_mantenimiento_nombre: {
            type: DataTypes.STRING(255),
        },
        str_tecnico_mantenimiento_cedula: {
            type: DataTypes.STRING(255),
        },
        str_tecnico_mantenimiento_estado: {
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
        freezeTableName:true
    }
);