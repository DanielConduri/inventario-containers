import { Router } from "express";

import routeCentroIntervalos from "../../controllers/inventarios/centrosIntervalos.controllers.js"

const router = Router();

router.get("/", routeCentroIntervalos.obtenerCentrosIntervalos);
router.get("/disponibles", routeCentroIntervalos.obtenerDisponiblesPorFechaPorCentro);
router.get("/:int_centro_intervalo_id", routeCentroIntervalos.obtenerCentroIntervalo);
router.post("/", routeCentroIntervalos.crearCentroIntervalo);
router.put("/:int_centro_intervalo_id", routeCentroIntervalos.actualizarCentroIntervalo);


export default router;