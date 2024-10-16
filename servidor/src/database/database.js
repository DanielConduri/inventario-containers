import { Sequelize } from "sequelize";
import {dbVariables} from "../config/variables.config.js";

export const sequelize = new Sequelize(
  dbVariables.dbName,
  dbVariables.dbUser,
  dbVariables.dbPassword,
  {
    host: dbVariables.dbServer,
    logging:false,
    dialect: dbVariables.dbDialect,
    port: dbVariables.dbPort
  }
);



// export const sequelize = new Sequelize(
//   'db_inventario_local',
//   dbVariables.dbUser,
//   'backend',
//   {
//     host:'localhost',
//     logging:false,
//     dialect: dbVariables.dbDialect,
//   //port: 3311
//   }
// );





