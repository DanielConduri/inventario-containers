import { Router } from "express";
import routeMarcas from "../../controllers/inventarios/marcas.controllers.js";

const router = Router();

router.get('/filtrado', routeMarcas.filtrarMarcas);
router.get("/", routeMarcas.obtenerMarcas);
router.post("/", routeMarcas.insertarMarcas);
router.get("/detalle/:int_marca_id", routeMarcas.obtenerMarca);
router.get("/activo", routeMarcas.obtenerMarcasActivas);
router.put("/:int_marca_id", routeMarcas.actualizarMarcas);
router.delete("/:int_marca_id", routeMarcas.eliminarMarcas);


export default router;