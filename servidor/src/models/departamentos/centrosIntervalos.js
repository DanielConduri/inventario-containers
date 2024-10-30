import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Centros } from "./centros.models.js";
import { Intervalos } from "./intervalos.models.js";

export const CentrosIntervalos = sequelize.define(
    "tb_centros_intervalos",
    {
        int_centro_intervalo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        int_centro_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Centros,
                key: "int_centro_id",
            },
        },
        int_intervalo_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Intervalos,
                key: "int_intervalo_id",
            },
        },
        dt_centro_intervalo_fecha: {
            type: DataTypes.STRING(255),
        },
        str_centro_intervalo_estado: {
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
        schema: "inventario",
        timestamps: false,
        freezeTableName: true,
    }
);