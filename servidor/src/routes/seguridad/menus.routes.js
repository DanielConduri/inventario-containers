import { Router } from "express";
import routeMenus from "../../controllers/seguridad/menu.controllers.js";

const router = new Router();

router.post("/", routeMenus.crearMenu);
router.get("/", routeMenus.obtenerMenusSubmenus);
router.get("/all", routeMenus.obtenerMenus);
router.put("/:int_menu_id", routeMenus.actualizarMenu);
router.get("/:int_menu_id", routeMenus.obtenerMenuPorId);
router.delete("/:int_menu_id", routeMenus.eliminarMenu);
router.get("/submenus/:int_menu_id", routeMenus.obtenerSubmenusDeUnMenu);


export default router;