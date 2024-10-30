import { sequelize } from "../../database/database.js";
import { DataTypes, json, QueryTypes } from "sequelize";
import { Centros } from "../../models/departamentos/centros.models.js";
import { Ubicaciones } from "../../models/departamentos/ubicaciones.models.js"
const upload = multer({ dest: "uploads/" });
import multer from "multer";
import parser from "csv-parser";
import csv from "csv-parser";
import fs from "fs";
import { Op } from "sequelize";
import { eliminarFichero } from "../../utils/eliminarFichero.utils.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import fetch from "node-fetch"; //para consumir una API
import https from "https";
import { configVariables } from "../../config/variables.config.js";
import crypto from "crypto";


let datosFacultades;

const httpsAgentOptions = {
  secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
};

httpsAgentOptions.rejectUnauthorized = false;
const agent = new https.Agent(httpsAgentOptions);



const consumirServicioEspoch = async (req, res) => {
  try {
    const url = 'https://pruebasw.espoch.edu.ec:3011/usuarios?page=1&size=10';
    const url2 = 'https://pruebasw.espoch.edu.ec:3011/usuarios?page=1&size=10';
    const response = await fetch(url, { agent });
    const body = await response.json();

    return res.json({
      status: true,
      body: body
    })
  } catch (error) {

    return res.status(500).json({ message: error.message });
  }

};

const obtenerDatosCentro = async (req, res) => {

  const objeto = req.query;


  const data = JSON.parse(objeto.center);
  const tipo = data.type;
  const sede = data.sede;

  let datosFacultades;
  let datosDepartamentos;
  let datosCentro;

  if (tipo === "ACADÉMICO") {
    datosFacultades = await obtenerFacultades(sede);
    datosCentro = datosFacultades;
  } else if (tipo === "ADMINISTRATIVO") {
    datosDepartamentos = await retornarDependencias();
    datosCentro = datosDepartamentos;
  }

  return res.json({
    status: true,
    message: "Datos obtenidos",
    body: datosCentro,
  });
};

//filtrado de centros
export const filtrarCentros = async (req, res) => {
  try {
    const { filter } = req.query;
    //transformar el string en un objeto
    const filtro = JSON.parse(filter);
    const dato = filtro.like.data.toUpperCase();
    const estado = filtro.status.data;

    //obtener centros con un like en el nombre
    const centros = await Centros.findAll({
      where: {
        str_centro_nombre: {
          [Op.like]: "%" + dato + "%",
        },
        str_centro_estado: estado,
      },
    });
    if (centros.length === 0 || !centros) {
      return res.json({
        status: false,
        message: "No se encontraron centros",
      });
    }
    return res.json({
      status: true,
      message: "Centros obtenidos correctamente",
      body: centros,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filtrarUbicaciones = async (req, res) => {
  try {

    const paginationData = req.query;


    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Ubicaciones, '', '');
      return res.json({
        status: true,
        message: "Ubicaciones encontradas",
        body: datos,
        total: total,
      });
    }


    const ubicaciones = await Ubicaciones.findAll({ limit: 5 });
    if (ubicaciones.length === 0 || !ubicaciones) {
      return res.json({
        status: false,
        message: "No se encontraron ubicaciones",
      });
    }

    const { datos, total } = await paginarDatos(
      paginationData.page,
      paginationData.size,
      Ubicaciones,
      paginationData.parameter,
      paginationData.data
    );

    return res.json({
      status: true,
      message: "Ubicaciones obtenidos correctamente",
      body: datos,
      total: total
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



async function obtenerFacultades(sede) {

  try {
    const urlUno = configVariables.urlFacultadesMatriz;
    const urlDos = configVariables.urlFacultadesMorona;
    const urlTres = configVariables.urlFacultadesNorte;
    const responseUno = await fetch(urlUno, { agent });
    const responseDos = await fetch(urlDos, { agent });
    const responseTres = await fetch(urlTres, { agent });
    const bodyUno = await responseUno.json();
    const bodyDos = await responseDos.json();
    const bodyTres = await responseTres.json();

    if (sede === "MATRIZ RIOBAMBA") {
      return retornarObjetoFacultades(bodyUno);
    } else if (sede === "ESPOCH - SEDE MORONA SANTIAGO") {
      return retornarObjetoFacultades(bodyDos);
    } else {
      return retornarObjetoFacultades(bodyTres);
    }
  } catch (error) {
    return error;
    //return res.status(500).json({ message: error.message });
  }
};

//Funcion que devuelve las facultades en un objeto de objetos
async function retornarObjetoFacultades(body) {

  //Recorrer un array de objetos
  const resultado = body.listado.map((obj) => {
    return {
      strCodFacultad: obj.strCodFacultad,
      strNombre: obj.Facultad
    };
  });
  //Convierte un array de objetos a un objeto de objetos
  //const objeto = Object.assign({}, ...resultado.map((objeto, index) => ({ [index]: objeto })));
  return resultado;
};

const obtenerCarreras = async (req, res) => {

  const objeto = req.query;


  const data = JSON.parse(objeto.center);
  const sede = data.sede;
  const facultad = data.facultad;



  var datosCarreras;

  datosCarreras = await retornarCarreras(sede, facultad);


  return res.json({
    status: true,
    message: "Datos de Carreras",
    body: datosCarreras,
  });



};

const obtenerProcesos = async (req, res) => {




  const objeto = req.query;


  const data = JSON.parse(objeto.center);
  const sede = data.sede;
  const dependenciaId = data.dependenciaId;

  var datosProcesos = await retornarProcesos(sede, dependenciaId);

  return res.json({
    status: true,
    message: "Datos de Procesos",
    body: datosProcesos,
  });
};

async function retornarProcesos(sede, dependenciaId) {


  const url = configVariables.urlServicioProceso;
  const response = await fetch(url, { agent });
  const body = await response.json();
  const arrayProcesos = [];


  const depId = Number(dependenciaId);

  const resultado = body.map((obj) => {
    if (obj.proDepId.depId === depId) {
      arrayProcesos.push({ procesoDescripcion: obj.proDescripcion, procesoId: obj.proId });
      return {
        procesoDescripcion: obj.proDescripcion,
        procesoId: obj.proId,
      };
    }
  });

  return arrayProcesos;
};

async function retornarCarreras(sede, facultad) {
  const morona = "MORONA";
  const norte = "NORTE";

  //Carreras Matriz
  var urlFade = configVariables.urlCarrerasFade;
  const urlCiencias = configVariables.urlCarrerasCiencias;
  const urlPecuarias = configVariables.urlCarrerasCienciasPecuarias;
  const urlFie = configVariables.urlCarrerasFie;
  const urlMecanica = configVariables.urlCarrerasMecanica;
  const urlRecNaturales = configVariables.urlCarrerasRecursosNaturales;
  const urlSalud = configVariables.urlCarrerasSaludPublica;
  const urlNivelacion = configVariables.urlCarrerasNivelacion;

  if (sede === "MATRIZ RIOBAMBA") {
    urlFade = configVariables.urlCarrerasFade;
  } else if (sede === "ESPOCH - SEDE MORONA SANTIAGO") {
    urlFade = configVariables.urlCarrerasFade + morona;

  } else {

  }


  const responseFade = await fetch(urlFade, { agent });
  const responseCiencias = await fetch(urlCiencias, { agent });
  const responsePecuarias = await fetch(urlPecuarias, { agent });
  const responseFie = await fetch(urlFie, { agent });
  const responseMecanica = await fetch(urlMecanica, { agent });
  const responseRecNaturales = await fetch(urlRecNaturales, { agent });
  const responseSalud = await fetch(urlSalud, { agent });
  const responseNivelacion = await fetch(urlNivelacion, { agent });

  const bodyFade = await responseFade.json();
  const bodyCiencias = await responseCiencias.json();
  const bodyPecuarias = await responsePecuarias.json();
  const bodyFie = await responseFie.json();
  const bodyMecanica = await responseMecanica.json();
  const bodyRecNaturales = await responseRecNaturales.json();
  const bodySalud = await responseSalud.json();
  const bodyNivelacion = await responseNivelacion.json();

  //Carreras Morona


  //Carreras Norte



  if (sede = "MATRIZ RIOBAMBA") {
    if (facultad === "FADE") {
      return retornarObjetoCarreras(bodyFade);
    } else if (facultad === "FC") {
      return retornarObjetoCarreras(bodyCiencias);
    } else if (facultad === "FCP") {
      return retornarObjetoCarreras(bodyPecuarias);
    } else if (facultad === "FIE") {
      return retornarObjetoCarreras(bodyFie);
    }
    else if (facultad === "FIM") {
      return retornarObjetoCarreras(bodyMecanica);
    }
    else if (facultad === "FRN") {
      return retornarObjetoCarreras(bodyRecNaturales);
    }
    else if (facultad === "FSP") {
      return retornarObjetoCarreras(bodySalud);
    }
    else if (facultad === "UNA") {
      return retornarObjetoCarreras(bodyNivelacion);
    }
  } else if (sede === "ESPOCH - SEDE MORONA SANTIAGO") {

  } else {

  }

};

//Funcion que devuelve las facultades en un objeto de objetos
async function retornarObjetoCarreras(body) {

  //Recorrer un array de objetos
  const resultado = body.listado.map((obj) => {
    return {
      strCodCarrera: obj.strCodCarrera,
      strNombre: obj.strNombre
    };
  });
  //Convierte un array de objetos a un objeto de objetos
  //const objeto = Object.assign({}, ...resultado.map((objeto, index) => ({ [index]: objeto })));
  return resultado;
};


async function retornarDependencias() {
  const url = configVariables.urlServicioProceso;
  const response = await fetch(url, { agent });
  const body = await response.json();

  const resultado = body.map((obj) => {
    return {
      procesoDependencia: obj.proDepId.depDescripcion,
      dependenciaId: obj.proDepId.depId,
      //depTdepId:obj.proDepId.depTdepId,
      //procesoDescripcion: obj.proDescripcion,
      //procesoId: obj.proId,
    };
  });
  const datosUnicos = resultado.filter((elemento, indice, array) =>
    array.findIndex((e) => e.procesoDependencia === elemento.procesoDependencia) === indice
  );



  return datosUnicos;
}

const obtenerSedes = async (req, res) => {
  const url = configVariables.urlSedes;
  const response = await fetch(url, { agent });
  const body = await response.json();


  const resultado = body.listado.map((obj) => {
    return {
      strCodSede: obj.strCodSede,
      strNombre: obj.strNombre

    };
  });



  return res.json({
    status: true,
    message: "Datos obtenidos",
    body: resultado,
  });

};

const obtenerCentrosApi = async (req, res) => {
  //const url = configVariables.urlServicioDependencia;
  //const url = configVariables.urlServicioProceso;
  const url = configVariables.urlServicioProcesoDependencia;
  const response = await fetch(url, { agent });
  const body = await response.json();


  res.json({
    status: true,
    message: "Datos obtenidos",
    body: body,
  });



};

const obtenerCentrosDetalles = async (req, res) => {



  const { detalleId } = req.params;
  const centroDetalles = await Centros.findOne({
    where: {
      int_centro_id: detalleId
    },
  });
  return res.json({
    status: true,
    message: "Detalles de centros",
    body: centroDetalles,
  });


  /*try {
    const centro = await Centros.findAll();
    //const jsonCentro = Object.assign({}, centro);  //Conversion de array a json

    if (centro.lenght === 0 || !centro) {
      return res.json({
        status: false,
        message: "Centros no encontrados",
      });
    } else {
      return res.json({
        status: true,
        message: "Centros encontrados",
        body: centro,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }*/
};

//obtener datos con paginacion
const obtenerCentrosPaginacion = async (req, res) => {

  try {
    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Centros, '', '');
      return res.json({
        status: true,
        message: "Centos encontrados",
        body: datos,
        total,
      });
    }

    const centros = await Centros.findAll({ limit: 5 });

    if (centros.length === 0 || !centros) {
      return res.json({
        status: false,
        message: "Centros no encontrados",
      });
    } else {
      const paginationData = req.query;
      const { datos, total } = await paginarDatos(paginationData.page, paginationData.size, Centros, paginationData.parameter, paginationData.data);
      return res.json({
        status: true,
        message: "Centros encontrados",
        body: datos,
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

};



const obtenerCentro = async (req, res) => {
  const { id_centro } = req.params;
  try {
    const centro = await Centros.findOne({
      where: {
        int_centro_id: id_centro,
      },
    });

    if (centro.lenght === 0 || !centro) {
      return res.json({
        status: false,
        message: "Centro no encontrado",
      });
    } else {
      return res.json({
        status: true,
        message: "Centro encontrado",
        body: centro,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const insertarCentro = async (req, res) => {

  const {
    centro_nombre,
    centro_tipo,
    centro_sede,
    nombre_facultad,
    codigo_facultad,
    nombre_carrera,
    codigo_carrera,
    nombre_ubicacion,
    codigo_ubicacion,
    nombre_dependencia,
    codigo_dependencia,
    dc_centro_coordenada_uno,
    dc_centro_coordenada_dos,
  } = req.body;



  const buscarCentro = await Centros.findOne({
    where: {
      str_centro_nombre: centro_nombre,
    },
  });

  if (buscarCentro) {
    return res.json({
      status: false,
      message: "El centro que está intentando ingresar ya existe",
    });
  } else {
    let int_centro_tipo_id;
    let int_centro_nivel_id;
    let _int_centro_sede_id = 1;
    if (centro_tipo == "ACADÉMICO") {
      int_centro_tipo_id = 1;
      int_centro_nivel_id = 3;
      if (centro_sede == "MATRIZ RIOBAMBA") {
        _int_centro_sede_id = 1;
      } else if (centro_sede == "ESPOCH - SEDE MORONA SANTIAGO") {
        _int_centro_sede_id = 2;
      } else {
        _int_centro_sede_id = 3;
      }
    } else {
      int_centro_tipo_id = 2;
      int_centro_nivel_id = 2;
      _int_centro_sede_id = 1;
    }




    try {
      const nuevoCentro = await Centros.create({
        int_centro_tipo: int_centro_tipo_id,
        str_centro_tipo_nombre: centro_tipo,
        int_centro_nivel: int_centro_nivel_id,
        int_centro_sede_id: _int_centro_sede_id,
        str_centro_nombre_sede: centro_sede,
        str_centro_cod_facultad: codigo_facultad,
        str_centro_nombre_facultad: nombre_facultad,
        str_centro_cod_carrera: codigo_carrera,
        str_centro_nombre_carrera: nombre_carrera,
        str_centro_nombre: centro_nombre,
        int_centro_id_dependencia: codigo_dependencia,
        str_centro_nombre_dependencia: nombre_dependencia,
        int_centro_id_proceso: codigo_ubicacion,
        str_centro_nombre_proceso: nombre_ubicacion,
        dc_centro_coordenada_uno: dc_centro_coordenada_uno,
        dc_centro_coordenada_dos: dc_centro_coordenada_dos,
      });
      return res.json({
        status: true,
        message: "Centro insertado correctamente",
        body: nuevoCentro,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


};

const actualizarCentro = async (req, res) => {
  try {
    const { int_centro_id } = req.params;
    const { centro_nombre,
      centro_tipo,
      centro_sede,
      nombre_facultad,
      codigo_facultad,
      nombre_carrera,
      codigo_carrera,
      nombre_ubicacion,
      codigo_ubicacion,
      nombre_dependencia,
      codigo_dependencia,
      dc_centro_coordenada_dos,
      dc_centro_coordenada_uno,
    } = req.body;

    const centro = await Centros.findOne({
      where: {
        int_centro_id: int_centro_id,
      },
    });


    if (!centro || centro.lenght === 0) {
      return res.json({
        status: false,
        message: "Centro no encontrado, verifique el codigo",
      });
    }

    if (!validarCentro(centro_nombre)) {
      return res.json({
        status: false,
        message: "Debe llenar todos los campos",
      });
    } else {
      let int_centro_tipo_id;
      let int_centro_nivel_id;
      let _int_centro_sede_id = 1;
      if (centro_tipo == "ACADÉMICO") {
        int_centro_tipo_id = 1;
        int_centro_nivel_id = 3;
        if (centro_sede == "MATRIZ RIOBAMBA") {
          _int_centro_sede_id = 1;
        } else if (centro_sede == "ESPOCH - SEDE MORONA SANTIAGO") {
          _int_centro_sede_id = 2;
        } else {
          _int_centro_sede_id = 3;
        }
      } else {
        int_centro_tipo_id = 2;
        int_centro_nivel_id = 2;
        _int_centro_sede_id = 1;
      }
      centro.int_centro_tipo = int_centro_tipo_id;
      centro.str_centro_tipo_nombre = centro_tipo;
      centro.int_centro_nivel = int_centro_nivel_id;
      centro.int_centro_sede_id = _int_centro_sede_id;
      centro.str_centro_nombre = centro_nombre;
      centro.str_centro_cod_facultad = codigo_facultad;
      centro.str_centro_nombre_facultad = nombre_facultad;
      centro.str_centro_cod_carrera = codigo_carrera;
      centro.str_centro_nombre_carrera = nombre_carrera;
      centro.str_centro_nombre_sede = centro_sede;
      centro.int_centro_id_dependencia = codigo_dependencia;
      centro.str_centro_nombre_dependencia = nombre_dependencia;
      centro.int_centro_id_proceso = codigo_ubicacion;
      centro.str_centro_nombre_proceso = nombre_ubicacion;
      centro.dc_centro_coordenada_uno = dc_centro_coordenada_uno;
      centro.dc_centro_coordenada_dos = dc_centro_coordenada_dos;


      await centro.save();

      return res.json({
        status: true,
        message: "Centro actualizado correctamente",
        body: centro,
      });

    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const eliminarCentro = async (req, res) => {
  const { id_centro } = req.params;

  try {
    const centro = await Centros.findOne({
      where: {
        int_centro_id: id_centro,
      },
    });

    if (!centro) {
      return res.json({
        status: false,
        message: "Centro no encontrado",
      });
    } else if (centro.str_centro_estado == "ACTIVO") {
      centro.str_centro_estado = "INACTIVO";
    } else {
      centro.str_centro_estado = "ACTIVO";
    }
    await centro.save();

    return res.json({
      status: true,
      message: "Centro eliminado correctamente",
      body: centro,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const importarCsv = async (req, res) => {
  try {
    const file = req.file;
    //validar que se haya seleccionado un archivo
    if (!file) {
      return res.status(400).send("No se ha seleccionado ningún archivo");
    }
    //obtener la primera fila del archivo csv
    const primeraFila = await obtenerPrimeraFila(file.path);

    const encabezadosValidos = ["nombre", "ubicación", "dependencia"];
    const headers = Object.keys(primeraFila);

    // Verificar que los encabezaos del archivo csv sean válidos
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
      //obtener el separador del archivo y los datos
      let arrayCentrosCsv = await leerArchivoCsv(file.path);

      //insertar los datos en la base de datos
      let centrosNoIngresados = 0;
      let centrosIngresados = 0;
      let info = {
        centrosNoIngresados: {
          cantidad: 0,
          centros: []
        },
        centrosIngresados: {
          cantidad: 0,
          centros: []
        }
      }
      for (let centro of arrayCentrosCsv) {
        try {
          const valoresCentro = Object.values(centro);
          let consultaCentro = await Centros.findOne({
            where: {
              str_centro_nombre: valoresCentro[0].toUpperCase(),
            },
          });


          if (!consultaCentro || consultaCentro.lenght === 0) {
            //Si el centro no existe, inserta en la bd
            await sequelize.query(
              "INSERT INTO inventario.tb_centros (str_centro_nombre, str_centro_ubicacion, str_centro_dependencia) VALUES (:nombre, :ubicacion, :dependencia)",
              {
                replacements: {
                  nombre: valoresCentro[0].toUpperCase(),
                  ubicacion: valoresCentro[1].toUpperCase(),
                  dependencia: valoresCentro[2].toUpperCase(),
                },
              }
            );
            info.centrosIngresados.cantidad++;
            info.centrosIngresados.centros.push(valoresCentro[0].toUpperCase());
            centrosIngresados++;
          } else {
            info.centrosNoIngresados.cantidad++;
            info.centrosNoIngresados.centros.push(valoresCentro[0].toUpperCase());
            centrosNoIngresados++;
          }
        } catch (error) {

          return res.json({
            status: false,
            message: error.message,
          });
        }
      }
      const messageOne = "Centros insertados correctamente";
      const messageTwo = "Centros existentes en la base de datos";
      const message = {
        messageOne: {
          mensaje: messageOne,
          valor: centrosIngresados
        },
        messageTwo: {
          mensaje: messageTwo,
          valor: centrosNoIngresados
        }
      }
      eliminarFichero(file.path);
      return res.json({
        status: true,
        message: message,
        info: info
      });
    } else {
      eliminarFichero(file.path);
      res.json({
        status: false,
        message: "El archivo no contiene los encabezados correctos",
      });
    }

  } catch (error) {
    eliminarFichero(file.path);
    res.status(500).json({ message: error.message });
  }
};

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

function validarCsvCentros(rutaArchivo) {
  return new Promise((resolve, reject) => {
    let primeraFila = null;

    fs.createReadStream(rutaArchivo)
      .pipe(csv())
      .on("data", (data) => {
        if (!primeraFila) {
          primeraFila = data;
        }
      })
      .on("end", () => {
        if (!primeraFila) {
          reject(new Error("El archivo CSV está vacío."));
        } else {
          resolve(primeraFila);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function obtenerDatosCsv(path, separador) {
  return new Promise((resolve, reject) => {
    const resultado = [];
    fs.createReadStream(path, { encoding: "utf8" })
      .pipe(
        parser({
          separator: separador,
          newLine: "\n",
          skipLines: 1,
          headers: ["nombre", "ubicación", "dependencia"],
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

function validarCentro(nombre, ubicacion, dependencia) {
  return !(nombre === "" ||
    nombre === "null" ||
    ubicacion === "" ||
    ubicacion === "null" ||
    dependencia === "" ||
    dependencia === "null");
}

export default {
  obtenerCentrosApi,
  obtenerCentrosDetalles,
  insertarCentro,
  actualizarCentro,
  eliminarCentro,
  obtenerCentro,
  importarCsv,
  obtenerCentrosPaginacion,
  obtenerDatosCentro,
  obtenerSedes,
  obtenerFacultades,
  obtenerCarreras,
  obtenerProcesos,
  filtrarCentros,
  filtrarUbicaciones,
  consumirServicioEspoch
};
