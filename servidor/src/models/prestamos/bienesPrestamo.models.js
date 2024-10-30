import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Prestamo } from "./prestamo.models.js";

export const BienesPrestamo = sequelize.define(
    "tb_bienes_prestamo",
    {
        int_bienes_prestamo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_prestamo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Prestamo,
                key: "int_prestamo_id"
            }
        },
        str_codigo_bien: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_estado_tecnico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    },
    {
        schema: "prestamos",
        timestamps: false,
        freezeTableName: true //Evitar la pluralización de las tablas
    }
);

