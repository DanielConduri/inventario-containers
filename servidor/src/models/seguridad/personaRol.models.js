import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const personaRol = sequelize.define("tb_perfiles",
    {
        int_perfil_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        int_per_id: {
            type: DataTypes.INTEGER,
        },
        int_rol_id: {
            type: DataTypes.INTEGER,
        },
        str_perfil_estado: {
            type: DataTypes.STRING(15),
        },
        str_perfil_dependencia: {
            type: DataTypes.STRING(255),
        },
    },{
        schema:'seguridad',
        timestamps: false,
    }
);