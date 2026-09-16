import React from 'react';
import { Objeto } from '../../types';
import { Badge } from '../ui/Badge';
import { getStatusBadgeVariant, formatDate } from '../../lib/utils';
import { Tag, MapPin, User, Calendar, Palette, Award, FileText, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ObjectDetailsProps {
  objeto: Objeto;
  onClose: () => void;
  onEdit?: (objeto: Objeto) => void;
  canEdit?: boolean;
}

export const ObjectDetails: React.FC<ObjectDetailsProps> = ({
  objeto,
  onClose,
  onEdit,
  canEdit = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{objeto.nome}</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Cadastrado em {formatDate(objeto.dataCriacao)}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(objeto.status)} size="md">
          {objeto.status}
        </Badge>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 sm:col-span-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" /> Local Visto / Encontrado
          </span>
          <p className="font-semibold text-slate-800">{objeto.local || objeto.localNome || 'Não especificado'}</p>
        </div>

        {objeto.contato && (
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/80 sm:col-span-3">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" /> Contato para Devolução / Resgate
            </span>
            <p className="font-bold text-emerald-900">{objeto.contato}</p>
          </div>
        )}

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Palette className="w-3 h-3 text-indigo-500" /> Cor
          </span>
          <p className="font-semibold text-slate-800">{objeto.cor || 'Não informada'}</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-500" /> Marca
          </span>
          <p className="font-semibold text-slate-800">{objeto.marca || 'Não informada'}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-brand-navy" /> Descrição Completa
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {objeto.descricao || 'Sem descrição cadastrada.'}
        </p>
      </div>

      {/* Registered By User */}
      <div className="flex items-center gap-3 p-3 bg-brand-navy/5 rounded-xl border border-brand-navy/10">
        <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cadastrado por</p>
          <p className="text-sm font-bold text-slate-800">{objeto.usuarioNome || `Usuário #${objeto.usuario}`}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        {canEdit && onEdit && (
          <Button variant="accent" onClick={() => onEdit(objeto)}>
            Editar Objeto
          </Button>
        )}
      </div>
    </div>
  );
};
