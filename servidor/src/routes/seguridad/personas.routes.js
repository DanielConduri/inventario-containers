import { Router } from "express";
import verificarPermisos from "../../middleware/verificarPermisos.middleware.js"
import routePersonas from "../../controllers/seguridad/persona.controllers.js"

const router = new Router();

router.get("/me", routePersonas.obtenerMiPerfil);
router.get("/filtrado", routePersonas.filtrarPersonas);
router.get("/",routePersonas.obtenerPersonas);
router.delete("/:per_id",routePersonas.eliminarPersona);
router.put("/:per_id",routePersonas.actualizarPersona);
router.get("/:per_id",routePersonas.obtenerPersona);




export default router;