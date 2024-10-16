import { Router } from "express";
import routePermisos from "../../controllers/seguridad/permisos.controllers.js";

const router = new Router();
//obtener todos los permisos de la tabla permisos
router.get("/", routePermisos.obtenerPermisos);

//obtener todos los permisos de un perfil para editar
router.get("/:id", routePermisos.obtenerPermisosPorPerfil);

//obtener todos los permisos de un rol para mostrar en el front
router.get("/rol/:rol", routePermisos.obtenerPermisosPorRol);

//crear un permiso a un perfil
//router.post("/:id_perfil", routePermisos.crearPermiso);

//actualizar un permiso a un perfil
router.put("/:id_perfil", routePermisos.actualizarPermiso);



export default router;