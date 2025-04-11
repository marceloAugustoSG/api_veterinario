import { Request, Response } from 'express';
import PacienteService from '../services/paciente.service';

const pacienteService = new PacienteService();

class PacienteController {
  async getAll(req: Request, res: Response) {
    try {
      const pacientes = await pacienteService.getAll();
      res.json(pacientes);
    } catch (error) {
      console.error('Erro detalhado no getAll:', error);
      res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paciente = await pacienteService.getById(Number(id));
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }
      res.json(paciente);
    } catch (error) {
      console.error('Erro detalhado no getById:', error);
      res.status(500).json({ error: 'Erro ao buscar paciente' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log('Dados recebidos:', req.body);
      const paciente = await pacienteService.create(req.body);
      res.status(201).json(paciente);
    } catch (error) {
      console.error('Erro detalhado no create:', error);
      res.status(400).json({ 
        error: 'Erro ao criar paciente',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paciente = await pacienteService.update(Number(id), req.body);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }
      res.json(paciente);
    } catch (error) {
      console.error('Erro detalhado no update:', error);
      res.status(400).json({ error: 'Erro ao atualizar paciente' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await pacienteService.delete(Number(id));
      if (!success) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro detalhado no delete:', error);
      res.status(500).json({ error: 'Erro ao deletar paciente' });
    }
  }
}

export default new PacienteController(); 