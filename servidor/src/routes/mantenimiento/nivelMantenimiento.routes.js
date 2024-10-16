import { Router } from "express";
import routeNivelMantenimiento from "../../controllers/mantenimiento/nivelMantenimiento.controllers.js";

const router = Router();

router.post("/", routeNivelMantenimiento.crearNivelMantenimiento);
router.get("/:id", routeNivelMantenimiento.obtenerNivelMantenimientoPorId);
router.get("/", routeNivelMantenimiento.obtenerNivelesMantenimiento);
router.put("/:id", routeNivelMantenimiento.editarNivelMantenimiento);
router.delete("/:id", routeNivelMantenimiento.cambiarEstadoNivelMantenimiento)



export default router;