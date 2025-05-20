import { Router } from 'express';
import PacienteController from '../controllers/paciente.controller';

const router = Router();

router.get('/', PacienteController.getAll);
router.get('/:id', PacienteController.getById);
router.post('/', PacienteController.create);
router.put('/:id', PacienteController.update);
router.delete('/:id', PacienteController.delete);

export default router;
