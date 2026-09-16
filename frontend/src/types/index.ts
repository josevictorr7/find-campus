export type UserRole = 'aluno' | 'admin';

export interface Usuario {
  id_usuario: number;
  ra: string;
  nome: string;
  senha?: string;
  tipo: UserRole;
}

export interface Local {
  id: number;
  nome: string;
  bloco?: string;
}

export type ObjetoStatus = 'Perdido' | 'Encontrado' | 'Devolvido';

export interface Objeto {
  id_objeto: number;
  nome: string;
  descricao: string;
  cor: string;
  marca: string;
  status: ObjetoStatus;
  local: string;
  contato?: string;
  local_id?: string | number;
  usuario: number;
  // Resolved human-readable fields for UI display
  localNome?: string;
  localBloco?: string;
  usuarioNome?: string;
  usuarioRa?: string;
  dataCriacao?: string;
}

export interface Devolucao {
  id: number;
  objeto: number;
  usuario: number;
  data: string;
  observacao: string;
  // Resolved fields for UI display
  objetoNome?: string;
  usuarioNome?: string;
  usuarioRa?: string;
}

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalPerdidos: number;
  totalEncontrados: number;
  totalDevolvidos: number;
  totalUsuarios?: number;
  totalObjetos: number;
  totalDevolucoes?: number;
}
