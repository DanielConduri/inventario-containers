import { Router } from 'express';
import routeMantenimiento from '../../controllers/inventarios/mantenimiento.controllers.js';

const router = Router();

router.post("/", routeMantenimiento.crearBienMantenimiento);
router.get("/:id", routeMantenimiento.obtenerBienMantenimientoPorId);
router.get("/", routeMantenimiento.obtenerBienesMantenimiento);
router.put("/:id", routeMantenimiento.editarBienMantenimiento);
router.delete("/:id", routeMantenimiento.cambiarBienMantenimiento);



export default router;