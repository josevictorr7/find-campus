import React, { useState, useEffect } from 'react';
import { returnService } from '../services/returnService';
import { objectService } from '../services/objectService';
import { userService } from '../services/userService';
import { Devolucao, Objeto, Usuario } from '../types';
import { useToast } from '../contexts/ToastContext';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDate } from '../lib/utils';
import { PlusCircle, RotateCcw, Trash2, Edit2 } from 'lucide-react';

export const Returns: React.FC = () => {
  const { showToast } = useToast();
  const [devolucoes, setDevolucoes] = useState<Devolucao[]>([]);
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<Devolucao | null>(null);
  const [selectedObjetoId, setSelectedObjetoId] = useState<number | ''>('');
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | ''>('');
  const [observacao, setObservacao] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deletingDev, setDeletingDev] = useState<Devolucao | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [devs, objs, usrs] = await Promise.all([
        returnService.getAll(),
        objectService.getAll(),
        userService.getAll(),
      ]);
      setDevolucoes(devs);
      setObjetos(objs);
      setUsuarios(usrs);
    } catch (err) {
      console.error('Error loading returns data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingDev(null);
    setSelectedObjetoId('');
    setSelectedUsuarioId('');
    setObservacao('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dev: Devolucao) => {
    setEditingDev(dev);
    setSelectedObjetoId(dev.objeto);
    setSelectedUsuarioId(dev.usuario);
    setObservacao(dev.observacao);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObjetoId || !selectedUsuarioId) {
      showToast('error', 'Campos obrigatórios', 'Selecione o objeto e o usuário recebedor.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingDev) {
        await returnService.update(
          editingDev.id,
          Number(selectedObjetoId),
          Number(selectedUsuarioId),
          observacao
        );
        showToast('success', 'Devolução atualizada', 'Os dados da devolução foram atualizados.');
      } else {
        await returnService.create(
          Number(selectedObjetoId),
          Number(selectedUsuarioId),
          observacao
        );
        showToast('success', 'Devolução registrada', 'O objeto foi marcado como devolvido.');
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Não foi possível salvar a devolução.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDev) return;
    setIsDeleting(true);
    try {
      await returnService.delete(deletingDev.id);
      showToast('success', 'Registro excluído', 'O registro de devolução foi removido.');
      setDeletingDev(null);
      loadData();
    } catch (err: any) {
      showToast('error', 'Erro ao excluir', err.message || 'Não foi possível excluir o registro.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Devolucao>[] = [
    {
      header: 'Objeto Devolvido',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-800">{row.objetoNome}</p>
          <p className="text-[10px] text-slate-400 font-mono">ID Objeto: #{row.objeto}</p>
        </div>
      ),
    },
    {
      header: 'Recebido por (Usuário)',
      accessor: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.usuarioNome}</p>
          <p className="text-[10px] text-slate-400 font-mono">ID Usuário: #{row.usuario}</p>
        </div>
      ),
    },
    {
      header: 'Data da Devolução',
      accessor: (row) => <span className="text-xs text-slate-600">{formatDate(row.data)}</span>,
    },
    {
      header: 'Observação',
      accessor: (row) => (
        <p className="text-xs text-slate-600 max-w-xs truncate">{row.observacao || 'Sem observações.'}</p>
      ),
    },
  ];

  // Available objects for new returns (filter non-returned or current editing)
  const availableObjetos = objetos.filter(
    (o) => o.status !== 'Devolvido' || (editingDev && o.id_objeto === editingDev.objeto)
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-600" /> Registro de Devoluções
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historico oficial de devoluções de pertences aos proprietários legítimos.
          </p>
        </div>
        <Button
          variant="accent"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Registrar Devolução
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={devolucoes}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhuma devolução registrada até o momento."
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
              onClick={() => setDeletingDev(row)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingDev ? 'Editar Devolução' : 'Registrar Nova Devolução'}
        description="Selecione o objeto e o usuário recebedor"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Objeto a ser devolvido"
            value={selectedObjetoId}
            onChange={(e) => setSelectedObjetoId(Number(e.target.value))}
            options={availableObjetos.map((o) => ({
              value: o.id_objeto,
              label: `${o.nome} [${o.status}] — Local: ${o.localNome || o.local_id}`,
            }))}
            placeholder="Selecione o objeto..."
            required
          />

          <Select
            label="Usuário Recebedor (Quem retirou)"
            value={selectedUsuarioId}
            onChange={(e) => setSelectedUsuarioId(Number(e.target.value))}
            options={usuarios.map((u) => ({
              value: u.id_usuario,
              label: `${u.nome} (RA: ${u.ra})`,
            }))}
            placeholder="Selecione o usuário..."
            required
          />

          <Textarea
            label="Observação da Devolução"
            placeholder="Ex: Documento apresentado, entregue ao próprio aluno em mãos..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent" isLoading={isSaving}>
              {editingDev ? 'Salvar Alterações' : 'Concluir Devolução'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingDev}
        onClose={() => setDeletingDev(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Excluir Registro de Devolução?"
        description="Tem certeza que deseja remover este histórico de devolução?"
      />
    </div>
  );
};
