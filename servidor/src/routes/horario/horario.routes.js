import { Router } from "express";

import horarioControllers from '../../controllers/horario/horario.controllers.js';

const router = Router();

router.post('/centro', horarioControllers.createHorario);
router.get('/centro/:id_centro', horarioControllers.getHorario);

export default router;