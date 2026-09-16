import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Modal } from '../ui/Modal';
import { ObjectForm } from '../objects/ObjectForm';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Painel de Controle';
      case '/objetos':
        return 'Gestão de Objetos';
      case '/meus-objetos':
        return 'Meus Objetos Cadastrados';
      case '/devolucoes':
        return 'Registro de Devoluções';
      case '/usuarios':
        return 'Gestão de Usuários';
      case '/categorias':
        return 'Categorias de Objetos';
      case '/locais':
        return 'Locais Cadastrados';
      case '/perfil':
        return 'Meu Perfil';
      default:
        return 'Sistema Achados e Perdidos';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet context={{ onOpenRegisterModal: () => setIsRegisterModalOpen(true) }} />
        </main>

        <footer className="py-4 px-8 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          <p>© 2026 Achados e Perdidos — Trabalho Acadêmico da Faculdade</p>
        </footer>
      </div>

      {/* Shared Register Object Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registrar Novo Objeto"
        description="Preencha os dados do objeto perdido ou encontrado no campus"
        maxWidth="lg"
      >
        <ObjectForm
          onSuccess={() => {
            setIsRegisterModalOpen(false);
            // Refresh current route page if needed
            window.dispatchEvent(new CustomEvent('refresh-objects'));
          }}
          onCancel={() => setIsRegisterModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
