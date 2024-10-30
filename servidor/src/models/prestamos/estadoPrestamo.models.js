import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"
import { EstadoPrestamo } from "./estados.models.js"
import { Prestamo } from "./prestamo.models.js"

export const EstadosPrestamo = sequelize.define(
    "tb_estados_prestamo",
    {
        int_estados_prestamo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_estado_id: {
            type: DataTypes.INTEGER,
            references: {
                model: EstadoPrestamo,
                key: "int_estado_prestamo_id"
            }
        },
        int_prestamo_id:{
            type: DataTypes.INTEGER,
            references:{
                model: Prestamo,
                key: "int_prestamo_id"
            }
        },
        str_estados_prestamo_nombre: {
            type: DataTypes.BOOLEAN,
        },
        str_estados_observacion: {
            type: DataTypes.TEXT
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        int_prestamo_estado:{
            type: DataTypes.INTEGER,

        },
        bl_prestamo_observacion:{
            type: DataTypes.BOOLEAN
        }
    },
    {
        schema: "prestamos",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    }
)