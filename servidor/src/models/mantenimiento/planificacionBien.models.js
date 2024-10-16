import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const PlanificacionBien = sequelize.define(
  "tb_planificacionBien",
  {
    int_planificacionBien_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    int_bien_id: {
      type: DataTypes.INTEGER,
    },
    str_planificacionBien_motivo: {
      type: DataTypes.TEXT,
    },
    str_planificacionBien_diagnostico: {
      type: DataTypes.TEXT,
    },
    int_persona_id: {
      type: DataTypes.INTEGER,
    },
    dt_fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    str_planificacionBien_estado: {
      type: DataTypes.STRING(255),
      defaultValue: "ACTIVO",
    },
  },
  {
    schema: "mantenimiento",
    timestamps: false,
    freezeTableName:true
  }
);
