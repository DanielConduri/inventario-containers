import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Auditoria = sequelize.define(
    "tb_auditoria",
    {
        lng_id_auditoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        int_id_usuario: {
            type: DataTypes.INTEGER,
        },
	    dt_fecha: {
            type: DataTypes.DATE,
        },
        str_hora: {
            type: DataTypes.STRING(10),
        },
	    str_ip_host:{
            type: DataTypes.STRING(16),
        },
        str_nombre_host:{
                type: DataTypes.STRING(100),
        },
        str_nombre_tabla:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        str_accion:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        str_descripcion:{
            type: DataTypes.STRING(500),
        },
        str_valor_antiguo:{
            type: DataTypes.JSON,
        },
        str_valor_nuevo:{
            type: DataTypes.JSON,
        },
    },
    {
        schema: "auditoria",
        timestamps: false,
    }
);