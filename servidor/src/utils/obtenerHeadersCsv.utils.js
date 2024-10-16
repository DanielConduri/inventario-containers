import csv from "csv-parser";
import fs from "fs";

 async function obtenerPrimeraFila(path) {
    return new Promise((resolve, reject) => {
      const results = [];
  
      fs.createReadStream(path)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", () => {
          resolve(results[0]);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
}



  export default obtenerPrimeraFila;