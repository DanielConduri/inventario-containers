import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const BienesDocumento =sequelize.define
(
    "tb_bienes_documentos",
    {
        int_documento_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:false
        },
        str_codigo_bien:{
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },

    {
        schema: "inventario",
        timestamps: false,
    }

); 
