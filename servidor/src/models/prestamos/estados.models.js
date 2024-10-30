import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"


export const EstadoPrestamo = sequelize.define(
    "tb_estado_prestamo",
    {
        int_estado_prestamo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        str_estado_prestamo_nombre: {
            type: DataTypes.STRING(255)
        },
        str_estado_prestamo_descripcion: {
            type: DataTypes.TEXT
        },
        str_estado_prestamo_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        schema: "prestamos",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    }
)