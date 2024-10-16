import { Router } from "express";
import contraladorRoles from "../../controllers/seguridad/roles.controllers.js";
import verificarPermisoGet  from "../../middleware/verificarPermisoGet.middleware.js";
import verificarPermisoDelete  from "../../middleware/verificarPermisoDelete.middleware.js";

const router = Router();
router.get("/",contraladorRoles.obtenerRoles);
router.get("/:rol_id", contraladorRoles.obtenerRol);
router.post("/",contraladorRoles.insertarRol);
router.put("/:rol_id", contraladorRoles.actualizarRol);

router.delete("/:rol_id", contraladorRoles.eliminarRol);


export default router;