import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const TipoMantenimiento = sequelize.define(
    "tb_tipo_mantenimiento",
    {
        int_tipo_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        str_tipo_mantenimiento_descripcion: {
            type: DataTypes.STRING(255),
        },
        str_tipo_mantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: "ACTIVO",
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        int_soporte_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
);	