import { Router } from "express";
import routeRegistroBien from "../../controllers/mantenimiento/registroBien.controllers.js"

const router = Router();

router.post("/", routeRegistroBien.crearRegistroBienMantenimiento);
router.get("/:id", routeRegistroBien.obtenerRegistroBienMantenimientoPorId);
router.get("/", routeRegistroBien.obtenerRegistrosBienMantenimiento);
router.put("/:id", routeRegistroBien.editarRegistroBienMantenimiento);
router.delete("/:id", routeRegistroBien.cambiarRegistrobienMantenimiento);

export default router;
