import { Router } from "express";
import routeSoporte from "../../controllers/mantenimiento/soporte.controllers.js";

const router = Router();

router.post("/", routeSoporte.crearSoporte);
router.get("/:id", routeSoporte.obtenerSoportePorId);
router.get("/", routeSoporte.obtenerSoportes);
router.put("/:id", routeSoporte.editarSoporte);
router.delete("/:id", routeSoporte.cambiarEstadoSoporte);

export default router;  

