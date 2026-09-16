import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { objectService } from '../services/objectService';
import { userService } from '../services/userService';
import { returnService } from '../services/returnService';
import { Objeto } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ObjectCard } from '../components/objects/ObjectCard';
import { ObjectDetails } from '../components/objects/ObjectDetails';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import {
  PackageSearch,
  PackageCheck,
  RotateCcw,
  Users,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { onOpenRegisterModal } = useOutletContext<{ onOpenRegisterModal: () => void }>();

  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDevolucoes, setTotalDevolucoes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedObjeto, setSelectedObjeto] = useState<Objeto | null>(null);

  const isStudent = user?.tipo === 'aluno';

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [objsList, usersList, devList] = await Promise.all([
        objectService.getAll(),
        userService.getAll(),
        returnService.getAll(),
      ]);
      setObjetos(objsList);
      setTotalUsers(usersList.length);
      setTotalDevolucoes(devList.length);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handleRefresh = () => loadDashboardData();
    window.addEventListener('refresh-objects', handleRefresh);
    return () => window.removeEventListener('refresh-objects', handleRefresh);
  }, []);

  const totalPerdidos = objetos.filter((o) => o.status === 'Perdido').length;
  const totalEncontrados = objetos.filter((o) => o.status === 'Encontrado').length;
  const totalDevolvidos = objetos.filter((o) => o.status === 'Devolvido').length;

  const recentObjetos = objetos.slice(0, 4);

  if (isLoading) {
    return <Loading message="Carregando estatísticas do painel..." />;
  }

  return (
    <div className="space-y-8">
      {/* Banner / Welcome Hero */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-navy to-brand-blue rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="z-10 space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40">
            Olá, {user?.nome}!
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isStudent ? 'Precisa encontrar algo no campus?' : 'Painel de Gestão e Monitoramento'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            {isStudent
              ? 'Consulte itens perdidos e achados na biblioteca, laboratórios e blocos, ou registre um novo objeto.'
              : 'Acompanhe métricas em tempo real de objetos cadastrados, devoluções efetuadas e usuários registrados.'}
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="accent"
            size="lg"
            className="shadow-lg"
            icon={<PlusCircle className="w-5 h-5" />}
            onClick={onOpenRegisterModal}
          >
            Registrar Objeto
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isStudent ? (
          <>
            <Card className="p-6 flex items-center gap-4 hover:border-amber-300 transition-colors">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center shrink-0">
                <PackageSearch className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perdidos</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalPerdidos}</p>
                <span className="text-[10px] text-slate-400">Aguardando localização</span>
              </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 hover:border-blue-300 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center shrink-0">
                <PackageCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encontrados</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalEncontrados}</p>
                <span className="text-[10px] text-slate-400">Disponíveis para retirada</span>
              </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 hover:border-emerald-300 transition-colors">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center shrink-0">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devolvidos</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalDevolvidos}</p>
                <span className="text-[10px] text-slate-400">Entregues aos donos</span>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6 flex items-center gap-4 hover:border-indigo-300 transition-colors">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Usuários</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalUsers}</p>
                <span className="text-[10px] text-slate-400">Alunos e administradores</span>
              </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 hover:border-blue-300 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center shrink-0">
                <PackageSearch className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Objetos</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{objetos.length}</p>
                <span className="text-[10px] text-slate-400">Cadastrados no sistema</span>
              </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 hover:border-emerald-300 transition-colors">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center shrink-0">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devoluções Concluídas</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalDevolucoes}</p>
                <span className="text-[10px] text-slate-400">Registros finalizados</span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Recent Objects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Objetos Recentes</h3>
            <p className="text-xs text-slate-500">Últimos itens cadastrados na comunidade acadêmica</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/objetos')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Ver todos
          </Button>
        </div>

        {recentObjetos.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            Nenhum objeto recente cadastrado.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentObjetos.map((obj) => (
              <ObjectCard
                key={obj.id_objeto}
                objeto={obj}
                onViewDetails={(o) => setSelectedObjeto(o)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedObjeto}
        onClose={() => setSelectedObjeto(null)}
        title="Detalhes do Objeto"
      >
        {selectedObjeto && (
          <ObjectDetails objeto={selectedObjeto} onClose={() => setSelectedObjeto(null)} />
        )}
      </Modal>
    </div>
  );
};
