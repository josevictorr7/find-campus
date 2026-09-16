import React, { useState, useEffect, useMemo } from 'react';
import { userService } from '../services/userService';
import { Usuario, UserRole } from '../types';
import { useToast } from '../contexts/ToastContext';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { Users as UsersIcon, PlusCircle, Edit2, Trash2 } from 'lucide-react';

export const Users: React.FC = () => {
  const { showToast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [ra, setRa] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<UserRole>('aluno');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const list = await userService.getAll();
      setUsuarios(list);
    } catch (err) {
      console.error('Error loading users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsuarios = useMemo(() => {
    if (!search.trim()) return usuarios;
    const term = search.toLowerCase().trim();
    return usuarios.filter(
      (u) => u.nome.toLowerCase().includes(term) || u.ra.toLowerCase().includes(term)
    );
  }, [usuarios, search]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setRa('');
    setNome('');
    setSenha('123');
    setTipo('aluno');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setEditingUser(user);
    setRa(user.ra);
    setNome(user.nome);
    setSenha(user.senha || '123');
    setTipo(user.tipo);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ra.trim() || !nome.trim()) {
      showToast('error', 'Campos obrigatórios', 'Preencha o RA e o Nome do usuário.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        const ok = await userService.update(editingUser.id_usuario, {
          ra: ra.trim(),
          nome: nome.trim(),
          senha: senha.trim() || '123',
          tipo,
        });
        if (ok) {
          showToast('success', 'Usuário atualizado', 'Informações alteradas com sucesso.');
        } else {
          showToast('error', 'Erro ao atualizar', 'Não foi possível atualizar o usuário.');
        }
      } else {
        const ok = await userService.create({
          ra: ra.trim(),
          nome: nome.trim(),
          senha: senha.trim() || '123',
          tipo,
        });
        if (ok) {
          showToast('success', 'Usuário criado', 'Novo usuário cadastrado no sistema.');
        } else {
          showToast('error', 'Erro ao cadastrar', 'Não foi possível criar o usuário. Verifique se o RA já existe.');
        }
      }
      setIsFormOpen(false);
      loadUsers();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao salvar usuário.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      const ok = await userService.delete(deletingUser.id_usuario);
      if (ok) {
        showToast('success', 'Usuário excluído', 'O registro do usuário foi removido.');
        setDeletingUser(null);
        loadUsers();
      } else {
        showToast('error', 'Não foi possível excluir', 'O usuário possui objetos ou devoluções vinculados.');
      }
    } catch (err: any) {
      showToast('error', 'Erro ao excluir', 'Não foi possível excluir o usuário. Verifique se ele possui vínculos no sistema.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Usuario>[] = [
    {
      header: 'Registro Acadêmico (RA)',
      accessor: (row) => <span className="font-mono font-bold text-slate-800">{row.ra}</span>,
    },
    {
      header: 'Nome Completo',
      accessor: (row) => <span className="font-medium text-slate-800">{row.nome}</span>,
    },
    {
      header: 'Tipo de Acesso',
      accessor: (row) => (
        <Badge variant={row.tipo === 'admin' ? 'admin' : 'aluno'} size="sm">
          {row.tipo}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-brand-navy" /> Gestão de Usuários
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre, edite e controle o tipo de permissão dos usuários da plataforma.
          </p>
        </div>
        <Button
          variant="accent"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Novo Usuário
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar usuários por Nome ou RA..."
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredUsuarios}
        keyExtractor={(row) => row.id_usuario}
        isLoading={isLoading}
        emptyMessage={search ? "Nenhum usuário encontrado para esta pesquisa." : "Nenhum usuário cadastrado."}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeletingUser(row)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        description="Preencha os dados do usuário acadêmico"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Registro Acadêmico (RA)"
            placeholder="Digite o RA do usuário"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required
          />

          <Input
            label="Nome Completo"
            placeholder="Ex: Maria Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Deixe em branco para manter 123"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Select
            label="Tipo de Acesso (Perfil)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as UserRole)}
            options={[
              { value: 'aluno', label: 'Aluno' },
              { value: 'admin', label: 'Administrador' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent" isLoading={isSaving}>
              {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Excluir Usuário?"
        description={`Tem certeza que deseja excluir o usuário "${deletingUser?.nome}" (RA: ${deletingUser?.ra})? Esta ação não poderá ser desfeita.`}
      />
    </div>
  );
};
