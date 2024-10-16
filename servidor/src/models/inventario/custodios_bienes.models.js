import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const CustodiosBien = sequelize.define(
    'tb_custodio_bien',
    {
        int_custodio_bien_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        int_custodio_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        int_bien_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        str_persona_bien_estado: 
        {
            type: DataTypes.STRING(50),
            defaultValue: "ACTIVO",
        },
        str_persona_bien_activo:    
        {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dt_fecha_creacion:
        {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        
        },
        

    },
    
    
    {
        schema: 'inventario',
        timestamps: false,
        freezeTableName: true,
        
    }
);



