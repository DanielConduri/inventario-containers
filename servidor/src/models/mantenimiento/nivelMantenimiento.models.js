import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { TipoMantenimiento } from "./tipoMantenimiento.models.js";
import {Soporte} from "./soporte.models.js";

export const nivelMantenimiento = sequelize.define(
    "tb_nivel_mantenimiento",
    {
        int_nivel_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        str_nivel_mantenimiento_descripcion: {
            type: DataTypes.TEXT,
        },
        str_nivel_mantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: "ACTIVO",
        },
        int_tipo_mantenimiento_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TipoMantenimiento,
                key: "int_tipo_mantenimiento_id",
            },
        },
        int_soporte_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Soporte,
                key: "int_soporte_id",
            },
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
        freezeTableName: true
    }
);