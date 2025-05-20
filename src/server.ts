import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pacienteRoutes from './routes/paciente.routes';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticação
app.use(authMiddleware);

// Rotas protegidas
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/usuarios', authRoutes);

// Rota padrão
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'API do Sistema Veterinário' });
});

// Middleware de erro
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
