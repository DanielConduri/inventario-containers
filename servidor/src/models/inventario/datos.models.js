import { DataTypes } from "sequelize";
import {sequelize } from "../../database/database.js";

export const Datos = sequelize.define(
    "tb_datos",
    {
        int_data_id:{
          type: DataTypes.INTEGER,
          autoIncrement: true
        },
        codigo_bien: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        codigo_anterior_bien: {
          type: DataTypes.INTEGER
        },
        identificador: {
          type: DataTypes.STRING
        },
        num_acta_matriz: {
          type: DataTypes.STRING
        },
        bdl_cda: {
          type: DataTypes.STRING
        },
        bien: {
          type: DataTypes.STRING
        },
        serie_identificacion: {
          type: DataTypes.STRING
        },
        modelo_caracteristicas: {
          type: DataTypes.STRING
        },
        marca_raza_otros: {
          type: DataTypes.STRING
        },
        critico: {
          type: DataTypes.BOOLEAN
        },
        moneda: {
          type: DataTypes.STRING
        },
        valor_compra: {
          type: DataTypes.STRING
        },
        recompra: {
          type: DataTypes.STRING
        },
        color: {
          type: DataTypes.STRING
        },
        material: {
          type: DataTypes.STRING
        },
        dimensiones: {
          type: DataTypes.STRING
        },
        condicion_bien: {
          type: DataTypes.STRING
        },
        habilitado: {
          type: DataTypes.BOOLEAN
        },
        estado_bien: {
          type: DataTypes.STRING
        },
        id_bodega: {
          type: DataTypes.INTEGER
        },
        bodega: {
          type: DataTypes.STRING
        },
        id_ubicacion: {
          type: DataTypes.INTEGER
        },
        ubicacion_bodega: {
          type: DataTypes.STRING
        },
        cedula_ruc: {
          type: DataTypes.STRING
        },
        custodio_actual: {
          type: DataTypes.STRING
        },
        custodio_activo: {
          type: DataTypes.STRING
        },
        origen_ingreso: {
          type: DataTypes.STRING
        },
        tipo_ingreso: {
          type: DataTypes.STRING
        },
        num_compromiso: {
          type: DataTypes.STRING
        },
        estado_acta: {
          type: DataTypes.STRING
        },
        contabilizado_acta: {
          type: DataTypes.STRING
        },
        contabilizado_bien: {
          type: DataTypes.STRING
        },
        descripcion: {
          type: DataTypes.STRING
        },
        item_reglon: {
          type: DataTypes.STRING
        },
        cuenta_contable: {
          type: DataTypes.STRING
        },
        depreciable: {
          type: DataTypes.BOOLEAN
        },
        fecha_ingreso: {
          type: DataTypes.STRING
        },
        fecha_creacion: {
          type: DataTypes.STRING
        },
        fecha_ultima_depreciacion: {
          type: DataTypes.STRING
        },
        vida_util: {
          type: DataTypes.INTEGER
        },
        fecha_termino_depreciacion: {
          type: DataTypes.STRING
        },
        valor_contable: {
          type: DataTypes.STRING
        },
        valor_residual: {
          type: DataTypes.STRING
        },
        valor_libros: {
          type: DataTypes.STRING
        },
        valor_depreciacion_acumulada:{
            type:DataTypes.STRING
        },
        comodato:{
            type:DataTypes.STRING
        },
        ruc:{
          type:DataTypes.STRING 
        },
        proveedor:{
          type:DataTypes.STRING
        },
        garantia:{
          type:DataTypes.STRING
        },
        anios_garantia:{
          type:DataTypes.INTEGER
        },
    },
    {
        schema: 'inventario',
        timestamps: false,
    }
)