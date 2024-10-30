import { Router } from 'express';
import routeMantenimientoC from '../../controllers/mantenimiento/mantenimientoCorrectivo.controllers.js'

const router = Router();

router.post("/", routeMantenimientoC.crearMantenimientoCorrectivo);
router.get("/:id", routeMantenimientoC.obtenerMantenimientoCorrectivoPorId);
router.get("/", routeMantenimientoC.obtenerMantenimientosCorrectivos);
router.put("/:id", routeMantenimientoC.editarMantenimientoCorrectivo);

router.delete("/:id", routeMantenimientoC.eliminarMantenimientoCorrectivo);




export default router;