import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"
import { nivelMantenimiento } from "./nivelMantenimiento.models.js";
import { EstadoMantenimiento } from "./estado.models.js";


export const MantenimientoCorrectivo = sequelize.define(
    "tb_mantenimiento_correctivo",
    {
        int_mantenimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_nivel_mantenimiento_id: {
            type: DataTypes.INTEGER,
            references: {
                model: nivelMantenimiento,
                key: "int_nivel_mantenimiento_id"
            }
        },
        int_estado_mantenimiento_id: {
            type: DataTypes.INTEGER,
            references: {
                model: EstadoMantenimiento,
                key: "int_estado_mantenimiento_id"
            }
        },
        int_bien_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        str_codigo_bien: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        str_mantenimiento_correctivo_custodio:{ // custodio a la fecha de mantenimiento
            type: DataTypes.STRING(255)
    
        },
        str_mantenimiento_correctivo_motivo: {
            type: DataTypes.TEXT
        },

        int_mantenimiento_diagnostico: {
            type: DataTypes.TEXT
        },
        str_mantenimiento_correctivo_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        dt_mantenimiento_correctivo_fecha_revision: {
            type: DataTypes.STRING(255)
        },
        str_mantenimiento_correctivo_tecnico_responsable:{
            type: DataTypes.STRING(255)
        },
        str_mantenimiento_correctivo_dependencia: {
            type: DataTypes.TEXT
        },
        str_mantenimiento_correctivo_telefono: {
            type: DataTypes.TEXT
        },
        dt_mantenimiento_correctivo_fecha_entrega: {
            type: DataTypes.STRING(255)
        },
        str_mantenimiento_correctivo_descripcion_solucion: {
            type: DataTypes.TEXT
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
        schema: "mantenimiento",
        timestamps: false,
        freezeTableName:true
    }
)