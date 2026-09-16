import React, { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';
import { Local } from '../types';
import { useToast } from '../contexts/ToastContext';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { MapPin, PlusCircle, Edit2, Trash2 } from 'lucide-react';

export const Locations: React.FC = () => {
  const { showToast } = useToast();
  const [locais, setLocais] = useState<Local[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Local | null>(null);
  const [nome, setNome] = useState('');
  const [bloco, setBloco] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deletingLocal, setDeletingLocal] = useState<Local | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const list = await locationService.getAll();
      setLocais(list);
    } catch (err) {
      console.error('Error loading locations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleOpenCreate = () => {
    setEditingLocal(null);
    setNome('');
    setBloco('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (local: Local) => {
    setEditingLocal(local);
    setNome(local.nome);
    setBloco(local.bloco || '');
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      showToast('error', 'Campo obrigatório', 'Informe o nome do local.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingLocal) {
        await locationService.update(editingLocal.id, nome.trim(), bloco.trim());
        showToast('success', 'Local atualizado', 'Informações salvas com sucesso.');
      } else {
        await locationService.create(nome.trim(), bloco.trim());
        showToast('success', 'Local cadastrado', 'Novo local adicionado ao campus.');
      }
      setIsFormOpen(false);
      loadLocations();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao salvar local.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLocal) return;
    setIsDeleting(true);
    try {
      await locationService.delete(deletingLocal.id);
      showToast('success', 'Local excluído', 'O local foi removido.');
      setDeletingLocal(null);
      loadLocations();
    } catch (err: any) {
      showToast('error', 'Erro ao excluir', err.message || 'Não foi possível excluir o local.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Local>[] = [
    {
      header: 'ID',
      accessor: (row) => <span className="font-mono text-xs text-slate-400">#{row.id}</span>,
      className: 'w-20',
    },
    {
      header: 'Nome do Local / Ponto de Referência',
      accessor: (row) => <span className="font-bold text-slate-800">{row.nome}</span>,
    },
    {
      header: 'Bloco / Setor',
      accessor: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {row.bloco || 'Geral'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" /> Locais do Campus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de salas, blocos, laboratórios e praças de convivência da instituição.
          </p>
        </div>
        <Button
          variant="accent"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Novo Local
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={locais}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhum local cadastrado."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeletingLocal(row)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
        title={editingLocal ? 'Editar Local' : 'Novo Local'}
        description="Digite o nome do local e o bloco correspondente"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nome do Local"
            placeholder="Ex: Laboratório de Informática 3, Biblioteca..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Bloco / Prédio / Setor"
            placeholder="Ex: Bloco A, Convivência, Administrativo..."
            value={bloco}
            onChange={(e) => setBloco(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent" isLoading={isSaving}>
              {editingLocal ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingLocal}
        onClose={() => setDeletingLocal(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Excluir Local?"
        description={`Tem certeza que deseja excluir o local "${deletingLocal?.nome}"?`}
      />
    </div>
  );
};
