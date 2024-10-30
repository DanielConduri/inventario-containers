import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Dias } from "./dias.models.js";
import { Centros } from "../departamentos/centros.models.js";

export const Horario = sequelize.define(
    "tb_horario",
    {
        int_horario_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        int_centro_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Centros,
                key: 'int_centro_id'
            }
        },
        int_dia_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Dias,
                key: 'int_dia_id'
            }
        },
        tm_horario_hora_inicio: {
            type: DataTypes.TIME
        },
        tm_horario_hora_fin: {
            type: DataTypes.TIME
        },
        dt_fecha_actualizacion: {
            type: DataTypes.DATE
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        str_horario_estado: {
            type: DataTypes.STRING,
            defaultValue: 'ACTIVO'
        },
    },
    {
        schema: "horario",
        timestamps: false,
        freezeTableName:true //Evitar la pluralización de las tablas
    },
);

Horario.belongsTo(Dias, { foreignKey: 'int_dia_id' });
Dias.hasMany(Horario, { foreignKey: 'int_dia_id' });

