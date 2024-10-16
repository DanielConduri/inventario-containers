import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

var fecha = "2023-03-17T22:43:19.296Z";
 
export const Marcas = sequelize.define(
    "tb_marcas",
    {
        int_marca_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_marca_nombre:{
            type: DataTypes.STRING(50)
        },

        str_marca_estado:{
            type: DataTypes.STRING(2)
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE,
        },

    },
    {
        schema: 'inventario',
        timestamps: false,
    }
);