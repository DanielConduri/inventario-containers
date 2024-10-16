import { Router } from "express";
import routeEstados  from "../../controllers/inventarios/estados.controllers.js";

const router = Router();

router.get("/", routeEstados.obtenerEstados);
router.post("/", routeEstados.insertarEstado);
router.get("/detalle/:int_estado_bien_id", routeEstados.obtenerEstado);
router.get("/activo", routeEstados.obtenerEstadosActivos);
router.put("/:int_estado_bien_id", routeEstados.actualizarEstado);
router.delete("/:int_estado_bien_id", routeEstados.eliminarEstado);



export default router;