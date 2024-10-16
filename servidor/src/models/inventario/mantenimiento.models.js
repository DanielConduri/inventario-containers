import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Mantenimiento = sequelize.define(
    'tb_bien_mantenimiento',
    {
        int_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
	    str_mantenimiento_codigo_bien:{
            type: DataTypes.STRING,
            allowNull: false
        },
	    str_mantenimiento_descripcion_problema:{
            type: DataTypes.STRING
        },
	    str_mantenimiento_descripcion_solucion: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_telefono: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_nivel_mantenimiento: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_tecnico_responsable: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_cedula_custodio: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_nombre_custodio: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_dependencia: {
            type: DataTypes.STRING
        },
	    str_mantenimiento_ubicacion: {
            type: DataTypes.STRING
        },
        str_mantenimiento_estado: {
            type: DataTypes.STRING
        },
        dt_fecha_ingreso: {
            type: DataTypes.DATE
        }
    },
    {
        schema: 'inventario',
        timestamps: false,
        freezeTableName: true //evitar plurarizar las tablas
    }
);