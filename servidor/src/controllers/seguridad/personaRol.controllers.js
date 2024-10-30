import { sequelize } from "../../database/database.js";
import { DataTypes, json, QueryTypes, where } from "sequelize";
import { personaRol } from "../../models/seguridad/personaRol.models.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { configVariables } from "../../config/variables.config.js";
const upload = multer({ dest: "uploads/" });
import multer from "multer";
import parser from "csv-parser";
import fs from "fs";
import obtenerPrimeraFila from "../../utils/obtenerHeadersCsv.utils.js";
import { eliminarFichero } from "../../utils/eliminarFichero.utils.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

import fetch from "node-fetch"; //para consumir una API
import https from "https";
import crypto from "crypto";

// Configurar el agente HTTPS
const httpsAgentOptions = {
  secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
};

// Verificar si estamos en entorno de desarrollo
  httpsAgentOptions.rejectUnauthorized = false;


const httpsAgent = new https.Agent(httpsAgentOptions);

//const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales

//registra usuarios  y crea un perfil por defecto con Rol público
export const insertarPersonaRol = async (req, res) => {
  
  try {
    //recibo datos del frontend que no tiene el CAS
    const personaRol = req.body;
    
    //completar los datos con el CAS
    const cedula = personaRol.per_cedula;
    const url = configVariables.urlServicioCentralizado + cedula;

    const response = await fetch(url, { agent: httpsAgent  });
    const body = await response.json();

    if (body.success === false) {
      
      return res.json({
        status: false,
        message: "No se encontró el usuario en el CAS, verifique la cédula",
      });
    }
    const apellidos =
      body.listado[0].per_primerApellido + " " + body.listado[0].per_segundoApellido;

    const datosUsuario = {
      int_per_idcas: body.listado[0].per_id,
      str_per_nombres: body.listado[0].per_nombres,
      str_per_apellidos: apellidos,
      str_per_email: body.listado[0].per_email,
      str_per_cedula: personaRol.per_cedula,
      str_per_cargo: personaRol.per_cargo.toUpperCase(),
      str_per_telefono: personaRol.per_telefono,
      str_per_val_antiguo: null,
    };

    

    const resultado = await sequelize.query(
      `Select seguridad.f_insertar_usuario(
            '${datosUsuario.int_per_idcas}',
            '${datosUsuario.str_per_nombres}',
            '${datosUsuario.str_per_apellidos}',
            '${datosUsuario.str_per_email}',
            '${datosUsuario.str_per_cedula}',
            '${datosUsuario.str_per_cargo}',
            '${datosUsuario.str_per_telefono}')`,
      { type: QueryTypes.SELECT }
    );
    const menus = await sequelize.query(
      `select int_menu_id from seguridad.tb_menus`,
      { type: QueryTypes.SELECT }
    );
    const resultJson = JSON.stringify(resultado[0].f_insertar_usuario);
    

    if (resultJson == 1) {
      return res.json({
        status: false,
        message: "El usuario que está intentando ingresar ya existe",
      });
    }

    //despues de crear usuario y un perfil predeterminado, se asignara un permiso a ese perfil

    //iterar sobre los menus para crear un permiso por defecto con map()

    const permisos = menus.map(async (menu) => {
      const permiso = await sequelize.query(
        ` Select seguridad.f_crear_permiso_predeterminado('${resultJson}', '${menu.int_menu_id}')`,
        { type: DataTypes.SELECT }
      );
      return permiso;
    });
    
    insertarAuditoria(
      null,
      "tb_personas",
      "CREATE",
      datosUsuario,
      req.ip,
      req.headers.host,
      req,
      "Se ha creado un perfil"
    )
    return res.json({
      status: true,
      message: "Usuario ingresado exitosamente",
    });
  } catch (error) {
    //console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPersonaRol = async (req, res) => {
  const { id } = req.params;
  try {
    try {
      const perfil = await sequelize.query(
        `SELECT tbpr.int_perfil_id, tbp.str_per_nombres, tbp.str_per_apellidos,tbp.str_per_email, tbpr.str_perfil_estado, tbp.str_per_cargo, tbp.str_per_telefono, tbpr.str_perfil_dependencia FROM seguridad.tb_personas AS tbp JOIN seguridad.tb_perfiles AS tbpr ON tbp.int_per_id = tbpr.int_per_id JOIN seguridad.tb_roles AS tbr on tbr.int_rol_id = tbpr.int_rol_id WHERE tbpr.int_perfil_id = '${id}'`,
        { type: QueryTypes.SELECT }
      );

      const jsonPerfil = Object.assign({}, perfil[0]);
      

      if (!perfil || perfil.length === 0) {
        return res.json({
          status: false,
          message: "Datos no encontrados",
        });
      } else {
        return res.json({
          status: true,
          message: "Perfil encontrado",
          body: jsonPerfil,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener datos de un perfil para luego editar
export const obtenerDatosPerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const datosPerfil = await sequelize.query(
      `	SELECT roles.str_rol_nombre,perfiles.str_perfil_dependencia,roles.str_rol_descripcion FROM seguridad.tb_roles AS roles  JOIN seguridad.tb_perfiles as perfiles on roles.int_rol_id= perfiles.int_rol_id  WHERE perfiles.int_perfil_id='${id}'`,
      { type: QueryTypes.SELECT }
    );

    const jsonDatos = Object.assign({}, datosPerfil[0]);
    
    const data = {
      str_rol_nombre: jsonDatos.str_rol_nombre,
      str_perfil_dependencia: jsonDatos.str_perfil_dependencia,
      str_rol_descripcion: jsonDatos.str_rol_descripcion,
    };
    
    if (!datosPerfil || datosPerfil.length === 0) {
      return res.json({
        status: false,
        message: "Datos no encontrados",
      });
    }
    return res.json({
      status: true,
      message: "Perfil encontrado",
      body: data,
    });
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};
export const eliminarPersonaRol = async (req, res) => {
  const { id } = req.params;
  try {
    const persona = await personaRol.findOne({
      where: {
        int_perfil_id: id,
      },
    });
    if (!persona || persona.length === 0) {
      return res.json({
        status: false,
        message: "Personas no encontradas",
      });
    } else {
      const estado_perfil = persona.dataValues.str_perfil_estado;
      if (estado_perfil === "ACTIVO") {
        await personaRol.update(
          {
            str_perfil_estado: "INACTIVO",
          },
          {
            where: {
              int_perfil_id: id,
            },
          }
        );
      } else {
        await personaRol.update(
          {
            str_perfil_estado: "ACTIVO",
          },
          {
            where: {
              int_perfil_id: id,
            },
          }
        );
        return res.json({
          status: true,
          message: "Rol con estado ACTIVO",
        });
      }
      insertarAuditoria(
        null,
        "tb_perfiles",
        "DELETE",
        persona,
        req.ip,
        req.headers.host,
        req,
        "Se ha eliminado un perfil"
      )
      return res.json({
        status: true,
        message: "Personas encontradas",
        body: persona,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarPersonaRol = async (req, res) => {
  const { id_perfil } = req.params;
  let { str_perfil_dependencia } = req.body;
  str_perfil_dependencia = str_perfil_dependencia.toUpperCase();
  
  try {
    if (!validar(str_perfil_dependencia)) {
      return res.json({
        status: false,
        message: "Debe llenar el campo",
      });
    }

    const perfil = await personaRol.findOne({
      where: {
        int_perfil_id: id_perfil,
      },
    });

    if (!perfil || perfil.length === 0) {
      return res.json({
        status: false,
        message: "Perfil no encontrado",
      });
    }
    perfil.str_perfil_dependencia = str_perfil_dependencia;
    await perfil.save();

    const nuevo = await personaRol.findOne({
      where: {
        int_perfil_id: id_perfil,
      },
    });

    insertarAuditoria(
      perfil,
      "tb_perfiles",
      "UPDATE",
      nuevo,
      req.ip,
      req.headers.host,
      req,
      "Se ha actualizado un perfil"
    )

    return res.json({
      status: true,
      message: "Datos Actualizados",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const insertarPerfil = async (req, res) => {
  try {
    //verificar si el rol ya existe del mismo usuario
    let { int_per_id, str_rol_nombre, str_rol_dependencia } = req.body;
    const rol = await sequelize.query(
      `SELECT * FROM seguridad.tb_perfiles as perfiles JOIN seguridad.tb_roles as roles on perfiles.int_rol_id= roles.int_rol_id WHERE perfiles.int_per_id='${int_per_id}' AND roles.str_rol_nombre='${str_rol_nombre}'`,
      { type: QueryTypes.SELECT }
    );
    if (rol.length > 0) {
      return res.json({
        status: false,
        message: "El rol ya existe para este usuario",
      });
    }

    str_rol_nombre = str_rol_nombre.toUpperCase();
    str_rol_dependencia = str_rol_dependencia.toUpperCase();

    const perfil = await sequelize.query(
      `SELECT seguridad.f_insertar_perfil('${int_per_id}','${str_rol_nombre}','${str_rol_dependencia}')`,
      { type: DataTypes.SELECT }
    );

    
    const jsonPerfil = Object.assign({}, perfil[0]);
    const jsonRes = jsonPerfil[0].f_insertar_perfil;
    

    if (jsonRes === 0) {
      return res.json({
        status: false,
        message: "Perfil no creado",
      });
    }
    const menus = await sequelize.query(
      `select int_menu_id from seguridad.tb_menus`,
      { type: QueryTypes.SELECT }
    );



    // despues de crear un perfil se debe asignar un permiso por defecto ( este permiso sera el Menu principal)
    const permisos = menus.map(async (menu) => {
      const permiso = await sequelize.query(
        ` Select seguridad.f_crear_permiso_predeterminado('${jsonRes}', '${menu.int_menu_id}')`,
        { type: DataTypes.SELECT }
      );
      return permiso;
    });

    return res.json({
      status: true,
      message: "Perfil creado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//obtener datos de la persona cuando abre la pestaña de perfiles
export const personaPerfilId = async (req, res) => {
  try {
    const { int_per_id } = req.params;
    const datos = await Personas.findOne({
      where: {
        int_per_id: int_per_id,
      },
    });

    if (!datos || datos.length === 0) {
      return res.json({
        status: false,
        message: "Error al obtener los datos",
      });
    }

    res.json({
      status: true,
      message: "Datos del usuario encontrados",
      body: datos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//devuelve todos los perfiles de una persona
export const perfilesPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const perfiles = await sequelize.query(
      `SELECT roles.str_rol_nombre, roles.str_rol_descripcion,perfiles.int_perfil_id, perfiles.str_perfil_dependencia, perfiles.str_perfil_estado FROM seguridad.tb_roles AS roles JOIN seguridad.tb_perfiles as perfiles on roles.int_rol_id= perfiles.int_rol_id  WHERE perfiles.int_per_id='${id}'`,
      { type: QueryTypes.SELECT }
    );
    
    if (!perfiles || perfiles.length === 0) {
      return res.json({
        status: false,
        message: "Perfiles no encontrados",
      });
    }
    res.json({
      status: true,
      message: "Perfiles encontrados",
      body: perfiles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//realizar el mismo proceso de ingresar a la tb_personas y crea un perfil que por defecto es Publico
export const importarCsv = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No se ha seleccionado ningún archivo");
  }
  // obtener la primera fila del archivo csv
  const primeraFila = await obtenerPrimeraFila(file.path);
  
  const encabezadosValidos = ["cedula", "cargo", "telefono"];
  const headers = Object.keys(primeraFila);
  // Verificar que los encabezados del archivo csv sean válidos
  function verificarEncabezadosValidos(headers, encabezadosValidos) {
    const separador = /[,;]/;
    const encabezados = headers[0]
      .split(separador)
      .map((encabezado) => encabezado.trim().toLowerCase());
    
    return encabezados.every((encabezado) =>
      encabezadosValidos.includes(encabezado)
    );
  } 

  const sonValidos = verificarEncabezadosValidos(headers, encabezadosValidos);
 

  if (sonValidos) {
    
    try {
      const arrayCentrosCsv = await leerArchivoCsv(file.path);
      
      let usuariosIngresados = 0;
      let usuariosNoIngresados = 0;
      let usuariosSinCorreo = 0;
      let cedulasInvalidas = 0;

      let info = {
        usuariosIngresados: {
          cantidad: 0,
          cedulas: [],
        },
        usuariosNoIngresados: {
          cantidad: 0,
          cedulas: [],
        },
        usuariosSinCorreo: {
          cantidad: 0,
          cedulas: [],
        },
        cedulasInvalidas: {
          cantidad: 0,
          cedulas: [],
        },
      };
      const menus = await sequelize.query(
        `select int_menu_id from seguridad.tb_menus`,
        { type: QueryTypes.SELECT }
      );

      for (let usuario of arrayCentrosCsv) {
        const cedulaCsv = Object.values(usuario);
        
        const datosUsuario = await obtenerEmail(cedulaCsv[0]);

        if (datosUsuario !== false) {
          if (datosUsuario !== null) {
            //Si el usuario existe en el sistema cas
            const datos = {
              int_per_idcas: datosUsuario.per_id,
              str_per_nombres: datosUsuario.nombres,
              str_per_apellidos: datosUsuario.apellidos,
              str_per_email: datosUsuario.correo,
              str_per_cedula: cedulaCsv[0],
              str_per_cargo: cedulaCsv[1].toUpperCase(),
              str_per_telefono: cedulaCsv[2],
            };
            try {
              const consultaUsuario = await Personas.findOne({
                where: {
                  int_per_idcas: datosUsuario.per_id,
                },
              });

              if (!consultaUsuario || consultaUsuario.length === 0) {
                const resultado = await sequelize.query(
                  `Select seguridad.f_insertar_usuario('${datos.int_per_idcas}','${datos.str_per_nombres}','${datos.str_per_apellidos}','${datos.str_per_email}','${datos.str_per_cedula}','${datos.str_per_cargo}','${datos.str_per_telefono}')`,
                  { type: QueryTypes.SELECT }
                );
                const resultJson = JSON.stringify(
                  resultado[0].f_insertar_usuario
                );

                const permisos = menus.map(async (menu) => {
                  const permiso = await sequelize.query(
                    ` Select seguridad.f_crear_permiso_predeterminado('${resultJson}', '${menu.int_menu_id}')`,
                    { type: DataTypes.SELECT }
                  );
                  return permiso;
                });

                
                usuariosIngresados++;
                info.usuariosIngresados.cantidad++;
                info.usuariosIngresados.cedulas.push(datos.str_per_cedula);
              } else {
                usuariosNoIngresados++;
                info.usuariosNoIngresados.cantidad++;
                info.usuariosNoIngresados.cedulas.push(datos.str_per_cedula);
              }
            } catch (error) {
              
              return res.status(500).json({ message: error.message });
            }
          } else {
            info.usuariosSinCorreo.cantidad++;
            usuariosSinCorreo++;
            info.usuariosSinCorreo.cedulas.push(cedulaCsv[0]);
          }
        } else {
          info.cedulasInvalidas.cantidad++;
          cedulasInvalidas++;
          info.cedulasInvalidas.cedulas.push(cedulaCsv[0]);
        }
      } //fin for
      // Objeto de mensajes para el front
      const message = {
        messageOne: {
          mensaje: "Usuarios que se insertaron correctamente",
          valor: usuariosIngresados,
        },
        messageTwo: {
          mensaje: "Usuarios existentes en la Base de Datos",
          valor: usuariosNoIngresados,
        },
        messageThree: {
          mensaje: "Usuarios sin correo registrado en el sistema CAS",
          valor: usuariosSinCorreo,
        },
        messageFour: {
          mensaje: "Cédulas inválidas",
          valor: cedulasInvalidas,
        },
      };

      //eliminar el archivo csv
      eliminarFichero(file.path);

      return res.json({
        status: true,
        message: message,
        info: info,
      });
    } catch (error) {
      //eliminar el archivo csv
      eliminarFichero(file.path);
      res.status(500).json({ message: error.message });
    }
  } else {
    //eliminar el archivo csv
    eliminarFichero(file.path);
    return res.json({
      status: false,
      message: "El archivo no tiene los encabezados correctos",
    });
  }
};

const obtenerEmail = async (cedula, res) => {
  const url = configVariables.urlServicioCentralizado + cedula;
  const response = await fetch(url, { agent });
  const body = await response.json();

  if (body.success === false) {
    return false;
  } else {
    const apellidos =
      body.datos.per_primerApellido + " " + body.datos.per_segundoApellido;
    const datosUsuario = {
      per_id: body.datos.per_id,
      nombres: body.datos.per_nombres,
      apellidos: apellidos,
      correo: body.datos.per_email,
    };

    if (datosUsuario.correo !== null) {
      return datosUsuario;
    } else {
      return null;
    }
  }
};

//obtener datos del archivo csv de personas
function obtenerDatosCsv(path, separador) {
  return new Promise((resolve, reject) => {
    const resultado = [];
    fs.createReadStream(path)
      .pipe(
        parser({
          separator: separador,
          newLine: "\n",
          skipLines: 1,
          headers: ["cedula", "cargo", "telefono"],
        })
      )
      .on("data", (row) => resultado.push(row))
      .on("end", () => {
        resolve(resultado);
      });
  });
}

//obtener el separador del archivo y los datos en una sola funcion
function leerArchivoCsv(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        let separador;
        if (data.includes(";")) {
          separador = ";";
        } else if (data.includes(",")) {
          separador = ",";
        } else {
          reject(
            new Error("No se encontró un separador válido en el archivo CSV.")
          );
        }
        obtenerDatosCsv(path, separador)
          .then((datosCsv) => {
            resolve(datosCsv);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
}

function validar(a) {
  if (a === "" || a === "undefined") return 0;
  else return 1;
}
export default {
  insertarPersonaRol,
  obtenerPersonaRol,
  eliminarPersonaRol,
  actualizarPersonaRol,
  insertarPerfil,
  perfilesPersona,
  personaPerfilId,
  obtenerDatosPerfil,
  importarCsv,
};
