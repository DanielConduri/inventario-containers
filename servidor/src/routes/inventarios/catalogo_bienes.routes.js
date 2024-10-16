import {Router} from "express";
import routeCatalogoBienes from "../../controllers/inventarios/catalogo_bienes.controllers.js";
const upload = multer({dest: 'uploads/'});
import multer from 'multer';

const router = Router();
router.get("/filtrado", routeCatalogoBienes.filtrarCatalogoBienes);
router.get("/", routeCatalogoBienes.obtenerCatalogoBienes);
router.post("/", routeCatalogoBienes.insertarCatalogoBien);
router.get("/:int_catalogo_bien_id", routeCatalogoBienes.obtenerCatalogoBien);
router.put("/:int_catalogo_bien_id", routeCatalogoBienes.actualizarCatalogoBien);
router.delete("/:int_catalogo_bien_id", routeCatalogoBienes.eliminarCatalogoBien);
router.post("/csv", upload.single('file'), routeCatalogoBienes.importarCatalogoBienes);




export default router;
