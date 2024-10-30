import { Router } from "express";
import routeReportes from "../../controllers/reportes/reportes.controllers.js";
import routeReportesMantenimiento from "../../controllers/reportes/reportesMantenimiento.controllers.js";
const router = new Router();

router.get("/generarPdf", routeReportes.generarReporteMarcas);
router.get("/marcasActivas", routeReportes.marcasActivas);

//Bienes
router.get("/origenIngreso/:valor", routeReportes.reporteOrigenIngreso);
router.get("/tipoIngreso/:valor", routeReportes.reporteTipoIngreso);
router.get("/bienesFechaCompra/:valor", routeReportes.reporteBienesPorFechaCompra);
router.get("/bienesConGarantia", routeReportes.reporteBienesConGarantia);
router.get("/bienesConGarantiaPorFecha",routeReportes.reporteBienesConGarantiaPorFecha);
router.get("/bienesFechaCompra2/:valor", routeReportes.reporteFechaCompraAnual);
router.get("/totalBienes/:valor", routeReportes.reporteBienesTotal);

router.get("/bienesPorCatalogo/:id/:valor", routeReportes.reporteBienesPorCatalogo);


router.get("/bienesPorMarca/:id/:valor", routeReportes.reporteBienesPorMarca);
router.get("/bienesPorDescripcion/:data/:valor", routeReportes.reporteBienesPorDescripcion);

router.get("/bienesPorHistorial/:id/:valor", routeReportes.reporteBienesPorhistorial);

router.get("/bienesPorUbicacion/:id/:responsable/:valor", routeReportes.reporteBienesPorUbicacion);

//mantenimiento

router.get("/bienesMantenimientoCorrectivoPorFechas", routeReportesMantenimiento.reporteBienesMantenimientoCorrectivoPorFechas);
router.get("/mantenimientosCorrectivosPorCodigoBien", routeReportesMantenimiento.reporteMantenimientosCorrectivosPorCodigoBien);
router.get("/mantenimientosCorrectivosPorTecnicoFechas", routeReportesMantenimiento.reporteMantenimientosCorrectivosPorTecnicoFechas);
router.get("/bienesMantenimientoPreventivoPorPlanificacion/:int_planificacion_id", routeReportesMantenimiento.reporteBienesMantenimientoPreventivoPorPlanificacion);
router.get("/mantenimientoPreventivoPorCentro", routeReportesMantenimiento.reporteMantenimientoPreventivoPorCentro)




router.get("/prueba", routeReportes.prueba);





export default router;