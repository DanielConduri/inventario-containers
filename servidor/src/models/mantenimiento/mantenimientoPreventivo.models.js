import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { nivelMantenimiento } from "./nivelMantenimiento.models.js";
import { Planificacion } from "./planificacion.models.js";

export const MantenimientoPreventivo = sequelize.define(
  "tb_mantenimiento_preventivo",
  {
    int_mantenimiento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    str_codigo_bien: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    int_nivel_mantenimiento_id: {
      type: DataTypes.INTEGER,
      references: {
        model: nivelMantenimiento,
        key: "int_nivel_mantenimiento_id",
      },
    },
    int_planificacion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Planificacion,
        key: "int_planificacion_id",
      },
    },
    str_mantenimiento_descripcion: {
      type: DataTypes.TEXT,
    },
    str_mantenimiento_preventivo_estado: {
      type: DataTypes.STRING(255),
      defaultValue: "ACTIVO",
    },
    dt_fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dt_fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    str_mantenimiento_preventivo_responsable_nombre: {
      type: DataTypes.STRING(255),
    },
    str_mantenimiento_preventivo_responsable_id: {
      type: DataTypes.STRING(255),
    },
  },
  {
    schema: "mantenimiento",
    timestamps: false,
    freezeTableName: true,
  }
);
