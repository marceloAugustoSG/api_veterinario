import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
        token,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role = 'USER' } = req.body;

      // Verificar se o email já está em uso
      const existingUser = await prisma.usuario.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar o usuário
      const user = await prisma.usuario.create({
        data: {
          nome: name,
          email,
          senha: hashedPassword,
          role,
        },
      });

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      // Retornar o usuário e o token
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, senha, role } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verifica se o email já existe em outro usuário
      if (email && email !== usuario.email) {
        const emailExiste = await prisma.usuario.findUnique({
          where: { email },
        });
        if (emailExiste) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
      }

      const data: any = {};
      if (nome) data.nome = nome;
      if (email) data.email = email;
      if (senha) data.senha = await bcrypt.hash(senha, 10);
      if (role) data.role = role;

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id: Number(id) },
        data,
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await prisma.usuario.delete({
        where: { id: Number(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default new AuthController();
