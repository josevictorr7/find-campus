import { Usuario } from '../types';
import { apiRequest } from './api';

export const authService = {
  async login(ra: string, senha: string): Promise<Usuario> {
    const user = await apiRequest<any>('/login', {
      method: 'POST',
      body: { ra, senha },
    });
    return {
      ...user,
      id_usuario: user.id_usuario ?? user.idUsuario,
    };
  },
};

