import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { objectService } from '../services/objectService';
import { Objeto } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { ObjectCard } from '../components/objects/ObjectCard';
import { ObjectDetails } from '../components/objects/ObjectDetails';
import { ObjectForm } from '../components/objects/ObjectForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { PlusCircle } from 'lucide-react';

export const MyObjects: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { onOpenRegisterModal } = useOutletContext<{ onOpenRegisterModal: () => void }>();

  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [detailsObjeto, setDetailsObjeto] = useState<Objeto | null>(null);
  const [editingObjeto, setEditingObjeto] = useState<Objeto | null>(null);
  const [deletingObjeto, setDeletingObjeto] = useState<Objeto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMyObjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const allObjs = await objectService.getAll();
      const myObjs = allObjs.filter((o) => o.usuario === user.id_usuario);
      setObjetos(myObjs);
    } catch (err) {
      console.error('Error loading my objects', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyObjects();
    const handleRefresh = () => loadMyObjects();
    window.addEventListener('refresh-objects', handleRefresh);
    return () => window.removeEventListener('refresh-objects', handleRefresh);
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!deletingObjeto) return;
    setIsDeleting(true);
    try {
      await objectService.delete(deletingObjeto.id_objeto);
      showToast('success', 'Objeto excluído', 'O seu objeto foi removido do sistema.');
      setDeletingObjeto(null);
      loadMyObjects();
    } catch (err: any) {
      showToast('error', 'Erro ao excluir', err.message || 'Não foi possível excluir o objeto.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Meus Objetos Cadastrados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie e acompanhe o status dos itens que você registrou no sistema.
          </p>
        </div>
        <Button
          variant="accent"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenRegisterModal}
        >
          Registrar Novo Objeto
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <Loading message="Carregando seus objetos..." />
      ) : objetos.length === 0 ? (
        <EmptyState
          title="Você ainda não registrou nenhum objeto"
          description="Encontrou ou perdeu algo no campus? Registre o item para ajudar a comunidade."
          actionLabel="Registrar Objeto"
          onAction={onOpenRegisterModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {objetos.map((obj) => (
            <ObjectCard
              key={obj.id_objeto}
              objeto={obj}
              onViewDetails={(o) => setDetailsObjeto(o)}
              onEdit={(o) => setEditingObjeto(o)}
              onDelete={(o) => setDeletingObjeto(o)}
              showActions
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
            canEdit
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingObjeto}
        onClose={() => setEditingObjeto(null)}
        title="Editar Meu Objeto"
      >
        {editingObjeto && (
          <ObjectForm
            initialData={editingObjeto}
            onSuccess={() => {
              setEditingObjeto(null);
              loadMyObjects();
            }}
            onCancel={() => setEditingObjeto(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingObjeto}
        onClose={() => setDeletingObjeto(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Excluir este objeto?"
        description={`Tem certeza que deseja remover o objeto "${deletingObjeto?.nome}"?`}
      />
    </div>
  );
};
