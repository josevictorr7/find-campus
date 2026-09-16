import { Local } from '../types';
import { apiRequest } from './api';

export const locationService = {
  async getAll(): Promise<Local[]> {
    return apiRequest<Local[]>('/locais');
  },

  async create(nome: string, bloco: string): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/locais', {
      method: 'POST',
      body: { nome, bloco },
    });
    return res.ok;
  },

  async update(id: number, nome: string, bloco: string): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/locais', {
      method: 'PUT',
      body: { id, nome, bloco },
    });
    return res.ok;
  },

  async delete(id: number): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/locais', {
      method: 'DELETE',
      body: { id },
    });
    return res.ok;
  },
};

