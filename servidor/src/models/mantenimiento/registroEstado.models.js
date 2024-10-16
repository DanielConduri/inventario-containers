import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js"

export const registroEstado = sequelize.define(
    "tb_registroEstado",
    {
        int_registroEstado_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        int_persona_id: {
            type: DataTypes.INTEGER
        },
        int_estado_id: {
            type: DataTypes.INTEGER
        },
        str_registroEstado_estado: {
            type: DataTypes.STRING(255),
            defaultValue: 'ACTIVO'
        },
        str_registroEstado_observacion: {
            type: DataTypes.TEXT
        },
        dt_registroEstado_fecha: {
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