import { PrismaClient } from '@prisma/client';
import { Paciente } from '../models/paciente.model';

const prisma = new PrismaClient();

class PacienteService {
  async getAll(): Promise<Paciente[]> {
    try {
      return await prisma.paciente.findMany();
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Paciente | null> {
    try {
      return await prisma.paciente.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }

  async create(
    paciente: Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Paciente> {
    try {
      console.log('Dados do paciente:', paciente);
      return await prisma.paciente.create({
        data: paciente,
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }

  async update(
    id: number,
    paciente: Partial<Paciente>
  ): Promise<Paciente | null> {
    try {
      return await prisma.paciente.update({
        where: { id },
        data: paciente,
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await prisma.paciente.delete({
        where: { id },
      });
      return !!result;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }
}

export default PacienteService;
