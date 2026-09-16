import { Usuario } from '../types';
import { apiRequest } from './api';

export const userService = {
  async getAll(): Promise<Usuario[]> {
    const list = await apiRequest<any[]>('/usuarios');
    return list.map((u) => ({
      ...u,
      id_usuario: u.id_usuario ?? u.idUsuario,
    }));
  },

  async create(user: Omit<Usuario, 'id_usuario'>): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/usuarios', {
      method: 'POST',
      body: {
        ra: user.ra,
        nome: user.nome,
        senha: user.senha || '123',
        tipo: user.tipo,
      },
    });
    return res.ok;
  },

  async update(id_usuario: number, user: Partial<Usuario>): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/usuarios', {
      method: 'PUT',
      body: {
        id_usuario,
        ra: user.ra,
        nome: user.nome,
        senha: user.senha || '123',
        tipo: user.tipo,
      },
    });
    return res.ok;
  },

  async delete(id: number): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/usuarios', {
      method: 'DELETE',
      body: { id },
    });
    return res.ok;
  },
};

