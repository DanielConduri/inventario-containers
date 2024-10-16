import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const Estados = sequelize.define(
    "tb_estados",
    {
        int_estado_bien_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_estado_bien_nombre:{
            type: DataTypes.STRING(100)
        },
        str_estado_bien_estado:{
            type: DataTypes.STRING(50)
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE
        }
    },
    {
        schema: 'inventario',
        timestamps: false,
    }
);

