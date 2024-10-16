import { Router } from "express";
import routeReportes from "../../controllers/reportes/reportes.controllers.js";
const router = new Router();

router.get("/generarPdf", routeReportes.generarReporteMarcas);
router.get("/marcasActivas", routeReportes.marcasActivas);

//Bienes
router.get("/origenIngreso", routeReportes.reporteOrigenIngreso);
router.get("/tipoIngreso", routeReportes.reporteTipoIngreso);
router.get("/bienesFechaCompra", routeReportes.reporteBienesPorFechaCompra);
router.get("/bienesConGarantia", routeReportes.reporteBienesConGarantia);
router.get("/bienesConGarantiaPorFecha",routeReportes.reporteBienesConGarantiaPorFecha);
router.get("/bienesFechaCompra2", routeReportes.reporteFechaCompraAnual);


//Bienes por catalogo
router.get("/bienesPorCatalogo/:id", routeReportes.reporteBienesPorCatalogo);

//Bienes por marca
router.get("/bienesPorMarca/:id", routeReportes.reporteBienesPorMarca);



//Reporte 1

//Reporte 2 -- Bienes, manteniendo un registro de c/u con datos de identificación, ubicación, estado o
//condiciones y responsable de uso

router.get("/bienesPorHistorial/:id", routeReportes.reporteBienesPorhistorial);

//Reporte 3

//Reporte 4 -- Listar los bienes por dependencia y ubicación
router.get("/bienesPorUbicacion/:id", routeReportes.reporteBienesPorUbicacion);

//Reporte 5-- Informes técnicos emitido por un tecnico en un rango de fechas

//Reporte 6



//Reporte 8--Informe de equipos por marca

//Reporte 9 -- Bienes con garantía a la fecha que se generar el reporte

//Reporte 10--Excel ?


router.get("/prueba", routeReportes.prueba);





export default router;