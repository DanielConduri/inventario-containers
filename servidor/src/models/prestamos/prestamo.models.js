import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Bienes } from "../inventario/bienes.models.js";
import { Horario } from "../horario/horario.model.js";
import { EstadoPrestamo } from "./estados.models.js"


export const Prestamo = sequelize.define(
    "tb_prestamo",
    {
        int_prestamo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_horario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Horario,
                key: "int_horario_id"
            }
        },
        // int_estado_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: EstadoPrestamo,
        //         key: "int_estado_prestamo_id"
        //     }
        // },
        str_prestamo_codigo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        int_prestamo_persona_id:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_prestamo_persona_nombre:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        int_prestamo_custodio_id:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_prestamo_custodio_nombre:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_prestamo_objeto_investigacion:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        // str_prestamo_observacion: {
        //     type: DataTypes.TEXT
        // },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        str_documento_base64:{ 
            type: DataTypes.TEXT,
            allowNull: true
        },
        str_prestamo_induccion:{
            type: DataTypes.STRING(2),
            allowNull: false
        },
        str_direcion_onedrive:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        str_prestamo_revision_custodio:{
            type: DataTypes.TEXT,
            // allowNull: false
        },
        str_prestamo_revision_persona:{
            type: DataTypes.TEXT,
            // allowNull: false
        },
        // dt_fecha_salida: {
        //     type: DataTypes.DATE,
        //    // allowNull: false
        // },
        // dt_fecha_devolucion: {
        //     type: DataTypes.DATE,
        //     //allowNull: false
        // },
    },
    {
        schema: "prestamos",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    }
)
