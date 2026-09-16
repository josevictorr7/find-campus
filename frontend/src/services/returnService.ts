import { Devolucao } from '../types';
import { apiRequest } from './api';
import { objectService } from './objectService';
import { userService } from './userService';

export const returnService = {
  async getAll(): Promise<Devolucao[]> {
    const rawDevolucoes = await apiRequest<Devolucao[]>('/devolucoes');

    const [objetos, usuarios] = await Promise.all([
      objectService.getAll().catch(() => []),
      userService.getAll().catch(() => []),
    ]);

    const objMap = new Map(objetos.map((o) => [o.id_objeto, o.nome]));
    const userMap = new Map(usuarios.map((u) => [u.id_usuario, u.nome]));

    return rawDevolucoes.map((d) => ({
      ...d,
      objetoNome: objMap.get(d.objeto) || `Objeto #${d.objeto}`,
      usuarioNome: userMap.get(d.usuario) || `Usuário #${d.usuario}`,
    }));
  },

  async create(objetoId: number, usuarioId: number, observacao: string): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/devolucoes', {
      method: 'POST',
      body: {
        objeto: objetoId,
        usuario: usuarioId,
        observacao,
      },
    });
    return res.ok;
  },

  async update(id: number, objetoId: number, usuarioId: number, observacao: string): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/devolucoes', {
      method: 'PUT',
      body: {
        id,
        objeto: objetoId,
        usuario: usuarioId,
        observacao,
      },
    });
    return res.ok;
  },

  async delete(id: number): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/devolucoes', {
      method: 'DELETE',
      body: { id },
    });
    return res.ok;
  },
};

