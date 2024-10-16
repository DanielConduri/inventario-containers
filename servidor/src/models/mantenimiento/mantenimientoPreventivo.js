import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const mantenimientoPreventivo = sequelize.define(
    "tb_registro_preventivo",
    {
        int_preventivo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_bien_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        str_preventivo_tipo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_preventivo_descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_preventivo_centro: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_preventivo_tecnico_responsable: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dt_fecha_mantenimiento: {
            type: DataTypes.DATE,
        },
        /*str_preventivo_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },*/
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true //Evitar pluralización de las tablas
    }
)
