import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const Proveedores = sequelize.define(
    "tb_proveedores",
    {
        int_proveedor_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_proveedor_ruc:{
            type: DataTypes.STRING(15)
        },
        str_proveedor_nombre:{
            type: DataTypes.STRING(255)
        },
        str_proveedor_estado:{
            type: DataTypes.STRING(50)
        },
        dt_fecha_creacion:{
            type:DataTypes.DATE
        },
    
    },
    {
       schema: 'inventario',
       timestamps: false, 

    }
);