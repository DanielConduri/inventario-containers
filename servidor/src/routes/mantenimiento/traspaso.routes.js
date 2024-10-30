import { Router } from "express";
import routeTraspaso from "../../controllers/mantenimiento/traspaso.controllers.js";

const router = Router();

router.post("/", routeTraspaso.crearTranspaso);
router.get("/:id", routeTraspaso.historialTraspasoById);

export default router;