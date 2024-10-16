import app from "./app.js";
import { configVariables } from "../src/config/variables.config.js";
import { sequelize } from "./database/database.js";

import https from "https";
import fs from "fs";

async function main(port) {
  try {
    await sequelize.sync({ force: false });
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database:", error);
      });
    /*app.listen(configVariables.port);
    console.log("Servidor escuchando en el puerto", configVariables.port);*/

    // configura el puerto para escuchar peticiones

    // Si esta en produccion toma configuracion diferente respecto SSL
    console.log("NODE_ENV: ", process.env.NODE_ENV);
    if (process.env.NODE_ENV !== "production") {
      console.log("\n\n>> DEV\n\n");

      try {
        const options = {
          key: fs.readFileSync(
            "../cliente/src/assets/Certificados/STAR_espoch_edu_ec.key"
          ),
          cert: fs.readFileSync(
            "../cliente/src/assets/Certificados/STAR_espoch_edu_ec.crt"
          ),
        };
        https.createServer(options, app).listen(port, "0.0.0.0");
        console.log("Server on https://localhost:" + port);
        console.log("si ingresa")
      } catch (error) {
        console.error("Is not a DEV enviroment: ", error);
      }
    } else {
      console.log("\n\n>> PRODUCTION\n\n");
      app.listen(port);
      console.log("Server on port: ", port);
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main(configVariables.port);
