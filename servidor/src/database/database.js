import { Sequelize } from "sequelize";
import { dbVariables, dbVariables2 } from "../config/variables.config.js";

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

export const secondDB = new Sequelize(
  dbVariables2.dbDatabase2,
  dbVariables2.dbUser2,
  dbVariables2.dbPassword2,
  {
    host: dbVariables2.dbServer2,
    dialect: "postgres",
    port: dbVariables2.dbPort2,
  }
);







