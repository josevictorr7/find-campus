import { Objeto, ObjetoStatus } from '../types';
import { apiRequest } from './api';
import { userService } from './userService';

export const objectService = {
  async getAll(): Promise<Objeto[]> {
    const rawObjetos = await apiRequest<Objeto[]>('/objetos');

    const usuarios = await userService.getAll().catch(() => []);
    const userMap = new Map(usuarios.map((u) => [u.id_usuario, u.nome]));

    return rawObjetos.map((obj: any) => {
      const idObj = obj.id_objeto ?? obj.idObjeto ?? obj.id;
      
      // Captura o local das possíveis chaves que o Java ou MySQL possam retornar
      let rawLoc = obj.local ?? obj.local_id ?? obj.localId ?? '';
      if (typeof rawLoc === 'object' && rawLoc !== null) {
        rawLoc = rawLoc.nome || rawLoc.descricao || JSON.stringify(rawLoc);
      }
      
      const locStr = String(rawLoc).trim();
      const displayLoc = locStr && locStr !== 'null' && locStr !== 'undefined' ? locStr : 'Local não especificado';
      const usrId = obj.usuario;

      return {
        ...obj,
        id_objeto: idObj,
        local: displayLoc,
        localNome: displayLoc,
        usuario: usrId,
        usuarioNome: userMap.get(usrId) || `Usuário #${usrId}`,
      };
    });
  },

  async create(data: {
    nome: string;
    descricao: string;
    cor: string;
    marca: string;
    status: ObjetoStatus;
    local: string;
    contato?: string;
    usuario: number;
  }): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/objetos', {
      method: 'POST',
      body: {
        ...data,
        local_id: data.local,
      },
    });
    return res.ok;
  },

  async update(
    id_objeto: number,
    data: {
      nome: string;
      descricao: string;
      cor: string;
      marca: string;
      status: ObjetoStatus;
      local: string;
      contato?: string;
      usuario: number;
    }
  ): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/objetos', {
      method: 'PUT',
      body: {
        id_objeto,
        ...data,
        local_id: data.local,
      },
    });
    return res.ok;
  },

  async delete(id: number): Promise<boolean> {
    const res = await apiRequest<{ ok: boolean }>('/objetos', {
      method: 'DELETE',
      body: { id },
    });
    return res.ok;
  },
};

