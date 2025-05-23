import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acesso negado. Apenas administradores podem acessar esta rota.',
    });
  }
  next();
};
