import { Router } from "express";
import routeEstadoMantenimiento from "../../controllers/mantenimiento/estado.controllers.js";

const router = Router();

router.post("/", routeEstadoMantenimiento.crearEstadoMantenimiento);
router.get("/:id", routeEstadoMantenimiento.obtenerEstadoMantenimientoPorId);
router.get("/", routeEstadoMantenimiento.obtenerEstadosMantenimiento);
router.put("/:id", routeEstadoMantenimiento.editarEstadoMantenimiento);
router.delete("/:id", routeEstadoMantenimiento.cambiarEstadoMantenimiento);

export default router;