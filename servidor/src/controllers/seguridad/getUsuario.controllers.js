import { configVariables } from "../../config/variables.config.js";
import fetch from "node-fetch"; //para consumir una API
import https from "https";
const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales


//pendiente
export async function obtenerDatos (cedula) {
    try{
        const url = configVariables.urlServicioCentralizado + cedula;
        const response = await fetch(url, { agent });
        
        const body = await response.json();
        return body;
    } catch(error){
        return error;
    }

  }
  