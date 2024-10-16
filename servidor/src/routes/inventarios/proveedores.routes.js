import {Router} from "express";
import routeProveedores from "../../controllers/inventarios/proveedores.controllers.js";

const router = Router();

router.get("/", routeProveedores.obtenerProveedores);
router.post("/", routeProveedores.insertarProveedores);
router.get("/detalle/:int_proveedor_id", routeProveedores.obtenerProveedor);
router.get("/activo", routeProveedores.obtenerProveedoresActivos);
router.get("/ruc/:dato", routeProveedores.obtenerRucNombre);
router.put("/:int_proveedor_id", routeProveedores.actualizarProveedores);
router.delete("/:int_proveedor_id", routeProveedores.eliminarProveedores);

router.get("/filtrado", routeProveedores.filtradoProveedores);

export default router;
