import React from 'react';
import { Objeto } from '../../types';
import { Badge } from '../ui/Badge';
import { getStatusBadgeVariant } from '../../lib/utils';
import { MapPin, Tag, Eye, Edit2, Trash2, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ObjectCardProps {
  objeto: Objeto;
  onViewDetails: (objeto: Objeto) => void;
  onEdit?: (objeto: Objeto) => void;
  onDelete?: (objeto: Objeto) => void;
  showActions?: boolean;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({
  objeto,
  onViewDetails,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant={getStatusBadgeVariant(objeto.status)} size="sm">
            {objeto.status}
          </Badge>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(objeto)}
          className="text-base font-bold text-slate-800 hover:text-brand-navy cursor-pointer transition-colors line-clamp-1 mb-2"
        >
          {objeto.nome}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {objeto.descricao || 'Sem descrição detalhada.'}
        </p>

        {/* Info Pills */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{objeto.local || objeto.localNome || 'Local não especificado'}</span>
          </div>
          {objeto.contato && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium truncate">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Contato: {objeto.contato}</span>
            </div>
          )}
          {objeto.cor && (
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
              <span>Cor: {objeto.cor}</span>
              {objeto.marca && <span className="text-slate-300">•</span>}
              {objeto.marca && <span>Marca: {objeto.marca}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          icon={<Eye className="w-3.5 h-3.5 text-brand-navy" />}
          onClick={() => onViewDetails(objeto)}
        >
          Detalhes
        </Button>

        {showActions && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(objeto)}
                className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(objeto)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
