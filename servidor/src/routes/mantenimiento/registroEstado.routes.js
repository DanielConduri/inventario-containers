import { Router } from "express";
import routeRegistroEstado from "../../controllers/mantenimiento/registroEstado.controllers.js"

const router = Router();

router.post("/", routeRegistroEstado.crearRegistroEstadoMantenimiento);
router.get("/:id", routeRegistroEstado.obtenerRegistroEstadoMantenimientoPorId);
router.get("/", routeRegistroEstado.obtenerRegistrosEstadoMantenimiento);
router.put("/:id", routeRegistroEstado.editarRegistroEstadoMantenimiento);
router.delete("/:id", routeRegistroEstado.cambiarRegistroEstadoMantenimiento);

export default router;
