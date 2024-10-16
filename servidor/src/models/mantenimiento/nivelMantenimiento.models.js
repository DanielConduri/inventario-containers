import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const nivelMantenimiento = sequelize.define(
    "tb_nivelMantenimiento",
    {
        int_nivelMantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        str_nivelMantenimiento_descripcion: {
            type: DataTypes.STRING(255),
        },
        str_nivelMantenimiento_estado: {
            type: DataTypes.STRING(255),
            defaultValue: "ACTIVO",
        },
        int_tipoMantenimiento_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
{ 
    schema: "mantenimiento",
    timestamps: false,
    freezeTableName:true
}
);