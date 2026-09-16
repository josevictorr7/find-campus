import React from 'react';
import { Menu, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenRegisterModal?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onOpenRegisterModal, title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {title && <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>}
      </div>

      <div className="flex items-center gap-3">
        

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
          <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.nome}</p>
            <p className="text-[10px] text-slate-500 font-mono">RA: {user?.ra}</p>
          </div>
          <Badge variant={user?.tipo === 'admin' ? 'admin' : 'aluno'} size="sm">
            {user?.tipo}
          </Badge>
        </div>
      </div>
    </header>
  );
};
