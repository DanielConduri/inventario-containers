import { Router } from "express";
import routeCentros from "../../controllers/inventarios/centros.controllers.js"
const upload = multer({ dest: 'uploads/' });
import multer from 'multer';
import verificarPermisoDelete from "../../middleware/verificarPermisoDelete.middleware.js";

const router = Router();
//router.get("/", routeCentros.obtenerCentros);

router.get("/filtrado", routeCentros.filtrarCentros);
router.get("/", routeCentros.obtenerSedes);
router.get("/tipo", routeCentros.obtenerDatosCentro);
router.get("/carreras", routeCentros.obtenerCarreras);
router.get("/procesos", routeCentros.obtenerProcesos);
router.post("/", routeCentros.insertarCentro);
router.get("/filtradoUbicaciones", routeCentros.filtrarUbicaciones);
router.get("/detalles/:detalleId", routeCentros.obtenerCentrosDetalles);

//obtener centros con paginacion

router.get("/paginacion", routeCentros.obtenerCentrosPaginacion);
//router.get("/:id_centro", routeCentros.obtenerCentro);

router.put("/:int_centro_id", routeCentros.actualizarCentro);
//router.put("/:id", routeCentros.obtenerCentrosApi);
router.delete("/:id_centro", routeCentros.eliminarCentro);
router.post("/csv", upload.single('file') , routeCentros.importarCsv);



router.get("/api", routeCentros.consumirServicioEspoch);

export default router;
