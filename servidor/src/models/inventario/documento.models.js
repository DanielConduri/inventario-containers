import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const Documento = sequelize.define(
    "tb_documentos",
    {
        int_documento_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_documento_id:{
            type: DataTypes.STRING(255)
        },
        int_tipo_documento_id:{
            type: DataTypes.INTEGER
        },
        str_documento_fecha:{
           type:DataTypes.TEXT
        },
        str_documento_estado:{
            type: DataTypes.STRING(255)
        },
        str_documento_titulo:{
            type: DataTypes.TEXT
        },
        str_documento_peticion:{
            type: DataTypes.STRING(255)
        },
        str_documento_recibe:{
            type: DataTypes.STRING(255)
        },
        str_documento_introduccion:{
            type: DataTypes.TEXT
        },
        str_documento_desarrollo:{
            type: DataTypes.TEXT
        },
        str_documento_conclusiones:{
            type: DataTypes.TEXT
        },
        str_documento_recomendaciones:{
            type: DataTypes.TEXT
        },
        str_documento_estado:{
            type: DataTypes.STRING(255)
        },
        dt_fecha_impresion:{
            type: DataTypes.DATE
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

    },
    {
        schema: 'inventario',
        timestamps: false,
    }
);

