import { Router } from 'express';
import routeEstadosP from '../../controllers/prestamos/estados.controllers.js';

const router = Router();

router.get("/", routeEstadosP.obtenerEstadosPrestamo);
router.post("/", routeEstadosP.crearEstadoPrestamo);
router.get("/:id", routeEstadosP.obtenerEstadoPrestamo);
router.put("/:id", routeEstadosP.editarEstadoPrestamo);
router.delete("/:id", routeEstadosP.cambiarEstadoPrestamo);

export default router;