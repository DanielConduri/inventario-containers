import { Router } from "express";
import routeRegistroMantenimientoCorrectivo from "../../controllers/mantenimiento/mantenimientoCorrectivo.controllers.js"
const router = Router();

router.post("/", routeRegistroMantenimientoCorrectivo.crearMantenimientoCorrectivo);
router.get("/", routeRegistroMantenimientoCorrectivo.obtenerMantenimientosCorrectivos);
router.get("/:id", routeRegistroMantenimientoCorrectivo.obtenerMantenimientoCorrectivoPorId);
router.put("/:id", routeRegistroMantenimientoCorrectivo.editarMantenimientoCorrectivo);
router.delete("/:id", routeRegistroMantenimientoCorrectivo.eliminarMantenimientoCorrectivo);



export default router;
