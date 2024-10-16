import {DataTypes} from 'sequelize';
import {sequelize} from "../../database/database.js"

export const Custodios = sequelize.define(
    "tb_custodios",
    {
        int_custodio_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_custodio_cedula:{
            type: DataTypes.STRING(255)
        },
        str_custodio_nombre:{
            type: DataTypes.STRING(255)
        },
        str_custodio_estado:{
            type: DataTypes.STRING(255)
        },
        str_custodio_activo:{
            type: DataTypes.STRING(255)
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE
        },

    },
    {
        schema: "inventario",
        timestamps: false,
        
    }
);