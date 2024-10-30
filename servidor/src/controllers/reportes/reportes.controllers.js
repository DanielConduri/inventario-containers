import generarPDF from "../../utils/reporte.utils.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import Reportes from "../../utils/datosReportes.utils.js";
import reporteMarcasActivas from "../../utils/reportes/marcas/reporteMarcasActivas.js";
import generarPDFOrigenIngreso from "../../utils/reportes/bienes/origenIngreso.js";
import generarPDFTipoIngreso from "../../utils/reportes/bienes/tipoIngreso.js";
import generarPDFFechaCompraAnual from "../../utils/reportes/bienes/fechaCompraAnual.js";
import generarPDFFechaCompraAnual2 from "../../utils/reportes/bienes/fechaCompraAnual2.js";
import generarPDFBienesConGarantia from "../../utils/reportes/bienes/bienesConGarantia.js";
import generarPDFBienesConGarantiaPorFechas from "../../utils/reportes/bienes/bienesConGarantiaPorFechas.js";
import pdfPrueba from "../../utils/reportes/bienes/prueba.js";
import generarPDFBienesPorCatalogo from "../../utils/reportes/bienes/bienesPorCatalogo.js";
import generarPDFBienesPorUbicacion from "../../utils/reportes/bienes/bienesPorUbicacion.js"
import generarPDFBienesPorMarca from "../../utils/reportes/bienes/bienesPorMarca.js";
import generarPDFBienesPorFechaCompra from "../../utils/reportes/bienes/bienesPorFechaCompra.js";
import generarPDFBienesPorHistorial from "../../utils/reportes/bienes/bienesPorHistorial.js";
import generarPDFBienesTotal from "../../utils/reportes/bienes/bienesTotal.js"
import generarPDFBienesPorDescripcion from '../../utils/reportes/bienes/bienesPorDescripcion.js'
import excel from 'exceljs'

import { obtenerUsuariosCentralizado } from "../seguridad/centralizada.controllers.js";


const generarReporteMarcas = async (req, res) => {
  const filtro = {
    estado: "ACTIVO",
  };

  const titulo = "MARCAS";
  const marcas = await Reportes.obtenerMarcas(Bienes);

  // 3. Generar el PDF utilizando la plantilla y los datos formateados
  const pdfBase64String = await generarPDF(marcas, titulo);

  //Para visualizar el pdf en el navegador

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
  /*
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });
  */
};

const marcasActivas = async (req, res) => {
  const pdf = await reporteMarcasActivas();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdf, "base64"));
};

const reporteOrigenIngreso = async (req, res) => {
  //console.log(req.params.valor)
  if (req.params.valor === 'true') {
    try {
      const origenIngreso = await Reportes.obtenerOrigenIngreso();
      const filas = await Reportes.obtenerFilasOrigenIngreso(origenIngreso);
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("OrigenIngreso");
      worksheet.columns = [
        { header: "ORIGEN", key: "origen", width: 15 },
        { header: "CANTIDAD", key: "cantidad", width: 40 },
      ];
      // Add Array Rows
      worksheet.addRows(filas);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "OrigenIngreso.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (error) {
      return res.json({
        status: false,
        message: error.message,
        body: null,
      });
    }


  } else {
    const titulo = "CANTIDAD DE BIENES POR ORIGEN DE INGRESO";
    const origenIngreso = await Reportes.obtenerOrigenIngreso();
    const pdfBase64String = await generarPDFOrigenIngreso(origenIngreso, titulo);

    res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,
    });
  }


  //Para visualizar el pdf en el navegador
  /*
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    res.send(Buffer.from(pdfBase64String, "base64"));
    */



};

const reporteTipoIngreso = async (req, res) => {
  let tipoIngreso = await Reportes.obtenerTipoIngreso();
  try {
    if (req.params.valor === 'true') {
      const filas = await Reportes.obtenerFilasTipoIngreso(tipoIngreso);
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("TipoIngreso");

      worksheet.columns = [
        { header: "TIPO", key: "tipo_ingreso", width: 15 },
        { header: "CANTIDAD", key: "cantidad", width: 40 },
      ];

      // Add Array Rows
      worksheet.addRows(filas);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "TipoIngreso.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

    } else {
      const titulo = "BIENES POR TIPO DE INGRESO";
      const pdfBase64String = await generarPDFTipoIngreso(tipoIngreso, titulo);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }




};

const reporteFechaCompraAnual = async (req, res) => {
  try {
    let fechaCompraAnual = await Reportes.obtenerBienesPorFechaCompraAnual();
    if (req.params.valor === 'true') {
      const filas = await Reportes.obtenerFilasBienesPorFechaCompraAnual(fechaCompraAnual);
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("FechaCompraAnual");

      worksheet.columns = [
        { header: "CANTIDAD ADQUIRIDA", key: "cantidad", width: 15 },
        { header: "AÑO", key: "anio", width: 40 },
      ];

      // Add Array Rows
      worksheet.addRows(filas);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "FechaCompraAnual.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } else {
      const titulo = "FECHA COMPRA - ANUAL";
      //const fechaCompraAnual = await Reportes.obtenerBienesPorFechaCompraAnual();
      const pdfBase64String = await generarPDFFechaCompraAnual(
        fechaCompraAnual,
        titulo
      );

      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,
      });

    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Error al generar el reporte" + error });
  }


};

const reporteBienesPorFechaCompra = async (req, res) => {
  let bienes = await Reportes.obtenerBienesPorFechaCompra();
  if (req.params.valor === 'true') {
    const filas = await Reportes.obtenerFilasBienesPorFechaCompra(bienes);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("FechaCompraCantidad");
    worksheet.columns = [
      { header: "CANTIDAD ADQUIRIDA", key: "cantidad", width: 15 },
      { header: "FECHA COMPRA", key: "fecha_compra", width: 40 },
    ];

    // Add Array Rows
    worksheet.addRows(filas);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "FechaCompraCantidad.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } else {
    const titulo = "BIENES POR FECHA DE COMPRA";
    const pdfBase64String = await generarPDFBienesPorFechaCompra(bienes, titulo);
    res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,
    });
  }


};
const reporteBienesConGarantia = async (req, res) => {
  const titulo = "BIENES CON GARANTÍA";
  //const bienesConGarantia = await Reportes.obtenerBienesConGarantia();

  const pdfBase64String = await generarPDFBienesConGarantia(
    "bienesConGarantia",
    titulo
  );

  //Para visualizar el pdf en el navegador

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));

  /*
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });
  */
};

const reporteBienesConGarantiaPorFecha = async (req, res) => {
  try {
    const titulo = "BIENES CON GARANTÍA";


    const fechaString = req.query.fechaInicio;
    const fechaString2 = req.query.fechaFinal;


    const bienes = await Reportes.obtenerBienesConGarantiaPorFechaCompra(
      fechaString,
      fechaString2
    );
    if (bienes.length === 0) {
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
        body: null,
      });
    }

    const pdfBase64String = await generarPDFBienesConGarantiaPorFechas(
      bienes,
      titulo,
      fechaString,
      fechaString2
    );
    res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,
    });

  } catch (error) {
    console.log(error);
  }
};

const prueba = async (req, res) => {
  const titulo = "PRUEBA PDF";
  const pdfBase64String = await pdfPrueba("hola", titulo);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=prueba.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
};

//Reporte de bienes por catalogo
const reporteBienesPorCatalogo = async (req, res) => {
  const { id } = req.params;
  if (req.params.valor === 'true') {
    // const titulo = "BIENES POR CATÁLOGO";
    const bienes = await Reportes.obtenerBienesPorCatalogo(id);
    // console.log('antes de los bienes')
    console.log(bienes)
    const filas = await Reportes.obtenerFilasBienesPorCatalogo(bienes);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("BienesPorCatalogo");
    worksheet.columns = [
      { header: "CODIGO", key: "codigo", width: 15 },
      { header: "SERIE", key: "serie", width: 40 },
      { header: "MODELO", key: "modelo", width: 40 },
      { header: "COLOR", key: "color", width: 40 },
      { header: "FECHA DE COMPRA", key: "fecha_compra", width: 40 },
    ];

    worksheet.addRows(filas);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "BienesPorCatalogo.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });

  } else {

    try {

      const titulo = "BIENES POR CATÁLOGO";
      const bienes = await Reportes.obtenerBienesPorCatalogo(id);
      if (bienes.length === 0) {
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }
      const pdfBase64String = await generarPDFBienesPorCatalogo(bienes, titulo);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,

      });

    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al generar el reporte" + error,
      });
    }
  }
};


const reporteBienesPorUbicacion = async (req, res) => {

  // console.log(req.params)
  const custodio = await Reportes.obtenerResponsable(req.params.responsable);
  console.log(custodio)
  const responsable = custodio.nombre + ' ' + custodio.apellidos;
  console.log(responsable)

  let bienes = await Reportes.obtenerBienesPorUbicacion(req.params.id);
  //console.log(bienes[0])
  if (req.params.valor === 'true') {
    const filas = await Reportes.obtenerFilasBienesPorUbicacion(bienes)
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("BienesPorUbicacion");
    worksheet.columns = [
      { header: "CODIGO", key: "codigo", width: 15 },
      { header: "NOMBRE", key: "nombre", width: 50 },
      { header: "UBICACION", key: "ubicacion", width: 40 }
    ];

    worksheet.addRows(filas);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "BienesPorUbicacion.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } else {
    try {
      const titulo = "BIENES POR UBICACIÓN";
      if (bienes[0].length === 0) {
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }
      const pdfBase64String = await generarPDFBienesPorUbicacion(bienes[0], titulo, responsable);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,

      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al generar el reporte" + error,
      });
    }
  }

}

//Reporte de bienes por marca
const reporteBienesPorMarca = async (req, res) => {
  const { id } = req.params;
  if (req.params.valor === 'true') {
    const bienes = await Reportes.obtenerBienesPorMarca(id);
    const marca = await Reportes.obtenerMarca(id);
    const nombreMarca = marca.str_marca_nombre;
    const filas = await Reportes.obtenerFilasBienesPorMarca(bienes, marca)

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("BienesPorMarca");
    worksheet.columns = [
      { header: "CODIGO", key: "codigo", width: 15 },
      { header: "MODELO", key: "modelo", width: 40 },
      { header: "COLOR", key: "color", width: 40 },
      { header: "FECHA DE COMPRA", key: "fecha_compra", width: 40 },
      { header: "NOMBRE", key: "nombre", width: 70 },
    ];
    worksheet.addRows(filas);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "BienesPorMarca.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });


  } else {
    try {

      const titulo = "BIENES POR MARCA";
      const bienes = await Reportes.obtenerBienesPorMarca(id);
      if (bienes.length === 0) {
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }

      //hallar el nombre de la marca
      const marca = await Reportes.obtenerMarca(id);
      const nombreMarca = marca.str_marca_nombre;
      //ENVIO LA DATA A LA FUNCION QUE GENERA EL PDF
      const pdfBase64String = await generarPDFBienesPorMarca(bienes, titulo, nombreMarca);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,

      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al generar el reporte" + error,
      });
    }
  }



}


const reporteBienesPorDescripcion = async (req, res) => {
  const { id } = req.params;
  //console.log(req.params)
  
  if (req.params.valor === 'true') {
    const bienes = await Reportes.obtenerBienesPorDescripcion(req.params.data)

    if (bienes.length === 0) {
      //console.log('no hay bienes')
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
      });
    }
    
    const filas = await Reportes.obtenerFilasBienesPorDescripcion(bienes[0])
    //console.log(filas)

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("BienesPorDescripción");
    worksheet.columns = [
      { header: "CODIGO", key: "codigo", width: 15 },
      { header: "CODIGO ANTERIOR", key: "codigo_anterior", width: 20 },
      { header: "IDENTIFICADOR", key: "identificador", width: 15 },
      { header: "BIEN", key: "bien", width: 50 },
      { header: "SERIE", key: "serie", width: 40 },
      { header: "MODELO", key: "modelo", width: 40 },
      { header: "MARCA", key: "marca", width: 15 },
      { header: "BODEGA", key: "bodega", width: 35 },
      { header: "UBICACIÓN", key: "ubicacion", width: 70 },
      { header: "CÉDULA", key: "cedula", width: 15 },
      { header: "CUSTODIO", key: "custodio", width: 30 },
      { header: "CUSTODIO ACTIVO", key: "activo", width: 30 },
      { header: "DESCRIPCIÓN", key: "descripcion", width: 150 },
      
    ];
    worksheet.addRows(filas);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "BienesPorMarca.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });

  } else {
    try {
      //console.log('generando pdf descripción')
      const titulo = "BIENES POR DESCRIPCIÓN";
      const bienes = await Reportes.obtenerBienesPorDescripcion(req.params.data);
      //console.log(bienes[0], bienes[0].length, bienes )
      if (bienes[0].length === 0) {
        //console.log('no hay bienes')
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }


      //ENVIO LA DATA A LA FUNCION QUE GENERA EL PDF
      const pdfBase64String = await generarPDFBienesPorDescripcion(bienes[0], titulo);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,

      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al generar el reporte" + error,
      });
    }
  }



}
const reporteBienesPorhistorial = async (req, res) => {
  const { id } = req.params;
  let bienes = await Reportes.obtenerBienPorHistorial(id);
  try {

    if(req.params.valor === 'true') {
      
      const filas = Reportes.obtenerFilasBienPorHistorial(bienes[0]);
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("BienesPorHistorial");
      worksheet.columns = [
        { header: "CÓDIGO", key: "codigo", width: 15 },
        { header: "NOMBRE", key: "nombre", width: 40 },
        { header: "UBICACIÓN", key: "ubicacion", width: 40 },
        { header: "CONDICIÓN", key: "condicion", width: 40 },
        { header: "CUSTODIO", key: "custodio", width: 40 },
        { header: "FECHA DE CREACIÓN", key: "fecha_creacion", width: 40 },
      ];
  
      worksheet.addRows(filas);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "BienesPorHistorial.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
  
    } else {
      //console.log('Ingreso a bienesPorHistorial')
      //console.log(req.body, req.params)
      const titulo = "HISTORIAL DEL BIEN";
      //const bienes = await Reportes.obtenerBienPorHistorial(id);
  
      if (bienes[0] === 0) {
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }
      const pdfBase64String = await generarPDFBienesPorHistorial(bienes[0], titulo);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,
  
      })
    }
    
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }
};

const reporteBienesTotal = async (req, res) => {

//console.log('ingreso a reporte bienes total')
  try {
    if (req.params.valor === 'true') {
      const bienes = await Reportes.obtenerBienesTotal();
      const filas = await Reportes.obtenerFilasBienes(bienes);
      // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200/");
      // res.setHeader("Access-Control-Allow-Credentials", "true");
      // res.setHeader("Access-Control-Max-Age", "1800");
      // res.setHeader("Access-Control-Allow-Headers", "content-type");

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Distributivos");
      worksheet.columns = [
        { header: "CODIGO_BIEN", key: "codigo", width: 15 },
        { header: "IDENTIFICADOR", key: "identificador", width: 40 },
        { header: "CATALOGO", key: "catalogo", width: 40 },
        { header: "NUMERO_ACTA", key: "num_acta", width: 15 },
        { header: "BLD/BCA", key: "bld_bca", width: 15 },
        { header: "SERIE", key: "serie", width: 15 },
        { header: "MODELO", key: "modelo", width: 15 },
        { header: "MARCA", key: "marca", width: 25 },
        { header: "CRITICO", key: "critico", width: 15 },
        { header: "VALOR_COMPRA", key: "valor_compra", width: 15 },
        { header: "RECOMPRA", key: "recompra", width: 15 },
        { header: "COLOR", key: "color", width: 15 },
        { header: "MATERIAL", key: "material", width: 15 },
        { header: "DIMENSIONES", key: "dimensiones", width: 15 },
        { header: "HABILITADO", key: "habilitado", width: 15 },
        { header: "ESTADO", key: "estado", width: 15 },
        { header: "CONDICION", key: "condicion", width: 15 },
        { header: "COD_BODEGA", key: "cod_bodega", width: 15 },
        { header: "BODEGA", key: "bodega", width: 15 },
        { header: "COD_UBICACION", key: "ubicacion_cod", width: 15 },
        { header: "UBICACION", key: "ubicacion_nombre", width: 15 },
        { header: "CEDULA_CUSTODIO", key: "custodio_cedula", width: 15 },
        { header: "NOMBRE_CUSTODIO", key: "custodio_nombre", width: 15 },
        { header: "CUSTODIO_ACTIVO", key: "custodio_activo", width: 15 },
        { header: "ORIGEN_INGRESO", key: "origen_ingreso", width: 15 },
        { header: "TIPO_INGRESO", key: "tipo_ingreso", width: 15 },
        { header: "NUM_COMPROMISO", key: "numero_compromiso", width: 15 },
        { header: "ESTADO_ACTA", key: "estado_acta", width: 15 },
        { header: "CONTABILIZADO_ACTA", key: "contabilizado_acta", width: 15 },
        { header: "CONTABILIZADO_BIEN", key: "contabilizado_bien", width: 15 },
        { header: "DESCRIPCION", key: "descripcion", width: 15 },
        { header: "FECHA_COMPRA", key: "fecha_compra", width: 15 },
        { header: "ESTADO_LOGICO", key: "estado_logico", width: 15 },
        { header: "GARANTIA", key: "garantia", width: 15 },
        { header: "ANIOS_GARANTIA", key: "anios_garantia", width: 15 },
        { header: "INFO_ADICIONAL", key: "info_adicional", width: 15 },
        { header: "PROVEEDOR", key: "proveedor", width: 15 },
        { header: "CUSTODIO_INTERNO", key: "custodio_interno", width: 25 },
        { header: "UBICACION_INTERNA", key: "ubicacion_interna", width: 15 },
        { header: "FECHA_COMPRA_INTERNA", key: "fecha_compra_interno", width: 15 }
      ];

      // Add Array Rows
      worksheet.addRows(filas);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "totalBienes.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

    } else {
      const titulo = "BIENES";
      const bienes = await Reportes.obtenerBienesTotal();
      //console.log(bienes)
      if (bienes.length === 0) {
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
        });
      }

      const pdfBase64String = await generarPDFBienesTotal(bienes[0], titulo);
      res.json({
        status: true,
        message: "Reporte generado",
        body: pdfBase64String,

      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }
}






export default {
  generarReporteMarcas,
  marcasActivas,
  reporteOrigenIngreso,
  reporteTipoIngreso,
  reporteFechaCompraAnual,
  reporteBienesPorFechaCompra,
  reporteBienesConGarantia,
  reporteBienesConGarantiaPorFecha,
  prueba,
  reporteBienesPorCatalogo,
  reporteBienesPorUbicacion,
  reporteBienesPorMarca,
  reporteBienesPorDescripcion,
  reporteBienesPorhistorial,
  reporteBienesTotal
};
