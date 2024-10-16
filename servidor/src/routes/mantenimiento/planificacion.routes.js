import { Router } from "express";
import routePlanificacion from "../../controllers/mantenimiento/planificacion.controllers.js";

const router = Router();

router.post("/", routePlanificacion.crearPlanificacion);
router.get("/:id", routePlanificacion.obtenerPlanificacionPorId);
router.get("/", routePlanificacion.obtenerPlanificaciones);
router.put("/:id", routePlanificacion.actualizarPlanificacion);
router.delete("/:id", routePlanificacion.cambiarEstadoPlanificacion)

export default router;
