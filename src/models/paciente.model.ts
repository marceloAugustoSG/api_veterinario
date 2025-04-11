export interface Paciente {
  id: number;
  nome: string;
  especie: string;
  raca?: string | null;
  idade?: number | null;
  proprietario: string;
  createdAt: Date;
  updatedAt: Date;
} 