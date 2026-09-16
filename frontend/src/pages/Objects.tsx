import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { objectService } from '../services/objectService';
import { Objeto } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { ObjectCard } from '../components/objects/ObjectCard';
import { ObjectDetails } from '../components/objects/ObjectDetails';
import { ObjectForm } from '../components/objects/ObjectForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { PlusCircle, FilterX } from 'lucide-react';

export const Objects: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { onOpenRegisterModal } = useOutletContext<{ onOpenRegisterModal: () => void }>();

  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedLocal, setSelectedLocal] = useState<string>('');

  // Modals state
  const [detailsObjeto, setDetailsObjeto] = useState<Objeto | null>(null);
  const [editingObjeto, setEditingObjeto] = useState<Objeto | null>(null);
  const [deletingObjeto, setDeletingObjeto] = useState<Objeto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const objs = await objectService.getAll();
      setObjetos(objs);
    } catch (err) {
      console.error('Error loading objects', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-objects', handleRefresh);
    return () => window.removeEventListener('refresh-objects', handleRefresh);
  }, []);

  const filteredObjetos = useMemo(() => {
    return objetos.filter((obj) => {
      const matchSearch =
        !search.trim() ||
        obj.nome.toLowerCase().includes(search.toLowerCase()) ||
        obj.descricao.toLowerCase().includes(search.toLowerCase()) ||
        (obj.cor && obj.cor.toLowerCase().includes(search.toLowerCase())) ||
        (obj.marca && obj.marca.toLowerCase().includes(search.toLowerCase())) ||
        (obj.local && obj.local.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = !selectedStatus || obj.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [objetos, search, selectedStatus]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedStatus('');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingObjeto) return;
    setIsDeleting(true);
    try {
      await objectService.delete(deletingObjeto.id_objeto);
      showToast('success', 'Objeto excluído', 'O registro foi removido com sucesso.');
      setDeletingObjeto(null);
      loadData();
    } catch (err: any) {
      showToast('error', 'Erro ao excluir', err.message || 'Não foi possível excluir o objeto.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAdmin = user?.tipo === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Header & Search bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Pesquisar por nome, marca, cor ou descrição..."
            />
          </div>
          <Button
            variant="accent"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={onOpenRegisterModal}
          >
            Registrar Objeto
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <div className="w-48">
            <Select
              label="Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'Perdido', label: 'Perdido' },
                { value: 'Encontrado', label: 'Encontrado' },
                { value: 'Devolvido', label: 'Devolvido' },
              ]}
              placeholder="Todos os Status"
            />
          </div>

          {(selectedStatus || search) && (
            <Button
              variant="ghost"
              size="md"
              className="text-slate-500 hover:text-slate-800 self-end mb-0.5"
              icon={<FilterX className="w-4 h-4" />}
              onClick={handleClearFilters}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <Loading message="Buscando objetos cadastrados..." />
      ) : filteredObjetos.length === 0 ? (
        <EmptyState
          title="Nenhum objeto encontrado"
          description="Tente ajustar os termos de pesquisa ou remover os filtros aplicados."
          actionLabel="Registrar Novo Objeto"
          onAction={onOpenRegisterModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredObjetos.map((obj) => (
            <ObjectCard
              key={obj.id_objeto}
              objeto={obj}
              onViewDetails={(o) => setDetailsObjeto(o)}
              onEdit={isAdmin || obj.usuario === user?.id_usuario ? (o) => setEditingObjeto(o) : undefined}
              onDelete={isAdmin || obj.usuario === user?.id_usuario ? (o) => setDeletingObjeto(o) : undefined}
              showActions={isAdmin || obj.usuario === user?.id_usuario}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!detailsObjeto}
        onClose={() => setDetailsObjeto(null)}
        title="Detalhes do Objeto"
      >
        {detailsObjeto && (
          <ObjectDetails
            objeto={detailsObjeto}
            onClose={() => setDetailsObjeto(null)}
            onEdit={(o) => {
              setDetailsObjeto(null);
              setEditingObjeto(o);
            }}
            canEdit={isAdmin || detailsObjeto.usuario === user?.id_usuario}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingObjeto}
        onClose={() => setEditingObjeto(null)}
        title="Editar Objeto"
      >
        {editingObjeto && (
          <ObjectForm
            initialData={editingObjeto}
            onSuccess={() => {
              setEditingObjeto(null);
              loadData();
            }}
            onCancel={() => setEditingObjeto(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingObjeto}
        onClose={() => setDeletingObjeto(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Excluir Objeto?"
        description={`Tem certeza que deseja excluir o objeto "${deletingObjeto?.nome}"? Essa ação não pode ser desfeita.`}
      />
    </div>
  );
};
