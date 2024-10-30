//mantenimiento

import generarPDFBienesMantenimientoCorrectivoPorFechas from "../../utils/reportes/mantenimiento/bienesPorFechas.js";
import generarPDFMantenimientosCorrectivosPorCodigoBien from "../../utils/reportes/mantenimiento/historialMantenimiento.js";
import Reportes from "../../utils/datosReportesMantenimiento.utils.js";
import generarPDFMantenimientosCorrectivosPorTecnicoFechas from "../../utils/reportes/mantenimiento/mantenimientosPorTecnicoFechas.js";
import generarPDFBienesMantenimientoPreventivoPorPlanificacion from "../../utils/reportes/mantenimiento/mantenimientoPreventivoPorPlanificacion.js";
import generarPDFMantenimientoPreventivoCentro from "../../utils/reportes/mantenimiento/preventivoCentro.js";




const reporteBienesMantenimientoCorrectivoPorFechas = async (req, res) => {
    try {
      const titulo = "BIENES CON MANTENIMIENTO CORRECTIVO";
      const fechaString = req.query.fechaInicio;
      const fechaString2 = req.query.fechaFinal;
      
      const bienes = await Reportes.obtenerBienesMantenimientoCorrectivoPorFechas(fechaString, fechaString2);
      if(bienes.length === 0){
        return res.json({
          status: false,
          message: "No hay datos para generar el reporte",
          body: null,
        });
      }
      const pdfBase64String = await generarPDFBienesMantenimientoCorrectivoPorFechas(bienes, titulo, fechaString, fechaString2);
  
          //Para visualizar el pdf en el navegador
      
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
      // res.send(Buffer.from(pdfBase64String, "base64"));
      
  
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

const reporteBienesMantenimientoPreventivoPorPlanificacion = async (req, res) => {
  console.log('lo que llega al black --->', req.params)
  try {
    
    const bienes = await Reportes.obtenerBienesMantenimientoPreventivoPorPlanificacion(req.params.int_planificacion_id);
    console.log('los bienes vienen ----->', bienes)
    if(bienes.length === 0){
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
        body: null,
      });
    }
    const pdfBase64String = await generarPDFBienesMantenimientoPreventivoPorPlanificacion(bienes, "BIENES CON MANTENIMIENTO PREVENTIVO POR PLANIFICACIÓN");

        //Para visualizar el pdf en el navegador
    
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    // res.send(Buffer.from(pdfBase64String, "base64"));
    

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

const reporteMantenimientoPreventivoPorCentro = async (req, res) => {
  try {
    console.log('lo que llega en lo de centro --->', req.params)
    console.log('lo que llega en lo de centro --->', req.query)
    console.log('lo que llega en lo de centro --->', req.body)
    const titulo = "MANTENIMIENTO PREVENTIVO POR CENTRO";
    const mantenimientos = await Reportes.obtenerMantenimientoPreventivoPorCentro(req.query.int_planificacion_id);
    console.log('lo que sale al final ->', mantenimientos)
    if(mantenimientos.length === 0){
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
        body: null,
      });
    }


    const pdfBase64String = await generarPDFMantenimientoPreventivoCentro(mantenimientos, titulo);
    // console.log('lo que sale al final ->', pdfBase64String)
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

const reporteMantenimientosCorrectivosPorCodigoBien = async (req, res) => {
  try {
    const titulo = "MANTENIMIENTOS CORRECTIVOS POR CÓDIGO DE BIEN";
    const str_codigo_bien = req.query.str_codigo_bien;
    
    const mantenimientos = await Reportes.obtenerMantenimientosCorrectivosPorCodigoBien(str_codigo_bien);
    //console.log(mantenimientos)
    if(mantenimientos.length === 0){
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
        body: null,
      });
    }
    const pdfBase64String = await generarPDFMantenimientosCorrectivosPorCodigoBien(
      mantenimientos, 
      titulo, str_codigo_bien
    );
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

const reporteMantenimientosCorrectivosPorTecnicoFechas = async (req, res) => {
  console.log('lo que llega --->', req.query)
  try {
    const mantenimientos = await Reportes.obtenerMantenimientosCorrectivosPorTecnicoFechas(req.query.fechaInicio, req.query.fechaFinal, req.query.str_mantenimiento_correctivo_tecnico_responsable);
    if(mantenimientos.length === 0){
      return res.json({
        status: false,
        message: "No hay datos para generar el reporte",
        body: null,
      });
    }
    const pdfBase64String = await generarPDFMantenimientosCorrectivosPorTecnicoFechas(mantenimientos, "MANTENIMIENTOS CORRECTIVOS POR TÉCNICO", req.query.fechaInicio, req.query.fechaFinal);

        //Para visualizar el pdf en el navegador
    
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
    // res.send(Buffer.from(pdfBase64String, "base64"));
    

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


export default {
    reporteBienesMantenimientoCorrectivoPorFechas,
    reporteMantenimientosCorrectivosPorCodigoBien,
    reporteMantenimientosCorrectivosPorTecnicoFechas,
    reporteBienesMantenimientoPreventivoPorPlanificacion,
    reporteMantenimientoPreventivoPorCentro
}