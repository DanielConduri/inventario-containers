import {Router} from "express";
import routeDocumento from "../../controllers/inventarios/documento.controllers.js"

const router = Router();

router.get("/", routeDocumento.obtenerDocumentos);
router.get("/:id", routeDocumento.obtenerDocumento);
router.post("/", routeDocumento.crearDocumento);
router.put("/:id", routeDocumento.actualizarDocumento);
router.get("/editar/:id", routeDocumento.obtenerDocumentoEspecifico);




export default router;