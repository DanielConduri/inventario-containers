import { configVariables } from "../../config/variables.config.js";
import fetch from "node-fetch"; //para consumir una API
import https from "https";
const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales

export const obtenerUsuariosCentralizado = async (req, res) => {
  try {
    console.log("Entra a buscar cedula");
    const { cedula } = req.params;

    const url = configVariables.urlServicioCentralizado + cedula;
    const response = await fetch(url, { agent });
    const body = await response.json();

    //console.log("usuario centralizado", body);
    if (body.success == false) {
      return res.json({
        status: false,
        message: "Verifique que la cédula sea correcta",
        body: body,
      });
    }

    const apellidos =
      body.listado[0].per_primerApellido + " " + body.listado[0].per_segundoApellido;
    const datosUsuario = {
      per_id: body.listado[0].per_id,
      nombre: body.listado[0].per_nombres,
      apellidos: apellidos,
      correo: body.listado[0].per_email,
    };
    res.json({
      status: true,
      message: "Usuario obtenido",
      body: datosUsuario,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  obtenerUsuariosCentralizado,
};
