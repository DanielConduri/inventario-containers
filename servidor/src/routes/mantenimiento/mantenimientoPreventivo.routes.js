import { Router } from "express";
import routeRegistroMantenimientoPreventivo from "../../controllers/mantenimiento/mantenimientoPreventivo.controllers.js"
const router = Router();

router.post("/", routeRegistroMantenimientoPreventivo.crearMantenimientoPreventivo);
router.get("/:id", routeRegistroMantenimientoPreventivo.obtenerMantenimientoPreventivoPorId);
router.get("/", routeRegistroMantenimientoPreventivo.obtenerMantenimientosPreventivos);
router.put("/:id", routeRegistroMantenimientoPreventivo.editarMantenimientoPreventivo);
router.delete("/:id", routeRegistroMantenimientoPreventivo.eliminarMantenimientoPreventivo);

export default router;
