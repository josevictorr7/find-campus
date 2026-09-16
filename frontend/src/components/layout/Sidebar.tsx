import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PackageCheck,
  RotateCcw,
  Users,
  Tags,
  MapPin,
  User,
  LogOut,
  Search,
  X,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenRegisterModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStudent = user?.tipo === 'aluno';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-brand-yellow text-brand-navy font-semibold shadow-xs'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-brand-dark via-brand-navy to-[#020542] text-white z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-bold text-xl shadow-md">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-wide text-white">UNIP Achados & Perdidos</h1>
              <p className="text-[10px] text-brand-yellow uppercase tracking-wider font-semibold">
                {isStudent ? 'Portal do Aluno' : 'Painel de Gestão'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call to Action Button */}
        <div className="p-4">
          <Button
            variant="accent"
            size="md"
            className="w-full shadow-md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              if (onOpenRegisterModal) onOpenRegisterModal();
              onClose();
            }}
          >
            Registrar Objeto
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {/* Main Group */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Navegação</p>
            <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/objetos" className={navLinkClass} onClick={onClose}>
              <Package className="w-4 h-4" />
              <span>Objetos</span>
            </NavLink>

            {isStudent && (
              <NavLink to="/meus-objetos" className={navLinkClass} onClick={onClose}>
                <PackageCheck className="w-4 h-4" />
                <span>Meus Objetos</span>
              </NavLink>
            )}

            {!isStudent && (
              <NavLink to="/devolucoes" className={navLinkClass} onClick={onClose}>
                <RotateCcw className="w-4 h-4" />
                <span>Devoluções</span>
              </NavLink>
            )}
          </div>

          {/* Admin Group */}
          {!isStudent && (
            <div className="space-y-1 pt-2 border-t border-white/10">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-brand-yellow/80 mb-2">
                Administração
              </p>
              <NavLink to="/usuarios" className={navLinkClass} onClick={onClose}>
                <Users className="w-4 h-4" />
                <span>Usuários</span>
              </NavLink>
              <NavLink to="/locais" className={navLinkClass} onClick={onClose}>
                <MapPin className="w-4 h-4" />
                <span>Locais</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isActive ? 'bg-white/15 text-white' : 'hover:bg-white/10 text-slate-300'
              }`
            }
            onClick={onClose}
          >
            <div className="w-9 h-9 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow font-bold text-sm">
              {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.nome}</p>
              <p className="text-[10px] text-slate-400 truncate">RA: {user?.ra}</p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
};
