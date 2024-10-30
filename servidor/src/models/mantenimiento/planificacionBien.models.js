import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Planificacion } from "./planificacion.models.js";
export const PlanificacionBien = sequelize.define(
  "tb_planificacion_bien",
  {
    int_planificacion_bien_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    str_codigo_bien: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    int_planificacion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Planificacion,
        key: "int_planificacion_id",
      },
    },
    dt_fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    str_planificacion_bien_estado: {
      type: DataTypes.STRING(255),
      defaultValue: "ACTIVO",
    },
    dt_fecha_actualizacion: {
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
