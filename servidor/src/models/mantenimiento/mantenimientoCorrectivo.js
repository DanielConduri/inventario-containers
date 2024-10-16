import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const mantenimientoCorrectivo = sequelize.define(
    "tb_registro_correctivo",
    {
        int_correctivo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_bien_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        str_correctivo_problema: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_correctivo_solucion: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_correctivo_telefono: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        int_correctivo_nivel_mantenimiento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        /*str_correctivo_nombre_mantenimiento: {
            type: DataTypes.STRING(255),
            allowNull: false
        },*/
        str_correctivo_nombre_nivel_mantenimiento: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_correctivo_tecnico_responsable: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_correctivo_cedula_custodio: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        str_correctivo_nombre_custodio: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dt_fecha_ingreso: {
            type: DataTypes.DATE,
        },
        dt_fecha_entrega: {
            type: DataTypes.DATE,
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true  
    }
);