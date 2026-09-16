import React, { useState } from 'react';
import { Objeto, ObjetoStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { objectService } from '../../services/objectService';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export interface ObjectFormProps {
  initialData?: Objeto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ObjectForm: React.FC<ObjectFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isEdit = !!initialData;

  const [intent, setIntent] = useState<'perdi' | 'encontrei'>(
    initialData?.status === 'Perdido' ? 'perdi' : 'encontrei'
  );
  const [nome, setNome] = useState(initialData?.nome || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [cor, setCor] = useState(initialData?.cor || '');
  const [marca, setMarca] = useState(initialData?.marca || '');
  const [local, setLocal] = useState(initialData?.local || (initialData as any)?.localNome || '');
  const [contato, setContato] = useState(initialData?.contato || '');
  const [status, setStatus] = useState<ObjetoStatus>(initialData?.status || 'Perdido');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = 'Nome é obrigatório.';
    if (!local.trim()) errs.local = 'Informe o local onde foi visto ou achado.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) return;

    setIsLoading(true);
    try {
      const derivedStatus: ObjetoStatus = isEdit
        ? status
        : intent === 'perdi'
        ? 'Perdido'
        : 'Encontrado';

      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        cor: cor.trim() || 'Não informada',
        marca: marca.trim() || 'Não informada',
        status: derivedStatus,
        local: local.trim(),
        contato: contato.trim(),
        usuario: initialData ? initialData.usuario : user.id_usuario,
      };

      if (isEdit && initialData) {
        await objectService.update(initialData.id_objeto, payload);
        showToast('success', 'Objeto atualizado', 'As alterações foram salvas com sucesso.');
      } else {
        await objectService.create(payload);
        showToast('success', 'Objeto registrado', 'Seu objeto foi cadastrado no sistema.');
      }

      onSuccess();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Ocorreu um erro ao salvar o objeto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isEdit && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            O que aconteceu?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIntent('perdi')}
              className={`p-3 rounded-xl border font-semibold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                intent === 'perdi'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Perdi este objeto</span>
              <span className="text-[10px] font-normal text-amber-700">Será marcado como Perdido</span>
            </button>

            <button
              type="button"
              onClick={() => setIntent('encontrei')}
              className={`p-3 rounded-xl border font-semibold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                intent === 'encontrei'
                  ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Encontrei este objeto</span>
              <span className="text-[10px] font-normal text-blue-700">Será marcado como Encontrado</span>
            </button>
          </div>
        </div>
      )}

      {isEdit && (
        <Select
          label="Status do Objeto"
          value={status}
          onChange={(e) => setStatus(e.target.value as ObjetoStatus)}
          options={[
            { value: 'Perdido', label: 'Perdido' },
            { value: 'Encontrado', label: 'Encontrado' },
            { value: 'Devolvido', label: 'Devolvido' },
          ]}
        />
      )}

      <Input
        label="Nome do Objeto"
        placeholder="Ex: Caderno Universitário, Chaves, iPhone..."
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        error={errors.nome}
        required
      />

      <Input
        label="Local onde foi visto / encontrado"
        placeholder="Ex: Bloco A - Sala 302, Biblioteca 2º andar, Cantina principal..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        error={errors.local}
        required
      />

      <Input
        label="Contato para Resgate / Devolução"
        placeholder="Ex: (11) 99999-9999, @seu_instagram, email@unip.br..."
        value={contato}
        onChange={(e) => setContato(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cor Predominante"
          placeholder="Ex: Azul, Preto, Prata..."
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />
        <Input
          label="Marca / Fabricante"
          placeholder="Ex: Apple, Samsung, Tilibra..."
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
      </div>

      <Textarea
        label="Descrição detalhada"
        placeholder="Descreva detalhes marcantes, capas, adesivos, estado do objeto..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        rows={3}
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent" isLoading={isLoading}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar Objeto'}
        </Button>
      </div>
    </form>
  );
};
