import Route from 'express'
import routeTipoDocumento from '../../controllers/inventarios/tipo_documento.controllers.js'

const router = Route()

router.get('/:id', routeTipoDocumento.obtenerTipoDocumento)
router.get('/', routeTipoDocumento.obtenerTiposDocumentos)
router.post('/', routeTipoDocumento.crearTipoDocumento)
router.put('/:id', routeTipoDocumento.actualizarTipoDocumento)
router.get('/filtrado', routeTipoDocumento.filtrarTiposDocumentos)
router.delete('/:id', routeTipoDocumento.eliminarTipoDocumento)

export default router



