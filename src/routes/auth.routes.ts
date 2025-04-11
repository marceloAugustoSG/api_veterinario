import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Rotas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Rotas protegidas (apenas admin)
router.get('/usuarios', authMiddleware, adminMiddleware, AuthController.getAll);
router.get('/usuarios/:id', authMiddleware, adminMiddleware, AuthController.getById);
router.put('/usuarios/:id', authMiddleware, adminMiddleware, AuthController.update);
router.delete('/usuarios/:id', authMiddleware, adminMiddleware, AuthController.delete);

export default router; 