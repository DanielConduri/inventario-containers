import { Router } from "express";
//ocuperemos personaRol
import routePerfiles from "../../controllers/seguridad/personaRol.controllers.js";
const upload = multer({ dest: 'uploads/' });
import multer from 'multer';


const router= Router();
router.post("/", routePerfiles.insertarPersonaRol);

router.delete("/perfiles/:id",routePerfiles.eliminarPersonaRol);

//obtener datos de una persona dado el per_id
router.get("/:id",routePerfiles.obtenerPersonaRol);


router.put("/perfiles/:id_perfil",routePerfiles.actualizarPersonaRol);

router.post("/perfiles", routePerfiles.insertarPerfil);

router.get("/perfiles/:id",routePerfiles.perfilesPersona);

//Obtener datos de un perfil dado el id del perfil
router.get("/perfiles/datos/:id",routePerfiles.obtenerDatosPerfil);

//obtener datos de una persona dado un id de perfil desde el frontend
router.get("/usuario/:int_per_id",routePerfiles.personaPerfilId);

//importar usuarios desde un archivo csv
router.post("/csv", upload.single('file') , routePerfiles.importarCsv); 


export default router;