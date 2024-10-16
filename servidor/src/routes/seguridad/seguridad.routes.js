import { Router } from "express";

import controladorSeguridad from "../../controllers/seguridad/seguridad.controllers.js";
import verificarToken from "../../middleware/verificartoken.middleware.js";

const router = Router();
router.post ("/", controladorSeguridad.validarLogin);

//router.get("/",verificarToken,controladorSeguridad.obtenerUsuarios);





export default router;