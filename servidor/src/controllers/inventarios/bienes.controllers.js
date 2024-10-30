import { sequelize } from "../../database/database.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { QueryTypes, json } from "sequelize";
import { eliminarFichero } from "../../utils/eliminarFichero.utils.js";
import { Datos } from "../../models/inventario/datos.models.js";
import { paginarDatos, paginarDatosBienesPorCustodio } from "../../utils/paginacion.utils.js";
import { paginarDatosBienes } from "../../utils/paginacion.utils.js";
import { Marcas } from '../../models/inventario/marcas.models.js'
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
import jwt from "jsonwebtoken";
import { jwtVariables } from "../../config/variables.config.js";



import obtenerPrimeraFila from "../../utils/obtenerHeadersCsv.utils.js";
import { CatalogoBienes } from "../../models/inventario/catalogo_bienes.models.js";
import { Op } from "sequelize";

import { RegistroArchivos } from "../../models/inventario/registro_archivos.models.js";

const upload = multer({ dest: "uploads/" });
import multer from "multer";
import parser from "csv-parser";
import fs from "fs";
import crypto from 'crypto';
import { stringify } from "querystring";


//Funcion para obtener todos los bienes
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


//Función para obtener los bienes asociados a un custodio
async function datosPaginacionBienCustodio(datos) {
  const arrayBienes = [];
  try {
    for (let bien of datos) {
      // console.log('datos.codigo', bien.str_codigo_bien)
      const bienesCustodio = await sequelize.query(
        `SELECT bn.int_bien_id, 
          bn.str_codigo_bien, 
          bn.str_bien_nombre, 
          cd.str_condicion_bien_nombre, 
          bn.dt_bien_fecha_compra, 
          bn.str_bien_estado_logico,
          ub.str_ubicacion_nombre,
          ub.str_ubicacion_nombre_interno,
          bn.str_bien_garantia
          FROM inventario.tb_bienes bn 
          INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
          INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id 
          INNER JOIN inventario.tb_custodios cst ON cst.int_custodio_id = bn.int_custodio_id
          WHERE bn.str_codigo_bien = '${bien.str_codigo_bien}' AND int_bien_estado_historial = 1
          ORDER BY bn.int_bien_id ASC`
        ,
        { type: QueryTypes.SELECT }
      );
      arrayBienes.push(bienesCustodio);
    }
    return arrayBienes;
  } catch (error) {
    console.log("error", error.message);
  }
}




const obtenerBienes = async (req, res) => {
  try {
    console.log("req.query filtrado en obtener bienes paginación", req.query);
    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatosBienes(1, 10, Bienes, '', '');

      const datosBienes = await datosPaginacion(datos);
      const arrayBienes = datosBienes.map((item) => {
        return item[0];
      });
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
        const { datos, total } = await paginarDatosBienes(
          paginationData.page,
          paginationData.size, Bienes,
          paginationData.parameter,
          paginationData.data
        );
        const datosBienes = await datosPaginacion(datos);
        const arrayBienes = datosBienes.map((item) => {
          return item[0];
        });
        return res.json({
          status: true,
          message: "Bienes encontrados",
          body: arrayBienes,
          total,
        });
      } catch (error) {
        console.log(error.message)
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
};

const obtenerBienesPorCustodio = async (req, res) => {
  const paginationData = req.query;
  // console.log('req.query en obtenerBienesPorcustodio', req.query)
  const cedulaCustodio = req.query.cedulaLogeada;
  // console.log('cedulaPorCustodio', req.query.cedulaPorCustodio)
  //const cedula = req.query.cedulaPorCustodio;

  //Obtener el id del custodio logeado
  let custodio_id = 0;
  try {
    const id_custodio = await sequelize.query(
      `SELECT int_custodio_id FROM inventario.tb_custodios WHERE str_custodio_cedula = '${cedulaCustodio}'`
    );
    // console.log('id_custodio', id_custodio[0][0].int_custodio_id)
    custodio_id = id_custodio[0][0].int_custodio_id;
  } catch (error) {
    console.log(error.message)
  }


  if (paginationData.page === "undefined") {
    const { datos, total } = await paginarDatosBienesPorCustodio(1, 10, Bienes, '', '', custodio_id);
    //console.log('datos', datos)
    // console.log('total', total)
    const datosBienes = await datosPaginacionBienCustodio(datos);
    // console.log('arrayBienes', arrayBienes)
    const arrayBienes = datosBienes.map((item) => {
      return item[0];
    });
    //console.log("Datos al frontend: ", arrayBienes);
    return res.json({
      status: true,
      message: "Bienes encontrados",
      body: arrayBienes,
      total: total,
      datos: datos
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
      const { datos, total } = await paginarDatosBienesPorCustodio(
        paginationData.page,
        paginationData.size,
        Bienes,
        paginationData.parameter,
        paginationData.data,
        custodio_id
      );
      //console.log('datos', datos)
      // console.log('total', total)
      const datosBienes = await datosPaginacionBienCustodio(datos);
      // console.log('datosBienes', datosBienes)
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
      console.log('ingreso al error antes de enviar la respusta')
      console.log("error", error);
      return res.status(500).json({ message: error.message });
    }
  }
};

const obtenerbienesPorCedula = async (req, res) => {
  try {
    const { strCedula } = req.params;
    const bienesCustodio = await sequelize.query(
      `SELECT
      bn.str_codigo_bien,
      cat.str_catalogo_bien_descripcion
      FROM inventario.tb_bienes bn
      INNER JOIN inventario.tb_custodios cst
      ON bn.int_custodio_id = cst.int_custodio_id
      INNER JOIN inventario.tb_catalogo_bienes cat
      ON bn.int_catalogo_bien_id = cat.int_catalogo_bien_id
      WHERE cst.str_custodio_cedula = '${strCedula}' AND int_bien_estado_historial = 1`
    );
    if (bienesCustodio) {
      return res.json({
        status: true,
        message: "Bienes del custodio encontrados",
        body: bienesCustodio[0],
      })
    }
    return res.json({
      status: false,
      message: "Nose encontraron Bienes del custodio",
      body: [],
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const obtenerBien = async (req, res) => {
  //console.log("Ingreso a obtener bien")
  //console.log("req.params", req.params);
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
      cusint.str_custodio_interno_nombre,
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
      INNER JOIN inventario.tb_custodios_internos cusint ON cusint.int_custodio_interno_id = bn.int_custodio_interno_id
      WHERE bn.int_bien_id =
      ${id_bien}`
    );


    const jsonObject = bien[0].reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});

    const datosCustodios = await obtenerCustodioInterno(id_bien);

    const data = Object.values(jsonObject);
    //console.log('data', data[0]);

    if (bien.length === 0 || !bien) {
      return res.json({
        status: false,
        message: "No se encontró el bien",
      });
    } else {
      return res.json({
        status: true,
        message: "Bien encontrado",
        body: data[0],
        custodioInterno: datosCustodios
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function obtenerCustodioInterno(int_bien_id) {
  //const { int_bien_id } = req.params;
  //console.log(req)
  // console.log('int_bien_id ', int_bien_id);
  /*const custodio = await Custodios.findOne({
    where: {
      int_custodio_id: int_custodio_id,
    },
  });*/
  const custodio = await sequelize.query(
    `SELECT 
      cusint.int_custodio_interno_id,
      cusint.str_custodio_interno_cedula,
      cusint.str_custodio_interno_nombre,
      cusint.str_custodio_interno_activo,
      cb.str_persona_bien_activo,
      cb.dt_fecha_creacion
      FROM inventario.tb_custodio_bien_interno cb
      INNER JOIN inventario.tb_custodios_internos cusint ON cusint.int_custodio_interno_id = cb.int_custodio_interno_id
      WHERE cb.int_bien_id = ${int_bien_id}`,
    { type: sequelize.QueryTypes.SELECT }
  );

  //console.log('custodio en bien interno: ', custodio)

  return custodio;
}


const filtrarBienes = async (req, res) => {

  try {
    const { filter } = req.query;
    ('Datos del filtro bienes 2023', filter);
    const filtro = JSON.parse(filter);
    const dato = filtro.like.data.toUpperCase();
    const estado = filtro.status.data;

    console.log("dato", dato);
    console.log("estado", estado);
    console.log("filtro", filtro);

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
  console.log(datos)
  const informacionAnterior = await Bienes.findOne({
    where: {
      int_bien_id: bien_id
    }
  });
  let longitud = 0;
  try {
    //Obtener el tamaño del objeto json con información anterior
    const transformedData = Object.entries(informacionAnterior.str_bien_info_adicional).map(([key, value]) => {
    });

    let data = informacionAnterior.str_bien_info_adicional;
    for (let key in data) {
      console.log('data key', data[key].id)
      longitud = data[key].id
    }

    const size = longitud;
    //Crea la estructura de objeto de objetos 
    const informacionActual = {};
    datos.forEach((subArray, index) => {
      const objeto = {};
      subArray.forEach((element) => {
        objeto[element.key] = element.value;
      });
      objeto['id'] = index + (size + 1);

      informacionActual[index + (size + 1)] = objeto;
    });

    const informacionAdicionalAnterior = informacionAnterior.str_bien_info_adicional;
    const informacionTotal = { ...informacionAdicionalAnterior, ...informacionActual }; //Combinar josn anterior y json actual
    let dataInfo = informacionTotal
    //Obtener la informacion adicional anterior y agregar la información actual
    const resultado = await Bienes.update(        //Actualiza la informacion adicional
      { str_bien_info_adicional: informacionTotal },
      { where: { int_bien_id: bien_id } }
    );
    return dataInfo;
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

  const array2 = [
    { codigo_bien: '38158132' },
    { codigo_bien: '26572448' },
    { codigo_bien: '38107843' },
    { codigo_bien: '18106820' },
    { codigo_bien: '21842548' },
    { codigo_bien: '3352834' },
    { codigo_bien: '26572444' },
    { codigo_bien: '26572449' },
    { codigo_bien: '26572450' },
    { codigo_bien: '38107838' },
    { codigo_bien: '21842549' },
    { codigo_bien: '38107840' },
    { codigo_bien: '26572452' },
    { codigo_bien: '14209008' },
    { codigo_bien: '35353633' },
    { codigo_bien: '38107841' },
    { codigo_bien: '26572451' },
    { codigo_bien: '26572446' },
    { codigo_bien: '26572445' },
    { codigo_bien: '26572443' },
    { codigo_bien: '38107839' },
    { codigo_bien: '26572447' },
    { codigo_bien: '38107842' }
  ];

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


  const objetoDeObjetosTres = array2.reduce((acc, item, index) => {
    acc[index + 1] = item;  // Usamos index + 1 como clave numérica
    return acc;
  }, {});

  console.log(objetoDeObjetosTres)

  //obejeto 2
  let k = 0;
  const objetoDeObjetosDos = {};
  // array2.forEach((index) => {
  //   let objeto = {};
  //   //objeto[k + 1] = index.codigo_bien;
  //   objetoDeObjetosDos[index + 1] = index.codigo_bien;
  // });
  // console.log(objetoDeObjetosDos);

  // const resultado = await Bienes.update(
  //   { str_bien_info_adicional: objetoDeObjetos },
  //   { where: { int_bien_id: 4 } }
  // );

  //console.log("resultado", resultado)
  return res.json({
    status: true,
    message: "llegaron los datos",
    data: objetoDeObjetos,
    data2: objetoDeObjetosDos,
    data3: objetoDeObjetosTres
  });

};

const importarCsv = async (req, res) => {

  //console.log(req.params);
  const cantidadFilas = req.params.num_filas;
  const resolucion = req.params.resolucion;
  console.log("cantidadFilas", cantidadFilas);

  //console.log("Ingreso a importar csv en bienes con el archivo csv");
  let datosEnvio = null;
  //const nombreArchivo = req.file.originalname;
  //console.log(req);
  console.log("req.file", req.file);
  console.log('# columns', req.params.columnas)
  //console.log('req.body', req.body);

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

    //console.log("datos", datos);

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

    const sonValidos = true /*verificarEncabezadosValidos(headers, encabezadosValidos)*/;
    if (sonValidos) {
      //obtener  los datos asumiendo que el separador es el punto y coma

      let arrayBienesCsv = [];
      if (req.params.columnas == 46) {
        arrayBienesCsv = await obtenerDatosCsvFormato1(file.path, ";");
      } else if (req.params.columnas == 50) {
        arrayBienesCsv = await obtenerDatosCsvFormato2(file.path, ";");
      } else {
        arrayBienesCsv = await obtenerDatosCsvFormato3(file.path, ";");
      }

      //console.log("arrayBienesCsv", arrayBienesCsv[0]);
      let CHUNK_SIZE = 0;
      if (arrayBienesCsv.length > 10000) {
        let maximo = Math.ceil(arrayBienesCsv.length / 20000);
        CHUNK_SIZE = Math.floor(arrayBienesCsv.length / maximo);

        console.log('maximo', maximo)
        console.log('CHUNK_SIZE', CHUNK_SIZE)

      } else {
        CHUNK_SIZE = arrayBienesCsv.length;
      }

      //const CHUNK_SIZE = Math.floor(arrayBienesCsv.length / maximo); // Tamaño del bloque
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
              const informacionArchivo = insertarInfoArchivo(req, index, cantidadFilas, resolucion, req.params.columnas);   //Funcion para el registro de archivos insetados
              return res.json({
                status: true,
                message: 'Bienes insertados correctamente',
                body: 1
                //info: info
              });

            }
          })
          .catch((error) => {
            console.log(error)
            return res.status(500).json({ message: error.message });
          });
      }
      insertarBloque();

    }




    async function insertarInfoArchivo(req, index, cantidadFilas, resolucion, columnas) {
      //console.log('req en isnertar archivo',req)
      const insertarRegistroArchivo = await RegistroArchivos.create({
        str_registro_nombre: req.file.originalname,
        str_registro_resolucion: resolucion,
        int_registro_num_filas_total: cantidadFilas - 1,
        int_registro_num_filas_insertadas: 0,
        int_registro_num_filas_no_insertadas: 0,
        int_registro_num_columnas: columnas
      });
      return datos;
    }

    eliminarFichero(file.path);
    //fin inf sonValidos
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
};

function obtenerDatosCsvFormato1(path, separador) {
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
              "FechaCreacion", "FechaIngreso", "FechaUltimaDepreciacion", "VidaUtil", "FechaTerminoDepreciacion",
              "ValorContable", "ValorResidual", "ValorEnLibros", "ValorDepreciacionAcumulada", "Comodato"],

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
          fecha_creacion: row.FechaCreacion,
          fecha_ingreso: row.FechaIngreso,
          fecha_ultima_depreciacion: row.FechaUltimaDepreciacion,
          vida_util: parseInt(row.VidaUtil),
          fecha_termino_depreciacion: row.FechaTerminoDepreciacion,
          valor_contable: row.ValorContable,
          valor_residual: row.ValorResidual,
          valor_libros: row.ValorEnLibros,
          valor_depreciacion_acumulada: row.ValorDepreciacionAcumulada,
          comodato: row.Comodato,
        };

        resultado.push(rowToInsert)
      })
      .on("end", () => {
        resolve(resultado);
      })
      .on("error", (error) => {
        reject(error);
      });

  });
}

function obtenerDatosCsvFormato2(path, separador) {
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
              "FechaCreacion", "FechaIngreso", "FechaUltimaDepreciacion", "VidaUtil", "FechaTerminoDepreciacion",
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
          fecha_creacion: row.FechaCreacion,
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
        resolve(resultado);
      })
      .on("error", (error) => {
        reject(error);
      });

  });
}

function obtenerDatosCsvFormato3(path, separador) {
  return new Promise((resolve, reject) => {
    let resultado = [];

    fs.createReadStream(path, { encoding: "utf8" })
      .pipe(
        parser({
          separator: separador,
          newLine: "\n",
          skipLines: 1,
          headers:
            ["codigoBien", "codigoAnterior", "identificador", "numActaMatriz", "BLD_BCA",
              "bien", "serieIdentificacion", "modeloCaracteristicas", "marca", "ValorCompra",
              "Color", "Material", "Dimensiones", "UbicacionBodega", "CedulaRUC",
              "CustodioActual", "OrigenIngreso", "TipoIngreso", "Descripcion", "ItemRenglon",
              "CuentaContable", "FechaCreacion", "FechaIngreso", "FechaUltimaDepreciacion", "VidaUtil",
              "FechaTerminoDepreciacion", "ValorContable", "ValorResidual", "ValorEnLibros",
              "ValorDepreciacionAcumulada", "Comodato"
            ],

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
          valor_compra: row.ValorCompra,
          color: row.Color,
          material: row.Material,
          dimensiones: row.Dimensiones,
          ubicacion_bodega: row.UbicacionBodega,
          cedula_ruc: row.CedulaRUC,
          custodio_actual: row.CustodioActual,
          origen_ingreso: row.OrigenIngreso,
          tipo_ingreso: row.TipoIngreso,
          descripcion: row.Descripcion,
          item_reglon: parseInt(row.ItemRenglon),
          cuenta_contable: row.CuentaContable,
          fecha_creacion: row.FechaCreacion,
          fecha_ingreso: row.FechaIngreso,
          fecha_ultima_depreciacion: row.FechaUltimaDepreciacion,
          vida_util: parseInt(row.VidaUtil),
          fecha_termino_depreciacion: row.FechaTerminoDepreciacion,
          valor_contable: row.ValorContable,
          valor_residual: row.ValorResidual,
          valor_libros: row.ValorEnLibros,
          valor_depreciacion_acumulada: row.ValorDepreciacionAcumulada,
          comodato: row.Comodato,
        };

        resultado.push(rowToInsert)
      })
      .on("end", () => {
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
    if (insertarDatos[0][0].codigos >= 1) {

      return insertarDatos[0][0];
    }
  } catch (error) {
    return error.message;
  }
}

const insertarTablas = async (req, res) => {

  console.log('ingreso a la función insetarTablas')
  const codigosVacios = await sequelize.query(
    "SELECT  COUNT(*) FROM inventario.tb_datos WHERE codigo_bien = ''",
  );
  console.log('codigosVacios', codigosVacios[0][0].count)
  if (codigosVacios[0][0].count >= 1) {
    await insertarError();
  }

  const num_columnas = await sequelize.query(
    'SELECT int_registro_num_columnas, int_registro_id FROM inventario.tb_registro_archivos ORDER BY int_registro_id DESC LIMIT 1'
  );

  const columnas = num_columnas[0][0].int_registro_num_columnas;
  console.log('columnas', columnas)
  //console.log('num_columnas', num_columnas[0][0].int_registro_num_columnas);

  try {
    let insertarDatos = null;
    if (columnas === 46) {
      insertarDatos = await sequelize.query(
        'SELECT * FROM inventario.f_insertar_datos()',
      );
      console.log('insertar datos 1', insertarDatos[0][0]);
    } else {
      insertarDatos = await sequelize.query(
        'SELECT * FROM inventario.f_insertar_datos_formato2()',
      );
      console.log('insertar datos 2', insertarDatos[0][0]);
    }

    //Actualizar estado y fecha de la tabla registro archivos
    if (insertarDatos[0][0].codigos >= 1) { //Se insertaron codigos nuevos 

     

     

      //Identificar que bienes no se insertaron
      const bienesNoCargados = await sequelize.query(
        `SELECT codigo_bien, bien FROM inventario.tb_datos
         EXCEPT
         SELECT str_codigo_bien, str_bien_nombre FROM inventario.tb_bienes`
      );
      console.log('bienesNoCargados', bienesNoCargados[0].length);
      //Crea la estructura de objeto de objetos 
      const informacionActual = {};
      const objetoDeObjetos = bienesNoCargados[0].reduce((acc, item, index) => {
        acc[index + 1] = item;  // Usamos index + 1 como clave numérica
        return acc;
      }, {});

      //console.log('objetoDeObjetos', objetoDeObjetos);
      //console.log('num_columnas[0][0].int_registro_id', num_columnas[0][0].int_registro_id)
      const resultado = await RegistroArchivos.update(
        { str_detalle_carga: objetoDeObjetos },
        { where: { int_registro_id: num_columnas[0][0].int_registro_id } }
      );

      const totalFilas = await sequelize.query('SELECT int_registro_num_filas_total FROM inventario.tb_registro_archivos ORDER BY int_registro_id DESC LIMIT 1');
      
      const filasNoInsertadas = bienesNoCargados[0].length;/*totalFilas[0][0].int_registro_num_filas_total - filasInsertadas[0][0].count;*/
      const filasInsertadas = totalFilas[0][0].int_registro_num_filas_total - filasNoInsertadas;/*await sequelize.query('SELECT COUNT(*) FROM inventario.tb_bienes');*/

      // const actualizarTablaRegistro = await sequelize.query(
      //   `SELECT inventario.f_actualizar_fecha_carga(${filasInsertadas[0][0].count}, ${filasNoInsertadas})`
      // );

      const actualizarTablaRegistro = await sequelize.query(
        `SELECT inventario.f_actualizar_fecha_carga(${filasInsertadas}, ${filasNoInsertadas})`
      );


      await sequelize.query('TRUNCATE TABLE inventario.tb_datos RESTART IDENTITY');

       //Calcular el tiempo de carga e insertar en la tabla registro de archivos
       const insertarTiempoCarga = await sequelize.query('SELECT inventario.f_insertar_tiempo_carga()');
      return res.json({
        status: true,
        message: "Datos insertados correctamente",
        body: insertarDatos[0][0]
      });


    } //Fin si

    //Al no insertarse códigos, el bien ya existe y se procede a actualizar
    const contadorCustodio = await sequelize.query('SELECT COUNT(*) FROM inventario.tb_custodio_bien',);
    const resultadoActualizacion = actualizarBienes()   //Funcion que actualiza datos de los bienes
    console.log(resultadoActualizacion)
    return res.json({
      status: true,
      message: "Actualizandos los datos......",
    });
  } catch (error) {
    console.log('error en insetarTablas', error)
    return res.status(500).json({ message: error.message });
  }
};


async function insertarError() {
  const mensaje = 'Bienes sin códigos';
  const descripcion = {}
  const bienesSinCodigo = await sequelize.query(
    "SELECT * FROM inventario.tb_datos WHERE codigo_bien = ''"
  );

  let arrayBienes = []
  let informacion = null
  //console.log(bienesSinCodigo[0])
  bienesSinCodigo[0].forEach(element => {
    informacion = element.bien + element.identificador
    arrayBienes.push(informacion)
  });
  console.log('arrayBienes', arrayBienes)

  //Obtener último registro de carga de archivos
  const id_registro = await sequelize.query(
    'SELECT int_registro_id FROM inventario.tb_registro_archivos ORDER BY int_registro_id DESC LIMIT 1'
  );
  console.log('id_registro', id_registro[0][0].int_registro_id);

  const insertarError = await sequelize.query(
    `INSERT INTO 
    inventario.tb_detalle_error(int_registro_id, str_error_mensaje, str_error_descripcion) 
    VALUES ('${id_registro[0][0].int_registro_id}', '${mensaje}', '${arrayBienes}')`
  );
  console.log('insertarError', insertarError);

  //Obtener cantidad de bienes insertados en la tabla datos
  const cantidadDatos = await sequelize.query(
    'SELECT  COUNT(*) FROM inventario.tb_datos',
  );
  console.log('cantidadDatos en tb_datos', cantidadDatos[0][0])

  //Eliminar bienes con codigos vacios esta cantidad es la que no se inserta
  const borrarBienes = await sequelize.query(
    "DELETE FROM inventario.tb_datos WHERE codigo_bien = '' ",
  );

  console.log('total datos borrados de tb_datos: ', borrarBienes[1].rowCount)

  if (borrarBienes[1].rowCount >= 1) {
    //Actualizar tabla registroArchivos
    let totalInsertados = cantidadDatos[0][0].count - borrarBienes[1].rowCount;
    const acualizarRegistroArchivos = await sequelize.query(
      `UPDATE 
      inventario.tb_registro_archivos
      SET int_registro_num_filas_insertadas = ${totalInsertados},
      int_registro_num_filas_no_insertadas = ${borrarBienes[1].rowCount}
      WHERE int_registro_id = ${id_registro[0][0].int_registro_id} ;`
    );
    console.log('Actualizacion de tb_registro_archivos', acualizarRegistroArchivos[1].rowCount);
  }







}

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
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};


const insertarInformacionAdicional = async (req, res) => {

  console.log(req.params); //id del bien
  const datos = req.body.str_bien_info_adicional;

  if (req.body.valorLleno === 1) { //Insertar información adicional
    const valorAntiguo = await Bienes.findByPk(req.params.id_bien);
    const resultado = await retornarInformacionAdicional(datos, req.params.id_bien);
    if (resultado != 0) {
      await insertarAuditoria(
        valorAntiguo.str_bien_info_adicional,
        Bienes.tableName,
        "INSERT",
        resultado,
        req.ip,
        req.headers.host,
        req,
        ' Actualizó la información adicional del bien con id ' + req.params.id_bien
      );

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
    const cedula = req.body.cedula_user;
    const idBien = req.params.id_bien;
    const custodio = req.body.str_custodio_interno;
    const fecha = req.body.dt_bien_fecha_compra_interno;
    const ubicacion = req.body.str_ubicacion_nombre_interno;
    try {
      const actualizarBien = await sequelize.query(
        `SELECT inventario.f_actualizar_bien('${idBien}',' ${custodio}', '${fecha}', '${ubicacion}')`, { type: QueryTypes.SELECT });
      const verificarCustodio = await sequelize.query(
        `SELECT * FROM inventario.tb_custodios_internos WHERE str_custodio_interno_cedula = '${cedula}'`, { type: QueryTypes.SELECT });
      if (verificarCustodio.length > 0) {
        const actualizarCustodioId = await sequelize.query(
          `UPDATE inventario.tb_bienes SET int_custodio_interno_id = '${verificarCustodio[0].int_custodio_interno_id}' WHERE int_bien_id = '${idBien}'`, { type: QueryTypes.UPDATE }
        );
      } else {
        const insertarCustodio = await sequelize.query(
          `INSERT INTO inventario.tb_custodios_internos(str_custodio_interno_cedula, str_custodio_interno_nombre, str_custodio_interno_activo) VALUES ('${cedula}', '${custodio}', 'S') RETURNING int_custodio_interno_id`,
          { type: QueryTypes.INSERT }
        );
        const actualizarCustodioId = await sequelize.query(
          `UPDATE inventario.tb_bienes SET int_custodio_interno_id = '${insertarCustodio[0][0].int_custodio_interno_id}' WHERE int_bien_id = '${idBien}'`,
          { type: QueryTypes.UPDATE }
        );
      }
      //Obtener el código del bien
      const codigoBien = await sequelize.query(
        `SELECT str_codigo_bien FROM inventario.tb_bienes WHERE int_bien_id = ${idBien}`, { type: QueryTypes.SELECT });
      const actualizarCustodioInterno = await sequelize.query(
        `SELECT inventario.f_actualizar_custodio_bien_interno('${codigoBien[0].str_codigo_bien}')`, { type: QueryTypes.SELECT });
      return res.json({
        status: true,
        message: "Datos actualizados correctamente",
      });
    } catch (error) {
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


async function actualizarBienes() {

  let contador = 0;

  //consultar todos los datos del catálogo a insertar
  const datosInsertar = await sequelize.query(
    `SELECT * FROM inventario.tb_datos dt
    INNER JOIN inventario.tb_catalogo_bienes cat ON cat.str_catalogo_bien_id_bien = dt.identificador`
  );

  const bienesExistentes = await sequelize.query(
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
    WHERE bn.int_bien_estado_historial = 1`
  );
  //console.log('bienesExistentes', bienesExistentes[0])

  //console.log('datosInsertar', datosInsertar[0]);
  //let codigoSbye1 = null;
  //let hashBienes1 = null;
  //let hashDatos1 = null;
  for (let item of datosInsertar[0])
  /*datosInsertar[0].forEach(item =>*/ {
    const codigoSbye1 = item.codigo_bien;
    const codigoBien1 = codigoSbye1;

    const hashDatos1 =
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
      item.fecha_ingreso
    //item.garantia +
    //item.anios_garantia
    //obtenerHashBien(codigoSbye1)
    //obtenerHashDatos(codigoSbye1)

    //if(codigoSbye1) {
    let item2 = bienesExistentes[0].find(i =>
      i.str_codigo_bien === codigoSbye1
    );
    //if(buscar) {
    const hashBienes1 =
      item2.str_codigo_bien +
      item2.str_catalogo_bien_id_bien +
      item2.int_bien_numero_acta +//.toString() + //int a string
      item2.str_bien_bld_bca +
      item2.str_catalogo_bien_descripcion +
      item2.str_bien_serie +
      item2.str_bien_modelo +
      item2.str_marca_nombre +
      item2.str_bien_critico +
      item2.str_bien_valor_compra +
      item2.str_bien_recompra +
      item2.str_bien_color +
      item2.str_bien_material +
      item2.str_bien_dimensiones +
      item2.str_condicion_bien_nombre +
      item2.str_bien_habilitado +
      item2.str_bien_estado +
      item2.int_bodega_cod + //int a string
      item2.str_bodega_nombre +
      item2.int_ubicacion_cod + //int a string
      item2.str_ubicacion_nombre +
      item2.str_custodio_cedula +
      item2.str_custodio_nombre +
      item2.str_custodio_activo +
      item2.str_bien_origen_ingreso +
      item2.str_bien_tipo_ingreso +
      item2.str_bien_numero_compromiso +
      item2.str_bien_estado_acta +
      item2.str_bien_contabilizado_acta +
      item2.str_bien_contabilizado_bien +
      item2.str_bien_descripcion +
      item2.dt_bien_fecha_compra
    //item2.str_bien_garantia +
    //item2.int_bien_anios_garantia
    //}
    //}

    console.log('hashDatos', hashDatos1)
    console.log('hashBienes', hashBienes1)
    let bienActual = 1
    let bienNuevo = 2
    if (hashBienes1 !== null && hashDatos1 !== null) {
      bienActual = crypto.createHash('sha256').update(JSON.stringify(hashBienes1)).digest('hex');
      bienNuevo = crypto.createHash('sha256').update(JSON.stringify(hashDatos1)).digest('hex');
    }
    let mensaje = null
    if (bienActual === bienNuevo) {  //No hay cambios en los datos 
      mensaje = 'Claves iguales'
    } else {  //Los datos a ingresar tienen cambios
      await actualizarClavesDiferentes(codigoBien1)
      contador++;   //Numero de datos actualizados
    }
  }//Fin forEach

  const totalFilas = await sequelize.query('SELECT int_registro_num_filas_total FROM inventario.tb_registro_archivos ORDER BY int_registro_id DESC LIMIT 1');
  const filasNoInsertadas = totalFilas[0][0].int_registro_num_filas_total - contador;

  //Truncar la tabla datos
  await sequelize.query("TRUNCATE TABLE inventario.tb_datos RESTART IDENTITY");

  //Actualizar la tabla registro de archivos
  const actualizarTablaRegistro1 = await sequelize.query(
    `SELECT inventario.f_actualizar_fecha_carga(${contador}, ${filasNoInsertadas})`
  );

  //Calcular el tiempo de carga e insertar en la tabla registro de archivos
  const insertarTiempoCarga1 = await sequelize.query(
    'SELECT inventario.f_insertar_tiempo_carga()'
  );
  return true;

}//Fin funcion actualizarBienes




async function actualizarClavesDiferentes(codigoBien) {
  console.log('codigoBien en actualizarClavesDiferentes', codigoBien)
  try {
    //const editarBien = await sequelize.query(`SELECT * FROM inventario.fn_actualizar_bien_sbye(${codigo}) RETURNING *`)
    //console.log('Código del bien a actualizar', codigoBien)

    //Obtener el id del bien existente antes de insertar el nuevo bien actualizado
    const id_bien = await sequelize.query(
      `SELECT int_bien_id, int_custodio_interno_id
    FROM inventario.tb_bienes 
    WHERE str_codigo_bien = '${codigoBien}' AND int_bien_estado_historial = 1`
    );

    //Insertar el bien actualizado
    const editarBien = await sequelize.query(`SELECT * FROM inventario.fn_actualizar_bien_sbye('${codigoBien}')`)
    //Actualiza el historial
    const actualizarCustodioBien = await sequelize.query(`SELECT * FROM inventario.f_actualizar_custodio_bien('${codigoBien}')`)
    //console.log('editar bien', editarBien[0][0])
    //console.log('actualizarCustodioBien', actualizarCustodioBien[0][0])
    //console.log('id_bien', id_bien[0][0].int_bien_id);
    //console.log('int_custodio_interno_id', id_bien[0][0].int_custodio_interno_id);


    //Obtener el id del bien actualizado
    const id_bien_actualizado = await sequelize.query(
      `SELECT int_bien_id 
       FROM inventario.tb_bienes 
       WHERE str_codigo_bien = '${codigoBien}' AND int_bien_estado_historial = 1`
    );
    console.log('id_bien_actualizado', id_bien_actualizado[0][0].int_bien_id);

    //Actualizar historial del bien interno
    const historialInterno = await sequelize.query(
      `UPDATE inventario.tb_custodio_bien_interno	
       SET int_bien_id = ${id_bien_actualizado[0][0].int_bien_id}
       WHERE int_bien_id = ${id_bien[0][0].int_bien_id}
  `);
    //console.log('historialInterno actualizado', historialInterno[0])
    //Actualizar int_id_custodio_interno_id en tb_bienes
    const actualizarIdCustodioInterno = await sequelize.query(
      `UPDATE inventario.tb_bienes
       SET int_custodio_interno_id = ${id_bien[0][0].int_custodio_interno_id}
       WHERE int_bien_id = ${id_bien_actualizado[0][0].int_bien_id}`
    )
    //console.log('actualizarIdCustodioInterno ', actualizarIdCustodioInterno )
    //arrayCodigos.push(codigoBien);
    //contador++;   //Numero de datos actualizados

  } catch (error) {
    console.log(error)
  }
}

const obtenerHistorialArchivos = async (req, res) => {


  try {

    //Proceso para identificar si hay un proceso de carga en curso
    let valor = await
      sequelize.query(
        "SELECT int_registro_id FROM inventario.tb_registro_archivos WHERE str_registro_estado_carga = 'EN PROCESO'"
      );

    //valor 1 está en proceso
    let estado = null;
    try {
      if (valor[0][0]) {
        console.log('valor', valor[0][0].int_registro_id)
      }

      estado = valor[0][0] ? estado = 1 : estado = 0;
    } catch (error) {
      console.log(error.message)
    }

    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, RegistroArchivos, "", "");
      return res.json({
        status: true,
        message: "Archivos encontrados",
        body: datos,
        total: total,
        estadoCarga: estado
      });
    }
    const archivos = await RegistroArchivos.findAll();

    if (archivos.length === 0 || !archivos) {
      return res.json({
        status: false,
        message: "No se encontraron custodios",
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        RegistroArchivos,
        paginationData.parameter,
        paginationData.data
      );

      return res.json({
        status: true,
        message: "Custodios obtenidas",
        body: datos,
        total: total,
        estadoCarga: estado
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

const obtenerHistorialArchivosPorId = async (req, res) => {
  //console.log('ingreso a obtener  historial de archivo por id');
  try {
    const { id_archivo } = req.params;
    const detalleCarga = await sequelize.query(
      `SELECT * FROM inventario.tb_detalle_error WHERE int_registro_id = ${id_archivo}`
    );

    //console.log(detalleCarga)

    const registro_archivos = await RegistroArchivos.findByPk(id_archivo);
    //console.log(registro_archivos.str_detalle_carga)

    const array = [
      {
        str_error_mensaje: 'CARGA EXITOSA',
        str_error_descripcion: 'TODOS LOS BIENES FUERON INSERTADOS'
      }
    ]
    if (detalleCarga[0][0] === 0 || !detalleCarga[0][0]) {

      //console.log('array', array)
      return res.json({
        status: false,
        message: "Existen bienes no insertados",
        body: registro_archivos.str_detalle_carga,
        data: array
      });
    } else {
      //console.log(detalleCarga[0])
      return res.json({
        status: true,
        message: "Registro de carga de archivo encontrado",
        body: detalleCarga[0],
        data: array
      });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const eliminarInformacionAdicional = async (req, res) => {
  try {
    console.log(req.params);
    const { idBien, idArray } = req.params;

    const informacionAdicional = await Bienes.findOne({
      where: {
        int_bien_id: idBien
      }
    });

    const valorAntiguo = informacionAdicional.str_bien_info_adicional;
    console.log('valorAntiguo', valorAntiguo)
    const dataInsertar = valorAntiguo

    let data = informacionAdicional.str_bien_info_adicional;

    let informacionActual = {};
    let datoEliminado = null;
    //console.log('idArray', idArray)
    let contador = 1;
    let json = {};
    for (let key in data) {
      console.log(contador)
      console.log('data key', data[key].id)
      if (data[key].id === parseInt(idArray)) {
        console.log('id encontrado')
        datoEliminado = data[idArray];
        delete data[idArray]
      }
      contador++;
    }

    //console.log('datoEliminado', datoEliminado)


    //console.log('data actual', data)
    const resultado = await Bienes.update(        //Actualiza la informacion adicional
      { str_bien_info_adicional: data },
      { where: { int_bien_id: idBien } }
    );

    const informacionTotal = { ...data, ...datoEliminado }; //Combinar josn anterior y json actual
    let dataInfo = informacionTotal
    //console.log('datainfo', dataInfo)

    await insertarAuditoria(
      valorAntiguo,
      Bienes.tableName,
      "DELETE",
      data,
      req.ip,
      req.headers.host,
      req,
      ' Eliminó la información adicional del bien con id ' + req.params.idBien
    );
    //console.log(idBien.params, idArray.params)
    return res.json({
      status: true,
      message: 'Datos eliminado correctamente',

    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

const pruebaRendimiento = async (req, res) => {
  const hashesBienes = new Set();
  const nuevaData = [];
  //Datos de bienes en la base de datos
  const registrosBienes = await obtenerBienesBd();
  // console.log(registrosBienes[0][0])
  let con = 0;
  if (registrosBienes[0]) {
    //console.log('registroBIenes JSON', JSON.stringify(registrosBienes[0][0]))
    registrosBienes[0].forEach((data) => {

      if (con === 0) {
        console.log('registroBIenes', (JSON.stringify(data)))
        con = 1
      }
      const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
      hashesBienes.add(hash);
    })
  }

  const consultaBienes = await sequelize.query(
    `
    SELECT 
          bn.str_codigo_bien,
        codb.str_codigo_bien_cod,
        codb.bln_codigo_bien_activo,
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
          bn.str_bien_garantia,
          bn.int_bien_anios_garantia
          --bn.int_bien_estado_historial
          FROM inventario.tb_bienes bn 
          INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
          INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
          INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
          --INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
          INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
          INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
          INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
          INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
          WHERE int_bien_estado_historial = 1 AND bn.str_codigo_bien = '722563'`
  );

  //console.log('consultaBienes 1 bien', consultaBienes[0]);

  //console.log(hashesBienes)
  //Datos cargados del archivo sbye
  const registrosDatos = await Datos.findAll({ raw: true });
  //console.log('registrosBienes con rawtrue',registrosDatos)
  //console.log('Registro 1 de datos', registrosDatos[0]);
  const consultaDatos = await Datos.findOne({ where: { codigo_bien: '722563' }, raw: true });
  //console.log("Consulta a los datos 1bien",consultaDatos);
  let con2 = 0
  if (registrosDatos) {
    const dataFormateada = formatearData(registrosDatos);
    //console.log('dataFormateada JSON', JSON.stringify(dataFormateada[0]))
    dataFormateada.forEach((data) => {
      if (con2 === 0) {
        console.log('registroDAtos', (JSON.stringify(data)))
        con2 = 1
      }
      const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
      if (!hashesBienes.has(hash)) {
        nuevaData.push(data);
        hashesBienes.add(hash);
      }
    })
  }
  console.log(hashesBienes.size)

  console.log('nueva data', nuevaData.length);

  res.json(
    registrosBienes
  )



}

function formatearData(data) {

  const array = [];
  data.forEach(element => {
    const bien = {
      str_codigo_bien: element.codigo_bien,
      str_catalogo_bien_id_bien: element.codigo_anterior_bien,
      int_bien_numero_acta: element.num_acta_matriz,
      str_bien_bld_bca: element.bdl_cda,
      str_catalogo_bien_descripcion: element.bien,
      str_bien_serie: element.serie_identificacion,
      str_bien_modelo: element.modelo_caracteristicas,
      str_marca_nombre: element.marca_raza_otros,
      str_bien_critico: element.critico,
      str_bien_valor_compra: element.valor_compra,
      str_bien_recompra: element.recompra,
      str_bien_color: element.color,
      str_bien_material: element.material,
      str_bien_dimensiones: element.dimensiones,
      str_condicion_bien_nombre: element.condicion_bien,
      str_bien_habilitado: element.habilitado,
      str_bien_estado: element.estado_bien,
      int_bodega_cod: element.id_bodega,
      str_bodega_nombre: element.bodega,
      int_ubicacion_cod: element.id_ubicacion,
      str_ubicacion_nombre: element.ubicacion_bodega,
      str_custodio_cedula: element.cedula_ruc,
      str_custodio_nombre: element.custodio_actual,
      str_custodio_activo: element.custodio_activo,
      str_bien_origen_ingreso: element.origen_ingreso,
      str_bien_tipo_ingreso: element.tipo_ingreso,
      str_bien_numero_compromiso: element.num_compromiso,
      str_bien_estado_acta: element.estado_acta,
      str_bien_contabilizado_acta: element.contabilizado_acta,
      str_bien_contabilizado_bien: element.contabilizado_bien,
      str_bien_descripcion: element.descripcion,
      dt_bien_fecha_compra: element.fecha_ingreso,
      str_bien_garantia: element.garantia,
      int_bien_anios_garantia: element.anios_garantia
    }
    array.push(bien);
  }

  )

  return array;
}

async function obtenerBienesBd() {

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
      WHERE bn.int_bien_estado_historial = 1`
  );

  return bienes;

}


export default {
  obtenerBienes,
  obtenerBienesPorCustodio,
  obtenerbienesPorCedula,
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
  obtenerHistorialArchivosPorId,
  actualizarBienes,
  eliminarInformacionAdicional,
  pruebaRendimiento
};
