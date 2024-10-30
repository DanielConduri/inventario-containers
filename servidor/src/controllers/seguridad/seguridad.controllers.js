import { sequelize } from "../../database/database.js";
import { QueryTypes } from "sequelize";
import https from "https";
import { jwtVariables } from "../../config/variables.config.js";
import { parseXML } from "../../utils/parser.xml.utils.js";
import jwt from "jsonwebtoken";
// import { Console } from "console";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
import { configVariables } from "../../config/variables.config.js";

import { Roles } from "../../models/seguridad/roles.models.js";
import { personaRol } from "../../models/seguridad/personaRol.models.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { Menu } from "../../models/seguridad/menu.models.js";
import { Permisos } from "../../models/seguridad/permisos.models.js";


import crypto from "crypto";
import fetch from "node-fetch";

/////////// talento humano ///////////

const httpsAgentOptions = {
  secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
};

httpsAgentOptions.rejectUnauthorized = false;
const httpsAgent = new https.Agent(httpsAgentOptions);

//////////////////////////////////////////////////

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

  }
};

export const validarLogin = async (req, res) => {
  try {


    const { xmlDatosCas } = req.body;

    const datosCas = await parseXML(xmlDatosCas);
    if (!datosCas) {
      return res.json({
        status: false,
        message: "Ticket invalido",
      });
    }
    console.log(datosCas);
    //Obtener los datos del usuario
    const usuario = await sequelize.query(
      `SELECT * FROM seguridad.tb_personas WHERE int_per_idcas = ${datosCas.perId}`,
      { type: QueryTypes.SELECT }
    );

    //Validar si el usuario existe en la base de datos
    if (!usuario || usuario.length === 0) {
      const vecPersona = {
        usuSerId: 26,
        usuPassword: '0604508390',
      };

      const url = configVariables.RUTA_TOKEN_TTHH;

      const response = await fetch(url, { agent: httpsAgent, method: 'POST', body: JSON.stringify(vecPersona), headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      const body = await response.json();
      const claveServicio = body.token;

      const vecPersona2 = {
        perCedula: datosCas.casCedula
      };

      const url2 = configVariables.CARGO_DEPENCENCIA;

      const response2 = await fetch(url2, {
        agent: httpsAgent, method: 'POST', body: JSON.stringify(vecPersona2), headers:
        {
          'Authorization': 'Bearer ' + claveServicio,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

      const body2 = await response2.json();

      const dataEmpleado = body2;

      console.log('DATA EMPLEADO -->', dataEmpleado)

      const cedula = datosCas.casCedula;
    const url1 = configVariables.urlServicioCentralizado + cedula;

    const response1 = await fetch(url1, { agent: httpsAgent  });
    const body1 = await response1.json();

    const apellidos =
      body1.listado[0].per_primerApellido + " " + body1.listado[0].per_segundoApellido;

    const datosUsuario = {
      int_per_idcas: body1.listado[0].per_id,
      str_per_nombres: body1.listado[0].per_nombres,
      str_per_apellidos: apellidos,
      str_per_email: body1.listado[0].per_email,
      str_per_cedula: cedula,
      str_per_cargo: '',
      str_per_telefono: '',
      str_per_val_antiguo: null,
    };
    // await usuarioTalentoHumano(datosUsuario);
    
    if (dataEmpleado.success) {
      res.json({
        status: true,
        message: "Creando usuario en el sistema",
        body: '',
      });
      await usuarioTalentoHumano(datosUsuario);
      }else{
        return res.json({
          status: false,
          message: "El usuario no se encontró en la base de Datos",
          body: usuario,
        });
      }

    }
    if (usuario[0].str_per_estado === 'INACTIVO') {
      return res.json({
        status: false,
        message: "El usuario se encuentra inactivo, comuniquese con el administrador del sistema",
        body: 0,
      });
    }

    //obtener el perfil publico
    const perfiles = await sequelize.query(`SELECT * FROM seguridad.f_listar_perfiles_usuario('${datosCas.perId}') `, { type: QueryTypes.SELECT });

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
      damin: "localhost"
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
    console.log("ERROR", error.message);
    return res.status(500).json({ message: error.message });

  }
};

async function usuarioTalentoHumano(data) {

  const getRol = await Roles.findOne({
    where: {
      str_rol_nombre: 'PÚBLICO'
    }
  });

  console.log('ROL', getRol)

  const persona = await Personas.create({
    int_per_idcas: data.int_per_idcas,
    str_per_nombres: data.str_per_nombres,
    str_per_apellidos: data.str_per_apellidos,
    str_per_email: data.str_per_email,
    str_per_cedula: data.str_per_cedula,
    str_per_cargo: data.str_per_cargo,
    str_per_telefono: data.str_per_telefono,
    str_per_estado: 'ACTIVO',
    dt_fecha_creacion: new Date(),
    dt_fecha_actualizacion: new Date()
  });

  const personaRolData = await personaRol.create({
    int_per_id: persona.int_per_id,
    int_rol_id: getRol.int_rol_id,
    str_perfil_estado: 'ACTIVO',
    str_perfil_dependencia: '',
  });

  

  const menus = await Menu.findAll({
    where: {
      str_menu_estado: 'ACTIVO'
    }
  });

  //crear permisos de todos los menus al perfil creado 
  //inicio, centros, prestamos, Mis bienes, ajustes, cuenta

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    if(menu.str_menu_nombre === 'Inicio' || menu.str_menu_nombre === 'Centros' || menu.str_menu_nombre === 'Prestamos' || menu.str_menu_nombre === 'Mis Bienes' || menu.str_menu_nombre === 'Ajustes' || menu.str_menu_nombre === 'Mi cuenta' || menu.str_menu_nombre === 'Prestamo'){
      const menuRol = await Permisos.create({
        int_perfil_id: personaRolData.int_perfil_id,
        int_menu_id: menu.int_menu_id,
        str_permiso_estado: 'ACTIVO',
        bln_ver: true,
        bln_crear: true,
        bln_editar: true,
        bln_eliminar: true,
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
      });
    }else{
      const menuRol = await Permisos.create({
        int_perfil_id: personaRolData.int_perfil_id,
        int_menu_id: menu.int_menu_id,
        str_permiso_estado: 'ACTIVO',
        bln_ver: false,
        bln_crear: false,
        bln_editar: false,
        bln_eliminar: false,
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
      });
    }
  }

}


export default {
  obtenerUsuarios,
  validarLogin,
};
