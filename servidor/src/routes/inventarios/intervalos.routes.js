import { Router } from "express";
import routeIntervalos from "../../controllers/inventarios/intervalos.controllers.js"

const router = Router();

router.get("/", routeIntervalos.obtenerIntervalos);
router.get("/:int_intervalo_id", routeIntervalos.obtenerIntervalo);
router.post("/", routeIntervalos.crearIntervalo);
router.put("/:int_intervalo_id", routeIntervalos.actualizarIntervalo);

export default router;