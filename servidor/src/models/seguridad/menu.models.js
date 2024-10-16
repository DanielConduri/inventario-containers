import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Menu = sequelize.define(
  "tb_menus",
  {
    int_menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    int_menu_padre: {
      type: DataTypes.INTEGER,
    },
    str_menu_nombre: {
      type: DataTypes.STRING(255),
    },
    str_menu_descripcion: {
      type: DataTypes.STRING(255),
    },
    str_menu_path: {
      type: DataTypes.STRING(255),
    },
    str_menu_estado: {
      type: DataTypes.STRING(255),
    },
    str_menu_icono: {
      type: DataTypes.STRING(255),
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
