import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum resultado encontrado',
  description = 'Não existem dados cadastrados ou nenhum item atende aos filtros selecionados.',
  actionLabel,
  onAction,
  icon = <PackageOpen className="w-12 h-12 text-slate-300 stroke-[1.5]" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-slate-100/80 rounded-full flex items-center justify-center mb-4 border border-slate-200/60">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="accent" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
