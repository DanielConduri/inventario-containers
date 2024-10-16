import { sequelize } from "../../database/database.js";
import { QueryTypes } from "sequelize";
import https from "https";
import { jwtVariables } from "../../config/variables.config.js";
import { parseXML } from "../../utils/parser.xml.utils.js";
import jwt from "jsonwebtoken";
import { Console } from "console";

const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuario = await sequelize.query(
      `SELECT * FROM seguridad.tb_personas`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!usuario || usuario.length === 0) {
      return res.json({
        status: 404,
        message: "El usuario no se encontró",
        body: usuario,
      });
    } 
    res.json({
        status: 200,
        message: "Usuario encontrado",
        body: usuario,
      });



  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
};

export const validarLogin = async (req, res) => {
  try {
    console.log("Logueando");
    console.log(req.body);
    const { xmlDatosCas } = req.body;
    console.log(xmlDatosCas);
    const datosCas = await parseXML(xmlDatosCas);
    if(!datosCas){
      return res.json({
        status: false,
        message:"Ticket invalido",
      });
    }
    console.log(datosCas.perId);
    //Obtener los datos del usuario
    const usuario = await sequelize.query(
      `SELECT * FROM seguridad.tb_personas WHERE int_per_idcas = ${datosCas.perId}`,
      { type: QueryTypes.SELECT }
    );
    console.log(usuario);
      //Validar si el usuario existe en la base de datos
    if (!usuario || usuario.length === 0) {
      return res.json({
        status: false,
        message: "El usuario no se encontró en la base de Datos",
        body: usuario,
      });
    }
    if(usuario[0].str_per_estado === 'INACTIVO'){
      return res.json({
        status: false,
        message: "El usuario se encuentra inactivo, comuniquese con el administrador del sistema",
        body: 0,
      });
    }

    //obtener el perfil publico
    const perfiles = await sequelize.query(`SELECT * FROM seguridad.f_listar_perfiles_usuario('${datosCas.perId}') `, { type: QueryTypes.SELECT } );
    
    //Validar si el usuario tiene perfiles asignados
    if (!perfiles || perfiles.length === 0) {
      return res.json({
        status: false,
        message: "El usuario no tiene perfiles asignados",
        body: perfiles,
      });
    }

    const usuarioToken = {
      idCas: datosCas.perId,
      perfil_id: perfiles[0].perfil_id,
      rol_id: perfiles[0].rol_id,
    };
 
    const token = jwt.sign(usuarioToken, jwtVariables.jwtSecret, {
      expiresIn: "7d",
    });

    //cambiar nombre del token
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // que sea misma hora que el token
      httpOnly: false,
      sameSite: "none",
      secure: true,
      damin:"localhost"
    });

    res.json({
      status: "success",
      message: "Existe el usuario",
      datosCas: {
        casUser: usuario,
      },
      accessToken: token,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
    
  }
};


export default {
  obtenerUsuarios,
  validarLogin,
};
