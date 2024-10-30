import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";


export const Planificacion = sequelize.define(
    "tb_planificacion",
    {
        int_planificacion_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        str_planificacion_codigo: {
            type: DataTypes.STRING(255),
        },
        dt_fecha_inicio: {
            type: DataTypes.DATE,
        },
        dt_fecha_fin: {
            type: DataTypes.DATE,
        },
        str_planificacion_estado: {
            type: DataTypes.STRING(255),
        },
        int_planificacion_cantidad_bienes: {
            type: DataTypes.INTEGER,
        },
        str_planificacion_centro: {
            type: DataTypes.STRING(255),
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        int_ubicacion_id: {
            type: DataTypes.INTEGER,
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
);