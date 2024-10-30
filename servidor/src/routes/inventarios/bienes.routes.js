import { Router } from "express";
import routeBienes from "../../controllers/inventarios/bienes.controllers.js";
const upload = multer({ dest: 'uploads/' });
import multer from 'multer';

const router = Router();

router.get("/filtrado", routeBienes.filtrarBienes);
router.get("/actualizar", routeBienes.actualizarBienes);
router.get("/rendimiento", routeBienes.pruebaRendimiento);
router.get("/actualizar/:id_bien", routeBienes.obtenerBienActualizado);
router.get("/rendimiento", routeBienes.pruebaRendimiento)
router.get('/historial/archivos', routeBienes.obtenerHistorialArchivos);
router.get('/historial/archivos/:id_archivo', routeBienes.obtenerHistorialArchivosPorId);
router.delete('/informacionAdicional/:idBien/:idArray', routeBienes.eliminarInformacionAdicional);


router.get("/detalles/:id_bien", routeBienes.obtenerBien);
router.get("/", routeBienes.obtenerBienes);
router.post("/", routeBienes.insertarBien);

router.get("/custodio", routeBienes.obtenerBienesPorCustodio);
router.get("/cedula/:strCedula", routeBienes.obtenerbienesPorCedula)

//router.post("/importar", routeBienes.importarBienes);
router.post("/csv/:num_filas/:resolucion/:columnas", upload.single('file') , routeBienes.importarCsv);// /:resolucion

router.get("/insertar", routeBienes.insertarTablas);
router.get("/garantia", routeBienes.actualizarGarantia);
router.put("/:id_bien", routeBienes.insertarInformacionAdicional);

router.get("/json/datos", routeBienes.obtenerBienesJson); //ruta de prueba

export default router;