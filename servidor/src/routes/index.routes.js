import { Router } from "express";

import rolesRoute from "../routes/seguridad/roles.routes.js";
import personasRoute from "./seguridad/personaRol.routes.js";
import usuariosRoute from "./seguridad/personas.routes.js";
import seguridadRoute from "../routes/seguridad/seguridad.routes.js";
import centralizadaRoute from "../routes/seguridad/rutaExterna.routes.js";
import centrosRoute from "../routes/inventarios/centros.routes.js";
import verificarToken from "../middleware/verificartoken.middleware.js";
import menusRoute from "../routes/seguridad/menus.routes.js";
import permisosRoute from "../routes/seguridad/permisos.routes.js";
import bienesRoute from "../routes/inventarios/bienes.routes.js";
import marcasRoute from "../routes/inventarios/marcas.routes.js"
import proveedoresRoute from "../routes/inventarios/proveedores.routes.js"
import estadosRoute from "../routes/inventarios/estados.routes.js"
import catalogoBienesRoute from "../routes/inventarios/catalogo_bienes.routes.js"
import reportesRoute from "../routes/reportes/reportes.routes.js"
import custodiosRoute from "../routes/inventarios/custodios.routes.js"
import documentosRoute from "./inventarios/documento.routes.js"
import tipoDocumentosRoute from "./inventarios/tipo_documento.routes.js"
import mantenimientoRoute from './mantenimiento/mantenimiento.routes.js';
import nivelMantenimientoRoute from './mantenimiento/nivelMantenimiento.routes.js';
import verificarPermisos from "../middleware/verificarPermisos.middleware.js"

//Rutas para mantenimiento
import planificacionBienRoute from "./mantenimiento/planificacion_bien.routes.js";
import planificacionRoute from "./mantenimiento/planificacion.routes.js";
import soporteRoute from "./mantenimiento/soporte.routes.js"
import estadosMantenimientoRoute from "./mantenimiento/estado.routes.js"
import registroBienRoute from "./mantenimiento/registroBien.routes.js"
import registroEstadoRoute from "./mantenimiento/registroEstado.routes.js"
import registroRoute from "./mantenimiento/registro.routes.js"
import registroPreventivoRoute from "./mantenimiento/mantenimientoPreventivo.routes.js"
import registroCorrectivoRoute from "./mantenimiento/mantenimientoCorrectivo.routes.js"
import tipoMantenimientoRoute from "./mantenimiento/tipo_mantenimiento.routes.js";

const router = Router();
const url = "/wsinventario";

router.use(url + "/login", seguridadRoute);

router.get(url + "/info", (req, res, next) => {
  res.json({
    status: 200,
    message: "OK",
    version: "1.2",
  });
});


//router.use(verificarToken); //verificarToken

router.use(url + "/roles", rolesRoute);
//app.use(validarCookies);
router.use(url + "/personas", personasRoute);         //perfiles de la tabla tb_perfiles
router.use(url + "/usuarios", usuariosRoute);         // usuarios de la tabla tb_personas
router.use(url + "/centralizadas", centralizadaRoute);
// verificar si se usa luego
router.use(url + "/menus", menusRoute);
router.use(url + "/permisos",permisosRoute);
router.use(url + "/marcas", marcasRoute);                //Marcas
router.use(url + "/estados", estadosRoute);              //Estados
router.use(url + "/proveedores", proveedoresRoute);      //Proveedores
router.use(url + "/centros", centrosRoute);
router.use(url + "/bienes", bienesRoute);                   //Bienes
router.use(url + "/catalogo_bienes", catalogoBienesRoute);  //Catalogo de bienes
router.use(url + "/reportes", reportesRoute);               //Reportes
router.use(url + "/custodios", custodiosRoute);             //Custodios
router.use(url + "/documentos", documentosRoute);           //Documentos
router.use(url + "/tipo_documento", tipoDocumentosRoute);   //Tipos de documentos 
router.use(url + "/nivel_mantenimiento", nivelMantenimientoRoute);
router.use(url + "/planificacion_bien", planificacionBienRoute);
router.use(url + url + "/planificacion", planificacionRoute);
router.use(url + "/soporte", soporteRoute);
router.use(url + "/tipo_mantenimiento", tipoMantenimientoRoute);

router.use(url + "/mantenimiento", mantenimientoRoute);
router.use(url + "/estado_mantenimiento", estadosMantenimientoRoute);

router.use(url + "/registro", registroRoute);
router.use(url + "/registro_preventivo", registroPreventivoRoute);
router.use(url + "/registro_correctivo", registroCorrectivoRoute);

router.use(url + "/registro_bien", registroBienRoute);
router.use(url + "/registro_estado", registroEstadoRoute );

export default router;
