import { Router } from "express";
import firmaecController from "../../controllers/firma/firmaec.controllers.js"

const router = Router();

router.get(
    "/obtenerdoc/firma/:nombreArchivo",
    firmaecController.obtenerSolicitudFirmada
)

router.post('/firmar', firmaecController.firmarDocumento);

export default router