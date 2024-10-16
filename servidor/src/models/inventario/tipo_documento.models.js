import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const TipoDocumento = sequelize.define(
    "tb_tipo_documentos",
    {
        int_tipo_documento_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_tipo_documento_nombre:{ 
            type: DataTypes.STRING(255)
        },
        str_tipo_documento_descripcion:{
            type: DataTypes.TEXT
        },
        str_tipo_documento_estado:{
            type: DataTypes.STRING(255)
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
