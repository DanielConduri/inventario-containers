import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Personas = sequelize.define(
  "tb_personas",
  {
    int_per_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    int_per_idcas:{
      type: DataTypes.INTEGER,
    },
    str_per_nombres: {
      type: DataTypes.STRING(255),
    },
    str_per_apellidos: {
      type: DataTypes.STRING(255),
    },
    str_per_email: {
      type: DataTypes.STRING(255),
    },
    str_per_cedula: {
      type: DataTypes.STRING(11),
    },
    str_per_cargo: {
      type: DataTypes.STRING(255),
    },
    str_per_telefono: {
      type: DataTypes.STRING(10),
    },
    str_per_tipo: {
      type: DataTypes.STRING(50),
    },
    str_per_estado: {
      type: DataTypes.STRING(50),
    },
    dt_fecha_creacion: {
      type: DataTypes.DATE,
    },
    dt_fecha_actualizacion: {
      type: DataTypes.DATE,
    },
  },
  {
    schema: "seguridad",
    timestamps: false,
  }
);
