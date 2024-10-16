import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";


export const Roles = sequelize.define("tb_roles", {
    int_rol_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    str_rol_nombre:{
        type: DataTypes.STRING(255),
    },
    str_rol_descripcion:{
        type: DataTypes.STRING(255),
    },
    str_rol_estado: {
        type: DataTypes.STRING(25),
    },
},{
    schema:'seguridad',
    timestamps: false
});
