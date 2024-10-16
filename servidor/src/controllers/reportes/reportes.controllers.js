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

const generarReporteMarcas = async (req, res) => {
  const filtro = {
    estado: "ACTIVO",
  };

  const titulo = "MARCAS";
  const marcas = await Reportes.obtenerMarcas(Bienes);

  // 3. Generar el PDF utilizando la plantilla y los datos formateados
  const pdfBase64String = await generarPDF(marcas, titulo);
  //console.log(pdfBase64String); // imprime la cadena Base64 del PDF generado
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
  const titulo = "CANTIDAD DE BIENES POR ORIGEN DE INGRESO";
  const origenIngreso = await Reportes.obtenerOrigenIngreso();

  const pdfBase64String = await generarPDFOrigenIngreso(origenIngreso, titulo);

  //Para visualizar el pdf en el navegador
/*
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
  */
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });
  
  
};

const reporteTipoIngreso = async (req, res) => {
  const titulo = "BIENES POR TIPO DE INGRESO";
  const tipoIngreso = await Reportes.obtenerTipoIngreso();

  const pdfBase64String = await generarPDFTipoIngreso(tipoIngreso, titulo);

  //Para visualizar el pdf en el navegador
/*
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
  */
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });

  
};

const reporteFechaCompraAnual = async (req, res) => {
  const titulo = "FECHA COMPRA - ANUAL";
  const fechaCompraAnual = await Reportes.obtenerBienesPorFechaCompraAnual();
  const pdfBase64String = await generarPDFFechaCompraAnual(
    fechaCompraAnual,
    titulo
  );

  //Para visualizar el pdf en el navegador
/*
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
*/
  
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });
  
};

const reporteBienesPorFechaCompra = async (req, res) => {
  const titulo = "BIENES POR FECHA DE COMPRA";
  const bienes = await Reportes.obtenerBienesPorFechaCompra();
  const pdfBase64String = await generarPDFBienesPorFechaCompra(bienes, titulo);

  //Para visualizar el pdf en el navegador
  /*
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
  res.send(Buffer.from(pdfBase64String, "base64"));
  */
  res.json({
    status: true,
    message: "Reporte generado",
    body: pdfBase64String,
  });
  
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
    console.log(req.query);

    const fechaString = req.query.fechaInicio;
    const fechaString2 = req.query.fechaFinal;
    console.log(fechaString);
    console.log(fechaString2);

    const bienes = await Reportes.obtenerBienesConGarantiaPorFechaCompra(
      fechaString,
      fechaString2
    );
    console.log(bienes);
    if(bienes.length === 0){
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
    //Para visualizar el pdf en el navegador
    /*
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    res.send(Buffer.from(pdfBase64String, "base64"));
    */
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
  try {
    const { id } = req.params;
    const titulo = "BIENES POR CATÁLOGO";
    //LLAMO A LA FUNCION QUE ME TRAE LOS BIENES POR CATALOGO
    const bienes = await Reportes.obtenerBienesPorCatalogo(id);
    if (bienes.length === 0) {
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
      });
    }
    //ENVIO LA DATA A LA FUNCION QUE GENERA EL PDF

    const pdfBase64String = await generarPDFBienesPorCatalogo(bienes, titulo);

    //Para visualizar el pdf en el navegador (para  probar)
    
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    // res.send(Buffer.from(pdfBase64String, "base64"));
    
    //Para enviar el pdf en el body y que se pueda ver en el front

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
};


const reporteBienesPorUbicacion = async (req, res) => {
  console.log('ingreso a bienes por ubicación')
  try {
    const titulo = "BIENES POR UBICACIÓN";
    //LLAMO A LA FUNCION QUE ME TRAE LOS BIENES POR CATALOGO
    const bienes = await Reportes.obtenerBienesPorUbicacion();
    console.log('bienes por ubicación', bienes[0])
    if(bienes[0] === 0){
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
      });
    }
     //ENVIO LA DATA A LA FUNCION QUE GENERA EL PDF
     const pdfBase64String = await generarPDFBienesPorUbicacion(bienes[0], titulo);
    
     //Para visualizar el pdf en el navegador (para  probar)
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    res.send(Buffer.from(pdfBase64String, "base64"));
    
    //Para enviar el pdf en el body y que se pueda ver en el front

    /*res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,

    });*/



  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }

    
 


}

//Reporte de bienes por marca
const reporteBienesPorMarca = async (req, res) => {
  try{
    const { id } = req.params;
    const titulo = "BIENES POR MARCA";
    //LLAMO A LA FUNCION QUE ME TRAE LOS BIENES POR MARCA
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

    //Para visualizar el pdf en el navegador (para  probar)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    res.send(Buffer.from(pdfBase64String, "base64"));


   //Para enviar el pdf en el body y que se pueda ver en el front

    //Para enviar el pdf en el body y que se pueda ver en el front

    /*res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,

    });*/
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }

}

const reporteBienesPorhistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const titulo = "HISTORIAL DEL BIEN";
    
    const bienes = await Reportes.obtenerBienPorHistorial(id);

    if (bienes[0] === 0) {
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
      });
    }

    //ENVIO LA DATA A LA FUNCION QUE GENERA EL PDF
    console.log('Historial del bien', bienes)
    const pdfBase64String = await generarPDFBienesPorHistorial(bienes[0], titulo);

    //Para visualizar el pdf en el navegador (para  probar)

    /*res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    res.send(Buffer.from(pdfBase64String, "base64"));*/

    //Para enviar el pdf en el body y que se pueda ver en el front

    res.json({
      status: true,
      message: "Reporte generado",
      body: pdfBase64String,

    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error al generar el reporte" + error,
    });
  }
};
//Comprobando los nuevos cambios 31/10/2023


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
  reporteBienesPorhistorial,
};
