import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Permisos = sequelize.define(
    "tb_permisos",
    {
        int_permiso_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        int_perfil_id:{
            type: DataTypes.INTEGER
        },
        int_menu_id:{
            type: DataTypes.INTEGER
        },
        str_permiso_estado:{
            type: DataTypes.STRING(255)
        },
        bln_ver :{
            type: DataTypes.BOOLEAN
        },
        bln_crear :{
            type: DataTypes.BOOLEAN
        },
        bln_editar :{
            type: DataTypes.BOOLEAN
        },
        bln_eliminar :{
            type: DataTypes.BOOLEAN
        },
        dt_fecha_creacion:{
            type: DataTypes.DATE
        },
        dt_fecha_actualizacion:{
            type: DataTypes.DATE
        },
    },
    {
        schema: 'seguridad',
        timestamps: false,
    }
);
