import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const Centros = sequelize.define(
    "tb_centros",
    {
        int_centro_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        int_centro_tipo:{ 
            type: DataTypes.INTEGER
        },
        str_centro_tipo_nombre:{ 
            type: DataTypes.STRING 
        },
        int_centro_nivel:{ 
            type: DataTypes.INTEGER 
        },
        int_centro_sede_id:{
            type: DataTypes.INTEGER
        },
        str_centro_nombre_sede:{ 
            type: DataTypes.STRING 
        },
        str_centro_cod_facultad:{ 
            type: DataTypes.STRING
        },
        str_centro_nombre_facultad :{ 
            type: DataTypes.STRING
        },
        str_centro_cod_carrera:{ 
            type: DataTypes.STRING 
        },
        str_centro_nombre_carrera:{ 
            type: DataTypes.STRING
        },
        str_centro_nombre: { 
            type: DataTypes.STRING(255)
        },
        int_centro_id_dependencia:{ 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        str_centro_nombre_dependencia:{ 
            type: DataTypes.STRING 
        },
        int_centro_id_proceso:{ 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        str_centro_nombre_proceso:{ 
            type: DataTypes.STRING
        },
        str_centro_estado:{
            type: DataTypes.STRING
        },
    },
    {
        schema: "inventario",
        timestamps: false,
    }
);