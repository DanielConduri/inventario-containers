import {Router} from "express";
import routeCustodios from "../../controllers/inventarios/custodios.controllers.js";

const router = Router();

router.get("/", routeCustodios.obtenerCustodios);
router.get("/:int_custodio_id", routeCustodios.obtenerCustodio);

export default router;