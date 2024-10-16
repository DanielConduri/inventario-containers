import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
export const PersonaDocumento =sequelize.define
(
    "tb_persona_documentos",
    {
        int_documento_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        int_per_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        str_per_nombres:{
            type: DataTypes.STRING,
        },
    },
    {
        schema: "inventario",
        timestamps: false,
    }
);
