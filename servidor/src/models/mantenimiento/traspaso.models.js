import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { MantenimientoCorrectivo } from "./mantenimientoCorrectivo.models.js";

export const Traspaso = sequelize.define(
    "tb_traspaso",
    {
        int_traspaso_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        int_mantenimiento_id: {
            type: DataTypes.INTEGER,
            references: {
                model: MantenimientoCorrectivo,
                key: "int_mantenimiento_id",
            },
        },
        str_traspaso_tecnico: {
            type: DataTypes.STRING(255),
        },
        str_traspaso_estado_tecnico: {
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
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
);