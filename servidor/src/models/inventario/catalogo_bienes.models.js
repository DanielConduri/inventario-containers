import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const  CatalogoBienes = sequelize.define(
    "tb_catalogo_bienes",
    {
        int_catalogo_bien_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        str_catalogo_bien_id_bien: {
            type: DataTypes.STRING
        },
        str_catalogo_bien_descripcion: {
            type: DataTypes.STRING
        },
        str_catalogo_bien_estado: {
            type: DataTypes.STRING
        },
        int_catalogo_bien_item_presupuestario: {
            type: DataTypes.INTEGER
        },
        str_catalogo_bien_cuenta_contable: {
            type: DataTypes.STRING
        },
        dt_fecha_actualizacion: {
            type: DataTypes.TIME
        }


    },
    {
        schema: 'inventario',
        timestamps: false,
    }
);