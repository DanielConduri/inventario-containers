import { Router } from "express";
import routeFechaP from "../../controllers/prestamos/fechaPrestamo.controllers.js";

const router = Router();

router.get("/", routeFechaP.obtenerFechaPrestamo);
router.post("/", routeFechaP.crearFechaPrestamo);

export default router;