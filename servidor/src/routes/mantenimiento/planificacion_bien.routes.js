import { Router } from "express";
import routePlanificacionBien from "../../controllers/mantenimiento/planificacionBien.controllers.js";

const router = Router();

router.post("/", routePlanificacionBien.crearPlanificacionBien);
router.get("/:id", routePlanificacionBien.obtenerPlanificacionBienPorId);
router.get("/", routePlanificacionBien.obtenerPlanificacionesBien);
router.put("/:id", routePlanificacionBien.actualizarPlanificacionBien);
router.delete("/:id", routePlanificacionBien.cambiarEstadoPlanificacionBien)

export default router;


