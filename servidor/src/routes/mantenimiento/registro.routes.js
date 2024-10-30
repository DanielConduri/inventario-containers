import { Router } from "express";
import routeRegistro from "../../controllers/mantenimiento/registro.controllers.js"
const router = Router();

router.post("/", routeRegistro.crearRegistroMantenimiento);
router.get("/:id", routeRegistro.obtenerRegistroMantenimientoPorId);
router.get("/", routeRegistro.obtenerRegistrosMantenimiento);
router.put("/:id", routeRegistro.editarRegistroMantenimiento);
router.delete("/:id", routeRegistro.cambiarRegistroMantenimiento);

/*router.post("/preventivo", routeRegistroMantenimientoPreventivo.crearMantenimientoPreventivo);
router.get("/preventivo/:id", routeRegistroMantenimientoPreventivo.obtenerMantenimientoPreventivoPorId);
router.get("/preventivo", routeRegistroMantenimientoPreventivo.obtenerMantenimientosPreventivos);
router.put("/preventivo/:id", routeRegistroMantenimientoPreventivo.editarMantenimientoPreventivo);
router.delete("/preventivo/:id", routeRegistroMantenimientoPreventivo.eliminarMantenimientoPreventivo);

router.post("/correctivo", routeRegistroMantenimientoCorrectivo.crearMantenimientoCorrectivo);
router.get("/correctivo", routeRegistroMantenimientoCorrectivo.obtenerMantenimientosCorrectivos);
router.get("/correctivo/:id", routeRegistroMantenimientoCorrectivo.obtenerMantenimientoCorrectivoPorId);
router.put("/correctivo/:id", routeRegistroMantenimientoCorrectivo.editarMantenimientoCorrectivo);
router.delete("/correctivo/:id", routeRegistroMantenimientoCorrectivo.eliminarMantenimientoCorrectivo);*/



export default router;


