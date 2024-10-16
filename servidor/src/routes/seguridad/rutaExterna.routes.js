import { Router } from "express";
import controladorCentralizado from "../../controllers/seguridad/centralizada.controllers.js";
const router = Router();

router.get("/:cedula",controladorCentralizado.obtenerUsuariosCentralizado);
export default router;