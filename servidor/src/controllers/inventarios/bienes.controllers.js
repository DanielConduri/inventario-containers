import { sequelize } from "../../database/database.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { QueryTypes, json } from "sequelize";
import { eliminarFichero } from "../../utils/eliminarFichero.utils.js";
import { Datos } from "../../models/inventario/datos.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { paginarDatosBienes } from "../../utils/paginacion.utils.js";
import { Marcas } from '../../models/inventario/marcas.models.js'


import obtenerPrimeraFila from "../../utils/obtenerHeadersCsv.utils.js";
import { CatalogoBienes } from "../../models/inventario/catalogo_bienes.models.js";
import { Op } from "sequelize";

import { RegistroArchivos } from "../../models/inventario/registro_archivos.models.js";

const upload = multer({ dest: "uploads/" });
import multer from "multer";
import parser from "csv-parser";
import fs from "fs";
import crypto from 'crypto';

async function datosPaginacion(datos) {
  const arrayBienes = [];
  try {
    for (let bien of datos) {
      const bienes = await sequelize.query(
        `SELECT bn.int_bien_id, 
        bn.str_codigo_bien, 
        bn.str_bien_nombre, 
        cd.str_condicion_bien_nombre, 
        bn.dt_bien_fecha_compra, 
        bn.str_bien_estado_logico,
        ub.str_ubicacion_nombre,
        bn.str_bien_garantia
        FROM inventario.tb_bienes bn 
        INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
        INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id 
        WHERE bn.int_bien_id =  ${bien.int_bien_id} 
        ORDER BY bn.int_bien_id ASC`
        ,
        { type: QueryTypes.SELECT }
      );
      arrayBienes.push(bienes);
    }
    return arrayBienes;
  } catch (error) {
    console.log("error", error.message);
  }
}
const obtenerBienes = async (req, res) => {

  try {
    //console.log("Ingreso a obtener bienes para filtrar");
    console.log("req.query filtrado en obtener bienes paginación", req.query);
    const paginationData = req.query;
    //verifico si es un valor por defecto al cargar la pagina
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatosBienes(1, 10, Bienes, '', '');
      const datosBienes = await datosPaginacion(datos);
      const arrayBienes = datosBienes.map((item) => {
        return item[0];
      });
      //console.log("Datos al frontend: ", arrayBienes);
      return res.json({
        status: true,
        message: "Bienes encontrados",
        body: arrayBienes,
        total,
      });
    }
    //verifico que existen datos en bienes
    const bienes = await Bienes.findAll({ limit: 1 });
    if (bienes.length === 0 || !bienes) {
      return res.json({
        status: false,
        message: "No se encontraron bienes",

      });
    } else {
      try {
        const { datos, total } = await paginarDatosBienes(paginationData.page, paginationData.size, Bienes, paginationData.parameter, paginationData.data);
        const datosBienes = await datosPaginacion(datos);
        const arrayBienes = datosBienes.map((item) => {
          return item[0];
        });
        //console.log("Datos al frontend: ", datos, total);
        return res.json({
          status: true,
          message: "Bienes encontrados",
          body: arrayBienes,
          total,
        });

      } catch (error) {
        console.log(error.message)
      }

      //console.log("DatosBienes ", datosBienes);
      
    }

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }

};

const obtenerBien = async (req, res) => {
  //console.log("Ingreso a obtener bien")
  console.log("req.params", req.params);

  const { id_bien } = req.params;
  try {
    const bien = await sequelize.query(
      `SELECT bn.int_bien_id, 
      codb.str_codigo_bien_cod,
      bn.int_marca_id,
      bn.int_custodio_id,
      catb.str_catalogo_bien_id_bien,
      catb.str_catalogo_bien_descripcion,
      bn.int_bien_numero_acta,
      bn.str_bien_bld_bca,
      bn.str_bien_serie,
      bn.str_bien_modelo,
      mar.str_marca_nombre,
      bn.str_bien_critico,
      bn.str_bien_valor_compra,
      bn.str_bien_recompra,
      bn.str_bien_color,
      bn.str_bien_material,
      bn.str_bien_dimensiones,
      bn.str_bien_habilitado,
      bn.str_bien_estado,
      cd.str_condicion_bien_nombre, 
      bod.int_bodega_cod,
      bod.str_bodega_nombre,
      ub.int_ubicacion_cod,
      ub.str_ubicacion_nombre,
      cust.str_custodio_cedula,
      cust.str_custodio_nombre,
      cust.str_custodio_activo,
      bn.str_bien_origen_ingreso,
      bn.str_bien_tipo_ingreso,
      bn.str_bien_numero_compromiso,
      bn.str_bien_estado_acta,
      bn.str_bien_contabilizado_acta,
      bn.str_bien_contabilizado_bien,
      bn.str_bien_descripcion,
      --camb.int_campo_bien_item_reglon,
      --camb.str_campo_bien_cuenta_contable,
      bn.dt_bien_fecha_compra, 
      bn.str_bien_estado_logico,
      /*camb.str_campo_bien_depreciable,
      camb.str_fecha_ultima_depreciacion,
      camb.int_campo_bien_vida_util,
      camb.str_campo_bien_fecha_termino_depreciacion,
      camb.str_campo_bien_valor_contable,
      camb.str_campo_bien_valor_residual,
      camb.str_campo_bien_valor_libros,
      camb.str_campo_bien_valor_depreciacion_acumulada,
      camb.str_campo_bien_comodato,*/
      bn.str_bien_garantia,
      bn.int_bien_anios_garantia,
      bn.str_bien_info_adicional,
      mar.str_marca_nombre,
      cust.str_custodio_nombre_interno,
      ub.str_ubicacion_nombre_interno,
      bn.dt_bien_fecha_compra_interno
      FROM inventario.tb_bienes bn 
      INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
      INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
      INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
      --INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
      INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
      INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
      INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
      INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
      WHERE bn.int_bien_id =
      ${id_bien}`
    );


    /*const jsonObject = bien[0].reduce((obj, item) => {
      return {
        ...obj,
        [item.id]: item
      };
    }, data{});*/

    const jsonObject = bien[0].reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});


    const data = Object.values(jsonObject);
    //
    console.log('data', data[0]);

    if (bien.length === 0 || !bien) {
      return res.json({
        status: false,
        message: "No se encontró el bien",
      });
    } else {
      return res.json({
        /*status: true,
        message: "Bien encontrado",*/
        body: data[0],
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const filtrarBienes = async (req, res) => {

  try {
    const { filter } = req.query;
    ('Datos del filtro bienes 2023', filter);
    const filtro = JSON.parse(filter);
    const dato = filtro.like.data.toUpperCase();
    const estado = filtro.status.data;


    const bienes = await Bienes.findAll({
      where: {
        [Op.or]: [
          {
            str_codigo_bien: {
              [Op.like]: "%" + dato + "%",
            }
          },
          {
            str_bien_nombre: {
              [Op.like]: "%" + dato + "%",
            }
          }
        ],
        str_bien_estado_logico: estado,
      }
    });



    if (bienes.length === 0 || !bienes) {
      return res.json({
        status: false,
        message: "No se encontraron bienes",
      });
    }

    return res.json({
      status: true,
      message: "Datos obtenidos correctamente",
      body: bienes
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }


};

const insertarBien = async (req, res) => {
  console.log("body en insertar bien", req.body);
  const { str_tipo_bien } = req.body;
  let valorTipoBien = 0;
  if (str_tipo_bien == "HARDWARE") {
    valorTipoBien = 1;
  } else if (str_tipo_bien == "SOFTWARE") {
    valorTipoBien = 2;
  } else {
    valorTipoBien = 3;
  }

  const {
    int_centro_id,
    int_proveedor_id,
    int_estado_bien_id,
    int_marca_id,
    int_per_id,
    str_codigo_bien_cod,
    str_bien_nombre,
    str_bien_modelo,
    str_bien_serie,
    int_bien_precio,
    str_bien_color,
    str_bien_version,
    int_bien_licencias,
    bln_bien_vigencia,
    dt_bien_fecha_compra,
    dt_garantia_fecha_final,
    str_bien_info_adicional,
    str_catalogo_bien_descripcion,
  } = req.body;

  //console.log('Informacion adicional en bienes', str_bien_info_adicional)


  const verificarCodigo = await sequelize.query(
    `SELECT inventario.f_verificar_codigo('${str_codigo_bien_cod}')`,
    /*{
      replacements:{ 
       codigo:str_codigo_bien_cod 
      },
      
      type: QueryTypes.SELECT,
    }*/

  );


  //console.log("verificarCodigo", verificarCodigo);
  console.log("verificarCodigo", verificarCodigo[0][0].f_verificar_codigo);

  if (verificarCodigo[0][0].f_verificar_codigo === 1) {
    //console.log("Ya.... existe un bien registrado con el código digitado");
    return res.json({
      status: false,
      message: "Ya existe un bien registrado con el código digitado",
    });
  } else {
    //console.log("No.... existe un bien registrado con el código digitado");

    try {
      const bien = await Bienes.create({
        int_centro_id,
        int_proveedor_id,
        int_estado_bien_id,
        int_tipo_bien_id: valorTipoBien,
        int_marca_id,
        str_bien_nombre: str_catalogo_bien_descripcion,
        str_codigo_bien: str_codigo_bien_cod,
        str_bien_modelo,
        str_bien_serie,
        int_bien_precio,
        str_bien_color,
        str_bien_version,
        int_bien_licencias,
        bln_bien_vigencia,
        dt_bien_fecha_compra,

        //str_bien_info_adicional: `{${informacioAdicional}}`
      });

      //console.log("bien", bien);

      //Insertar el bien del id en la tabla bienes
      const codigoBien = await Bienes.update(
        {
          int_codigo_bien_id: bien.int_bien_id,
        },
        {
          where: {
            int_bien_id: bien.int_bien_id,
          },
        }
      );

      //Insertar en la tabla tb_codigo_bien
      const codigo_bien = str_codigo_bien_cod;
      //console.log("codigo_bien", codigo_bien);
      const bien_id = bien.int_bien_id;
      const int_codigo_bien = await insertarCodigo(bien_id, codigo_bien);
      //console.log("int_codigo_bien", int_codigo_bien);

      //Insertar la informacion adicional
      await retornarInformacionAdicional(str_bien_info_adicional, bien_id);

      try {
        const personaBien = await insertarPersonaBien(int_per_id, bien_id);
        //console.log("personaBien", personaBien);
      } catch (error) {
        //console.log("error en personaBien", error);
        return res.status(500).json({ message: error.message });
      }

      //await insertarGarantia(bien_id, dt_garantia_fecha_final, 5);

      return res.json({
        status: true,
        message: "Bien insetado correctamente",
      });
    } catch (error) {
      //console.log("error en insertar bien", error);
      return res.status(500).json({ message: error.message });
    }
  }
};

async function insertarCodigo(bien_id, str_codigo_bien_cod) {
  //console.log("str_codigo_bien_cod en insertarCodigo", str_codigo_bien_cod);
  try {
    const codigo = await sequelize.query(
      `INSERT INTO inventario.tb_codigo_bien(int_codigo_bien_id,str_codigo_bien_cod) VALUES ('${bien_id}','${str_codigo_bien_cod}') RETURNING int_codigo_bien_id`,
      {
        type: QueryTypes.INSERT,
      }
    );
    //console.log("codigo", codigo);
    return codigo;
  } catch (error) {
    console.log(error.message);
  }
}

async function insertarPersonaBien(per_id, bien_id) {
  const tipo_accion = 1;
  //("per_id, bien_id en insertarPersonaBien", per_id, bien_id);
  try {
    const personaBien = await sequelize.query(
      `INSERT INTO inventario.tb_persona_bien(int_per_id,int_bien_id,int_tipo_accion_id)
             VALUES ('${per_id}','${bien_id}', '${tipo_accion}') RETURNING int_per_id`,
      {
        type: QueryTypes.INSERT,
      }
    );
    return personaBien;
  } catch (error) {
    console.log(error.message);
  }
}

async function retornarInformacionAdicional(datos, bien_id) {
  const informacionAnterior = await Bienes.findOne({
    where: {
      int_bien_id: bien_id
    }
  });

  console.log('infoAnterior', informacionAnterior);

  let longitud = 0;
  try {
    //Obtener el tamaño del objeto json con información anterior
    const transformedData = Object.entries(informacionAnterior.str_bien_info_adicional).map(([key, value]) => { 
    });

    let data = informacionAnterior.str_bien_info_adicional;
    for(let key in data) {
      console.log('data key',data[key].id)
      longitud = data[key].id
    }
    console.log('longitud', longitud)
    console.log('transformedData', transformedData)
    

    const size = longitud/*transformedData.length*/;
    console.log('tamaño del jso con información anterior', size);

    //Crea la estructura de objeto de objetos 
    const informacionActual = {};
    datos.forEach((subArray, index) => {
      const objeto = {};
      subArray.forEach((element) => {
        objeto[element.key] = element.value;
      });
      objeto['id'] = index  + (size + 1);

      informacionActual[index + (size + 1)] = objeto;
    });


    console.log('información anterior', informacionAnterior.str_bien_info_adicional);
    console.log('información actual', informacionActual);

    const informacionAdicionalAnterior = informacionAnterior.str_bien_info_adicional;

    const informacionTotal = { ...informacionAdicionalAnterior, ...informacionActual }; //Combinar josn anterior y json actual
    console.log('información total', informacionTotal);

    //Obtener la informacion adicional anterior y agregar la información actual
    const resultado = await Bienes.update(        //Actualiza la informacion adicional
      { str_bien_info_adicional: informacionTotal },
      { where: { int_bien_id: bien_id } }
    );
    return 1;
  } catch (error) {
    console.log(error.message);
    return 0;
  }

} //fin retornarInformacionAdicional

async function insertarGarantia(bien_id, fecha_final, anios_garantia) {
  const garantia = await sequelize.query(
    `INSERT INTO inventario.tb_garantia(int_bien_id, dt_garantia_fecha_final, int_garantia_anios) VALUES ('${bien_id}','${fecha_final}', '${anios_garantia}') RETURNING int_garantia_id`,
    {
      type: QueryTypes.INSERT,
    }
  );

  console.log("garantia", garantia);
}

const obtenerBienesJson = async (req, res) => {
  const array = [
    [
      { key: 'SSD', value: '1Tb' },
      { key: 'encargado', value: 'PABLO ISRAEL BOLAÑOS PARRAGA' },
      { key: 'fecha', value: '2023-06-21' }
    ],
    [
      { key: 'DVD', value: 'logitech' },
      { key: 'encargado', value: 'PABLO ISRAEL BOLAÑOS PARRAGA' },
      { key: 'fecha', value: '2023-06-21' }
    ]
  ];

  const objetoDeObjetos = {};
  array.forEach((subArray, index) => {
    let objeto = {};
    subArray.forEach((element) => {
      objeto[element.key] = element.value;
      
    });
    
    objetoDeObjetos[index + 1] = objeto;
  });
  console.log(objetoDeObjetos);

  const resultado = await Bienes.update(
    { str_bien_info_adicional: objetoDeObjetos },
    { where: { int_bien_id: 4 } }
  );

  console.log("resultado", resultado)
  return res.json({
    status: true,
    message: "llegaron los datos",
    data: objetoDeObjetos,
  });

  /*var datos = [
    { key: "memoria ram", value: "16gb" },
    { key: "numero de ram", value: "4" },
    { key: "tipo de ram", value: "ddr3" },
    { key: "tamaño en disco", value: "1 Terabyte" },
    { key: "procesador", value: "Intel Core i5" },
    { key: "Grafica", value: "Nvidia RTX" },
    { key: "sistema_operativo", value: "Windows 7" },
    { key: "tarjeta de red", value: "true" },
    { key: "dvd", value: "true" },
  ];

  
 const obJson = Object.assign({}, datos);
  //console.log("obJson", obJson);
  let contador = 0;
  let cadena = "";

  //const jsonIsert = Object.fromEntries( //convierte a objeto de objetos
    Object.entries(obJson).map(([clave, valor]) => {
      cadena += `"${valor.key}"` + ":" + `"${valor.value}"`;
      if (contador < Object.entries(obJson).length - 1) {
        cadena = cadena + ",\n";
      } else {
        cadena = cadena + "";
      }
      contador++;
      return [clave, { ...valor }];
    })
  //);*/

  //console.log("obJInsert", obJson);
  //console.log(`{${cadena}}`);
  /*const insertar = await sequelize.query(
    `UPDATE inventario.tb_bienes SET str_bien_info_adicional = '{${cadena}}' WHERE int_bien_id = 69 RETURNING str_bien_info_adicional`,
    { type: QueryTypes.INSERT }
  );*/
  //console.log(insertar);
  //console.log("data",JSON.parse(`{${cadena}}`))


};

const importarCsv = async (req, res) => {

  console.log(req.params);
  const cantidadFilas = req.params.num_filas;
  const resolucion = req.params.resolucion;
  console.log("cantidadFilas", cantidadFilas);

  console.log("Ingreso a importar csv en bienes con el archivo csv");
  let datosEnvio = null;
  //const nombreArchivo = req.file.originalname;
  //console.log(req);
  console.log("req.file", req.file);
  console.log('req.body', req.body);

  try {
    const file = req.file;
    //validar que se haya seleccionado un archivo
    if (!file) {
      return res.json({
        status: false,
        message: "No se ha seleccionado ningún archivo",
      });
    }

    //consulto si hay datos en la tabla principal
    const datos = await Datos.findAll({
      limit: 1,
    });

    console.log("datos", datos);

    if (datos.length > 0) {
      return res.json({
        status: false,
        message: "Existe un proceso de importación en curso, por favor espere a que termine para poder importar un nuevo archivo",

      });
    }

    //obtener la primera fila del archivo csv
    const primeraFila = await obtenerPrimeraFila(file.path);
    //("primera fila", primeraFila);
    const encabezadosValidos =  /*["Código del Bien","Código Anterior","Identificador","Nro de Acta/ Nro de Matriz"];*/
      ["codigobien", "codigoanterior",
        "identificador", "numacta"];

    const headers = Object.keys(primeraFila);
    //console.log("headers", headers);
    //console.log("Encabezados válidos", encabezadosValidos);
    function verificarEncabezadosValidos(headers, encabezadosValidos) {
      const separador = /[,;]/;
      const encabezados = headers[0]
        .split(separador)
        .map((encabezado) => encabezado.trim().toLowerCase());
      console.log("Encabezados del archivo csv", encabezados);
      return encabezados.every((encabezado) =>
        encabezadosValidos.includes(encabezado)
      );
    }

    const sonValidos = true/*verificarEncabezadosValidos(headers, encabezadosValidos)*/;
    //console.log("son validos", sonValidos);

    if (sonValidos) {
      //obtener  los datos asumiendo que el separador es el punto y coma
      const arrayBienesCsv = await obtenerDatosCsv(file.path, ";");
      //console.log("arrayBienesCsv", arrayBienesCsv[0]);
      let CHUNK_SIZE = 0;

      if (arrayBienesCsv.length > 10000) {
        let maximo = Math.ceil(arrayBienesCsv.length / 10000);
        CHUNK_SIZE = Math.floor(arrayBienesCsv.length / maximo);
      } else {
        CHUNK_SIZE = arrayBienesCsv.length;
      }

      //const CHUNK_SIZE = Math.floor(arrayBienesCsv.length / maximo); // Tamaño del bloque
      console.log("Tamaño del bloque", CHUNK_SIZE);
      let index = 0;

      function insertarBloque() {
        const chunk = arrayBienesCsv.slice(index, index + CHUNK_SIZE);  //slice extrae una sección del array(valor inicial, valor final)
        index += CHUNK_SIZE;
        console.log("index", index);

        Datos.bulkCreate(chunk)
          .then(() => {
            if (index <= arrayBienesCsv.length) {
              insertarBloque();
            } else {
              const informacionArchivo = insertarInfoArchivo(req, index, cantidadFilas, resolucion);   //Funcion para el registro de archivos insetados

              console.log("datosEnvio", datosEnvio);

              return res.json({
                status: true,
                message: 'Bienes insertados correctamente',
                body: 1
                //info: info
              });
              console.log("Bloques insertados correctamente")
              console.timeEnd("Bulk");
            }
          })
          .catch((error) => {
            console.error("Error al insertar bloque:", error);
            /*return res.json({
              status: false,
              message: "el dato ya existe",
              //info: info
            });*/
          });
      }
      insertarBloque();

    }




    async function insertarInfoArchivo(req, index, cantidadFilas, resolucion) {
      const insertarRegistroArchivo = await RegistroArchivos.create({
        str_registro_nombre: req.file.originalname,
        str_registro_resolucion: resolucion,
        int_registro_num_filas_total: index,
        int_registro_num_filas_insertadas: cantidadFilas,
        int_registro_num_filas_no_insertadas: 0,
      });

      console.log("insertarRegistroArchivo", insertarRegistroArchivo);

      //const datos = await RegistroArchivos.findAll();
      //console.log("datos", datos);
      return datos;
    }

    //datosEnvio = await RegistroArchivos.findAll();

    eliminarFichero(file.path);
    //fin inf sonValidos
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

function obtenerDatosCsv(path, separador) {
  return new Promise((resolve, reject) => {
    let resultado = [];

    fs.createReadStream(path, { encoding: "utf8" })
      .pipe(
        parser({
          separator: separador,
          newLine: "\n",
          skipLines: 1,
          headers:
            ["codigoBien", "codigoAnterior", "identificador", "numActaMatriz", "BLD_BCA", "bien",
              "serieIdentificacion", "modeloCaracteristicas", "marca", "critico", "Moneda",
              "ValorCompra", "Recompra", "Color", "Material", "Dimensiones", "CondicionBien",
              "Habilitado", "EstadoBien", "IdBodega", "Bodega", "IdUbicacion", "UbicacionBodega",
              "CedulaRUC", "CustodioActual", "CustodioActivo", "OrigenIngreso",
              "TipoIngreso", "NroCompromiso", "EstadoActa", "ContabilizadoActa",
              "ContabilizadoBien", "Descripcion", "ItemRenglon", "Cuenta Contable", "Depreciable",
              "FechaIngreso", "FechaUltimaDepreciacion", "VidaUtil", "FechaTerminoDepreciacion",
              "ValorContable", "ValorResidual", "ValorEnLibros", "ValorDepreciacionAcumulada", "Comodato",
              "ruc", "proveedor", "garantia", "aniosGarantia"],

        })
      )
      //poner cada fila en un array de 100 en 100 


      .on("data", (row) => {
        const rowToInsert = {
          codigo_bien: row.codigoBien,
          codigo_anterior_bien: row.codigoAnterior,
          identificador: row.identificador,
          num_acta_matriz: parseInt(row.numActaMatriz),
          bdl_cda: row.BLD_BCA,
          bien: row.bien,
          serie_identificacion: row.serieIdentificacion,
          modelo_caracteristicas: row.modeloCaracteristicas,
          marca_raza_otros: row.marca,
          critico: row.critico,
          moneda: row.Moneda,
          valor_compra: row.ValorCompra,
          recompra: row.Recompra,
          color: row.Color,
          //convertir a string
          material: row.Material,
          dimensiones: row.Dimensiones,
          condicion_bien: row.CondicionBien,
          habilitado: row.Habilitado,
          estado_bien: row.EstadoBien,
          id_bodega: parseInt(row.IdBodega),
          bodega: row.Bodega,
          id_ubicacion: parseInt(row.IdUbicacion),
          ubicacion_bodega: row.UbicacionBodega,
          cedula_ruc: row.CedulaRUC,
          custodio_actual: row.CustodioActual,
          custodio_activo: row.CustodioActivo,
          origen_ingreso: row.OrigenIngreso,
          tipo_ingreso: row.TipoIngreso,
          num_compromiso: row.NroCompromiso,
          estado_acta: row.EstadoActa,
          contabilizado_acta: row.ContabilizadoActa,
          contabilizado_bien: row.ContabilizadoBien,
          descripcion: row.Descripcion,
          item_reglon: parseInt(row.ItemRenglon),
          cuenta_contable: row['Cuenta Contable'],
          depreciable: row.Depreciable,
          fecha_ingreso: row.FechaIngreso,
          fecha_ultima_depreciacion: row.FechaUltimaDepreciacion,
          vida_util: parseInt(row.VidaUtil),
          fecha_termino_depreciacion: row.FechaTerminoDepreciacion,
          valor_contable: row.ValorContable,
          valor_residual: row.ValorResidual,
          valor_libros: row.ValorEnLibros,
          valor_depreciacion_acumulada: row.ValorDepreciacionAcumulada,
          comodato: row.Comodato,
          ruc: row.ruc,
          proveedor: row.proveedor,
          garantia: row.garantia,
          anios_garantia: parseInt(row.aniosGarantia),
        };
        
        resultado.push(rowToInsert)
      })
      .on("end", () => {
        console.log("termina");
        //console.log("RESULTADO", resultado);
        resolve(resultado);
      })
      .on("error", (error) => {
        reject(error);
      });

  });
}

async function insertarDatos() {
  console.log("Ingreso a insertar tablas xd");
  //consulta sincrona en postgresql


  try {
    const insertarDatos = await sequelize.query(
      'SELECT * FROM inventario.f_insertar_datos()',
    );

    /*console.log(insertarDatos);
    console.log(insertarDatos[0][0]);*/

    if (insertarDatos[0][0].codigos >= 1) {

      return insertarDatos[0][0];
    }
  } catch (error) {
    return error.message;
  }
}

const insertarTablas = async (req, res) => {

  console.log("Ingreso a insertar tablas xd");
  try {
    const insertarDatos = await sequelize.query(
      'SELECT * FROM inventario.f_insertar_datos()',
    );
    console.log('insertar datos',insertarDatos[0][0]);

    if (insertarDatos[0][0].codigos >= 1) {
      return res.json({
        status: true,
        message: "Datos insertados correctamente",
        body: insertarDatos[0][0]
      });
    }
    return res.json({
      status: false,
      message: "Error al insertar los datos",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const actualizarGarantia = async (req, res) => {
  console.log("Ingreso a actualizar garantia")
  try {
    const actualizarGarantia = await sequelize.query(
      'SELECT inventario.f_actualizar_garantia()',
    );

    return res.json({
      status: true,
      message: "Datos actualizados correctamente",
      body: actualizarGarantia[0][0]
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const insertarInformacionAdicional = async (req, res) => {

  console.log(req.params); //id del bien
  console.log('Req body en insertarInformacionAdicional', req.body);
  const datos = req.body.str_bien_info_adicional;

  if (req.body.valorLleno === 1) { //Insertar información adicional
    const resultado = await retornarInformacionAdicional(datos, req.params.id_bien);
    console.log('resultado ', resultado);
    if (resultado != 0) {
      return res.json({
        status: true,
        message: "Datos ingresados orrectamente",
      });
    } else {
      return res.json({
        status: false,
        message: "Error al ingresar los datos",
      })
    }

  } else {  //Actualizar campos: custodio, fecha y ubicación
    const idBien = req.params.id_bien;
    const custodio = req.body.str_custodio_interno;
    const fecha = req.body.dt_bien_fecha_compra_interno;
    const ubicacion = req.body.str_ubicacion_nombre_interno;
 

    try {
      const actualizarBien = await sequelize.query(
        `SELECT inventario.f_actualizar_bien('${idBien}',' ${custodio}', '${fecha}', '${ubicacion}')`,
        { type: QueryTypes.SELECT }
      );

      console.log('actualziarBIen', actualizarBien);
      console.log('dspues de la funcion insertar');

      return res.json({
        status: true,
        message: "Datos actualizados correctamente",
      });
    } catch (error) {
      console.log('ingreso al error')
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  }

};

const obtenerBienActualizado = async (req, res) => {
  const { id_bien } = req.params;
  /*const datosBienesId = await Bienes.findAll({
    where: {
      str_codigo_bien: id_bien
    }
  });*/

  const datosBienId = await sequelize.query(
    `SELECT bn.int_bien_id, 
    codb.str_codigo_bien_cod,
    --bn.int_marca_id,
    --bn.int_custodio_id,
    catb.str_catalogo_bien_id_bien,
    catb.str_catalogo_bien_descripcion,
    bn.int_bien_numero_acta,
    bn.str_bien_bld_bca,
    bn.str_bien_serie,
    bn.str_bien_modelo,
    mar.str_marca_nombre,
    bn.str_bien_critico,
    bn.str_bien_valor_compra,
    bn.str_bien_recompra,
    bn.str_bien_color,
    bn.str_bien_material,
    bn.str_bien_dimensiones,
    bn.str_bien_habilitado,
    bn.str_bien_estado,
    cd.str_condicion_bien_nombre, 
    bod.int_bodega_cod,
    bod.str_bodega_nombre,
    ub.int_ubicacion_cod,
    ub.str_ubicacion_nombre,
    cust.str_custodio_cedula,
    cust.str_custodio_nombre,
    cust.str_custodio_activo,
    bn.str_bien_origen_ingreso,
    bn.str_bien_tipo_ingreso,
    bn.str_bien_numero_compromiso,
    bn.str_bien_estado_acta,
    bn.str_bien_contabilizado_acta,
    bn.str_bien_contabilizado_bien,
    bn.str_bien_descripcion,
    /*camb.int_campo_bien_item_reglon,
    camb.str_campo_bien_cuenta_contable,*/
    bn.dt_bien_fecha_compra, 
    bn.str_bien_estado_logico,
    /*camb.str_campo_bien_depreciable,
    camb.str_fecha_ultima_depreciacion,
    camb.int_campo_bien_vida_util,
    camb.str_campo_bien_fecha_termino_depreciacion,
    camb.str_campo_bien_valor_contable,
    camb.str_campo_bien_valor_residual,
    camb.str_campo_bien_valor_libros,
    camb.str_campo_bien_valor_depreciacion_acumulada,
    camb.str_campo_bien_comodato,*/
    bn.str_bien_garantia,
    bn.int_bien_anios_garantia,
    bn.str_bien_info_adicional,
    mar.str_marca_nombre,
    cust.str_custodio_nombre_interno,
    ub.str_ubicacion_nombre_interno,
    bn.dt_bien_fecha_compra_interno,
  bn.int_bien_estado_historial
    FROM inventario.tb_bienes bn 
    INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
    INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
    INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
    --INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
    INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
    INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
    INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
    INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
    WHERE bn.str_codigo_bien = '${id_bien}'`
  );
  //console.log('Biens por id', datosBienId)

  if (datosBienId) {
    return res.json({
      status: true,
      message: 'Bien obtenido correctamente',
      body: datosBienId[0]
    })
  }
}


const actualizarBienes = async (req, res) => {
  const { id_bien } = req.params;
  const dataSize = await sequelize.query('SELECT COUNT(*) FROM inventario.tb_datos');
  console.log('Filas de la tabla datos', dataSize[0][0]);
  let mensaje = 'Claves diferentes';
  let contador = 0;

  let arrayCodigos = [];

  //const dataSbye = await Datos.findAll();
  //console.log('DtaSbye', dataSbye)
  let codigoBien = null;
  console.log('filas valor entero', parseInt(dataSize[0][0].count))
  for (let i = 1; i <= parseInt(dataSize[0][0].count); i++) {
    const codigoSbye = await Datos.findOne({
      where: { int_data_id: i }
    })

    console.log('codigoSbye', codigoSbye);
    //console.log('codigoSbye', codigoSbye.dataValues.codigo_bien);
    codigoBien = codigoSbye.dataValues.codigo_bien;
    const bienes = await sequelize.query(
      `SELECT --bn.int_bien_id, 
      bn.str_codigo_bien,
      --bn.int_marca_id,
      --bn.int_custodio_id,
      catb.str_catalogo_bien_id_bien,
      bn.int_bien_numero_acta,
      bn.str_bien_bld_bca,
      catb.str_catalogo_bien_descripcion,
      bn.str_bien_serie,
      bn.str_bien_modelo,
      mar.str_marca_nombre,
      bn.str_bien_critico,
      bn.str_bien_valor_compra,
      bn.str_bien_recompra,
      bn.str_bien_color,
      bn.str_bien_material,
      bn.str_bien_dimensiones,
      cd.str_condicion_bien_nombre, 
      bn.str_bien_habilitado,
      bn.str_bien_estado,
      bod.int_bodega_cod,
      bod.str_bodega_nombre,	  
      ub.int_ubicacion_cod,
      ub.str_ubicacion_nombre,  
      cust.str_custodio_cedula,
      cust.str_custodio_nombre,
      cust.str_custodio_activo,
      bn.str_bien_origen_ingreso,
      bn.str_bien_tipo_ingreso, 
      bn.str_bien_numero_compromiso,
      bn.str_bien_estado_acta,  
      bn.str_bien_contabilizado_acta,
      bn.str_bien_contabilizado_bien,	  
      bn.str_bien_descripcion,
      bn.dt_bien_fecha_compra, 
      --bn.str_bien_estado_logico,
      bn.str_bien_garantia,
      bn.int_bien_anios_garantia
	    --bn.int_bien_estado_historial
      FROM inventario.tb_bienes bn 
      INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
      INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
      --INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
      --INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
      INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
      INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
      INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
      INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
      WHERE bn.str_codigo_bien = '${codigoBien}' AND bn.int_bien_estado_historial = 1`
    );

    console.log('Tabla Bienes', bienes[0]);
    let hashBienes = null;
    bienes[0].map((item, index) => {
      hashBienes =
        item.str_codigo_bien +
        item.str_catalogo_bien_id_bien +
        item.int_bien_numero_acta +//.toString() + //int a string
        item.str_bien_bld_bca +
        item.str_catalogo_bien_descripcion +
        item.str_bien_serie +
        item.str_bien_modelo +
        item.str_marca_nombre +
        item.str_bien_critico +
        item.str_bien_valor_compra +
        item.str_bien_recompra +
        item.str_bien_color +
        item.str_bien_material +
        item.str_bien_dimensiones +
        item.str_condicion_bien_nombre +
        item.str_bien_habilitado +
        item.str_bien_estado +
        item.int_bodega_cod + //int a string
        item.str_bodega_nombre +
        item.int_ubicacion_cod + //int a string
        item.str_ubicacion_nombre +
        item.str_custodio_cedula +
        item.str_custodio_nombre +
        item.str_custodio_activo +
        item.str_bien_origen_ingreso +
        item.str_bien_tipo_ingreso +
        item.str_bien_numero_compromiso +
        item.str_bien_estado_acta +
        item.str_bien_contabilizado_acta +
        item.str_bien_contabilizado_bien +
        item.str_bien_descripcion +
        item.dt_bien_fecha_compra +
        item.str_bien_garantia +
        item.int_bien_anios_garantia //int a string
      console.log('Hash bienes', hashBienes);
    });

    let hashDatos = null;
    //const codigoBien = codigo.toString();
    console.log('codigoBien', codigoBien)


    const datos = await sequelize.query(
      `SELECT * FROM inventario.tb_datos WHERE codigo_bien = '${codigoBien}'`
    );

    console.log('Tabla_datos', datos[0])
    datos[0].map((item) => {
      hashDatos =
        item.codigo_bien +
        //codigo_anterior_bien+
        item.identificador +
        item.num_acta_matriz +
        item.bdl_cda +
        item.bien +
        item.serie_identificacion +
        item.modelo_caracteristicas +
        item.marca_raza_otros +
        item.critico +
        item.valor_compra +
        item.recompra +
        item.color +
        item.material +
        item.dimensiones +
        item.condicion_bien +
        item.habilitado +
        item.estado_bien +
        item.id_bodega +
        item.bodega +
        item.id_ubicacion +
        item.ubicacion_bodega +
        item.cedula_ruc +
        item.custodio_actual +
        item.custodio_activo +
        item.origen_ingreso +
        item.tipo_ingreso +
        item.num_compromiso +
        item.estado_acta +
        item.contabilizado_acta +
        item.contabilizado_bien +
        item.descripcion +
        item.fecha_ingreso +
        item.garantia +
        item.anios_garantia
      console.log('Hash datos', hashDatos);
      /*item_reglon: 840104,
      cuenta_contable: '152.41.04',
      depreciable: 'S',
      fecha_ingreso: '01/10/2014',
      fecha_ultima_depreciacion: '29/12/2021',
      vida_util: 10,
      fecha_termino_depreciacion: '27/09/2024',
      valor_contable: '755,74',
      valor_residual: '75,57',
      valor_libros: '268,25',
      valor_depreciacion_acumulada: '487,49',
      comodato: 'N',
      ruc: '1714785489001',
      proveedor: 'IDC',
      garantia: 'S',
      anios_garantia: 1*/
    });

    const bienActual = crypto.createHash('sha256').update(hashBienes).digest('hex');
    const bienNuevo= crypto.createHash('sha256').update(hashDatos).digest('hex');
    console.log(bienActual);
    console.log(bienNuevo);

    //let editarBien = null;
    //const codigo = 722563;
    console.log('codigo antes de actualizr el bien', codigoBien)

    if (bienActual== bienNuevo) {  //No hay cambios en los datos 
      mensaje = 'Claves iguales'
      console.log('claves iguales')
    } else {  //Los datos a ingresar tienen cambios
      console.log('claves diferentes')
      try {
        //const editarBien = await sequelize.query(`SELECT * FROM inventario.fn_actualizar_bien_sbye(${codigo}) RETURNING *`)

        const editarBien = await sequelize.query(`SELECT * FROM inventario.fn_actualizar_bien_sbye('${codigoBien}')`)
        console.log('editar bien', editarBien[0][0])
        arrayCodigos.push(codigoBien);
        contador++;   //Numero de datos actualizados
      } catch (error) {
        console.log(error.mensaje)
      }

    }
  } //fin del for

  //console.log(editarBien);


  await sequelize.query("TRUNCATE TABLE inventario.tb_datos RESTART IDENTITY");
  res.json({
    status: true,
    /*tabla_bienes: {
      hashBienes: hashBienes,
      hash: key1
    },
    tabla_datos: {
      hashDatos: hashDatos,
      hash: key2
    },*/
    message: mensaje,
    datosActualizados: contador,
    array: arrayCodigos
    //body: 

  })
}

const obtenerHistorialArchivos = async (req, res) => {

  const data = await RegistroArchivos.findAll();
  //console.log(data)

  res.json({
    status: true,
    message: 'Datos obtenidos correctamente',
    body: data
  })
}

const eliminarInformacionAdicional = async (req, res) => {
  try {
    console.log(req.params);
    const {idBien, idArray} = req.params;

    const informacionAdicional = await Bienes.findOne({
      where: {
        int_bien_id: idBien
      }
    });

    let data = informacionAdicional.str_bien_info_adicional;

    let informacionActual = {};
    
    console.log('idArray',idArray)
    let contador = 1;
    let json = {};
    for(let key in data) {
      console.log(contador)
      console.log('data key',data[key].id)
      if(data[key].id === parseInt(idArray)){
        console.log('id encontrado')
        delete data[idArray]
      }
      contador++;
    }

    //console.log('infoActual', informacionActual)

    console.log('data', data)
    const resultado = await Bienes.update(        //Actualiza la informacion adicional
      { str_bien_info_adicional: data },
      { where: { int_bien_id: idBien} }
    );


    
    //console.log(idBien.params, idArray.params)
    return res.json({
      status: true,
      message: 'Datos eliminado correctamente',

    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  
}

export default {
  obtenerBienes,
  obtenerBien,
  filtrarBienes,
  insertarBien,
  importarCsv,
  insertarTablas,
  actualizarGarantia,
  insertarInformacionAdicional,
  obtenerBienesJson,
  obtenerBienActualizado,
  obtenerHistorialArchivos,
  actualizarBienes,
  eliminarInformacionAdicional
};
