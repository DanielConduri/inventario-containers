import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export const RegistroArchivos = sequelize.define(
    "tb_registro_archivos",
    {
        int_registro_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        str_registro_nombre: {
            type: DataTypes.STRING
        },
        str_registro_resolucion: {
            type: DataTypes.STRING
        },
        int_registro_num_filas_total: {
            type: DataTypes.INTEGER
        },
        int_registro_num_filas_insertadas: {
            type: DataTypes.INTEGER
        },
        int_registro_num_filas_no_insertadas: {
            type: DataTypes.INTEGER
        },
        dt_fecha_creacion: {
            type: DataTypes.DATE
        }
    },
    {
        schema: "inventario",
        timestamps: false,
    }
);

