import { Router } from "express";
import routeTipoMantenimiento from "../../controllers/mantenimiento/tipoMantenimiento.controllers.js";

const router = Router();

router.post("/", routeTipoMantenimiento.crearTipoMantenimiento);
router.get("/:id", routeTipoMantenimiento.obtenerTipoMantenimientoPorId);
router.get("/", routeTipoMantenimiento.obtenerTiposMantenimiento);
router.put("/:id", routeTipoMantenimiento.actualizarTipoMantenimiento);
router.delete("/:id", routeTipoMantenimiento.cambiarEstadoTipoMantenimiento);

export default router;
