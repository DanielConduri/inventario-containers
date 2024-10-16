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
      app.listen(port, "0.0.0.0", () => {
        console.log(`>> Server DEMON BD /  on port: ${port}\n\n`)
      });
      console.log("Server on port: ", port);

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main(configVariables.demonPort);
