import { Router } from "express";
import routePrestamos from "../../controllers/prestamos/prestamos.controllers.js";

const router = Router();
router.get("/filtrado", routePrestamos.filtrarBienes);

router.get("/", routePrestamos.obtenerPrestamos);
router.post("/", routePrestamos.crearPrestamo);
router.get("/prestamosConEstado", routePrestamos.obtenerPrestamosEstado);
router.get("/:id", routePrestamos.obtenerPrestamoId);
router.put("/:id", routePrestamos.actualizarPrestamo);
router.post("/:id", routePrestamos.desactivarEstadoPrestamo);
router.get("/pdf/:id", routePrestamos.generarPdfPrestamo);
router.put("/pdf/:id", routePrestamos.agregarPDF);
router.get("/firma/:id", routePrestamos.obtenerDocumentoFirmado);
router.put("/nube/:id", routePrestamos.agregarPDFnube);
router.get("/validacion/:id", routePrestamos.bienesPrestamo);
router.get("/decano/:id", routePrestamos.peticionDecano);

router.get("/reporte", routePrestamos.reporteBienesOcupados);

router.get("/horario/:id", routePrestamos.obtenerHorarioId);


export default router;