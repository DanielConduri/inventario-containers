import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";
import { Ubicaciones } from "../departamentos/ubicaciones.models.js";
import { Marcas } from "./marcas.models.js";


export const Bienes = sequelize.define(
    "tb_bienes", 
    {
        int_bien_id:{
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        },
        str_codigo_bien:{
            type: DataTypes.STRING
        },
        int_custodio_id:{
            type: DataTypes.INTEGER
        },
        int_condicion_bien_id:{
            type: DataTypes.INTEGER
        },
        int_bodega_id:{
            type: DataTypes.INTEGER
        },
        int_ubicacion_id:{
            type: DataTypes.INTEGER,
            references: {
                model: Ubicaciones,
                key: "int_ubicacion_id"
            }
        },
        /*
        int_centro_id:{
            type: DataTypes.INTEGER
        },*/
      
        int_codigo_bien_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            // references: {
            //     model:
            //     key
            // }
        },
        int_marca_id:{
            type: DataTypes.INTEGER,
            references: {
                model: Marcas,
                key: "int_marca_id"
            }
        },
        int_catalogo_bien_id:{
            type: DataTypes.INTEGER
        },
        int_proveedor_id:{
            type: DataTypes.INTEGER
        },
        int_bien_numero_acta:{
            type: DataTypes.INTEGER
        },
        str_bien_bld_bca:{
            type: DataTypes.STRING
        },
        str_bien_numero_compromiso:{
            type: DataTypes.STRING
        },
        str_bien_estado_acta:{
            type: DataTypes.STRING
        },
        str_bien_contabilizado_acta:{
            type: DataTypes.STRING
        },
        str_bien_nombre:{
            type: DataTypes.STRING(255)
        },
        str_bien_modelo:{
            type: DataTypes.STRING(255)
        },
        str_bien_serie:{
            type: DataTypes.STRING(255)
        },
        str_bien_valor_compra:{
            type: DataTypes.STRING
        },
        str_bien_recompra:{
            type: DataTypes.STRING
        },
        str_bien_color:{
            type: DataTypes.STRING(255)
        },
        str_bien_material:{
            type: DataTypes.STRING(255)
        },
        str_bien_dimensiones:{
            type: DataTypes.STRING(255)
        },
        /*str_bien_condicion:{
            type: DataTypes.STRING(255)
        },*/
        str_bien_habilitado:{
            type: DataTypes.STRING(255)
        },
        str_bien_version:{
            type: DataTypes.STRING(255)
        },
        str_bien_estado:{
            type: DataTypes.STRING(255)
        },
        str_bien_estado_logico:{
            type: DataTypes.STRING(255)
        },
        str_bien_origen_ingreso:{
            type: DataTypes.STRING(255)
        },
        str_bien_tipo_ingreso:{
            type: DataTypes.STRING(255)
        },
        dt_bien_fecha_compra:{
            type: DataTypes.STRING
        },
        str_bien_descripcion:{
            type: DataTypes.STRING(255)
        },
        str_bien_garantia: {
            type: DataTypes.STRING
        },
        int_bien_anios_garantia:{
            type: DataTypes.INTEGER
        },
        str_bien_info_adicional:{
            type: DataTypes.JSONB
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE
        },
        int_bien_estado_historial:
        {
            type: DataTypes.INTEGER
        },
    },
    {
        schema: 'inventario',
        timestamps: false, //desactivar la creación automática de dos columnas adicionales "createdAt" y "updatedAt".
    }
);