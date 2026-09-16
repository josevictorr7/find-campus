import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Search, KeyRound } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [ra, setRa] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ra.trim() || !senha.trim()) {
      showToast('error', 'Campos obrigatórios', 'Por favor, informe seu RA e senha.');
      return;
    }

    setIsLoading(true);
    try {
      await login(ra, senha);
      showToast('success', 'Bem-vindo ao sistema!', 'Login realizado com sucesso.');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('error', 'Falha na autenticação', err.message || 'RA ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        {/* Left Hero Section (Blue Brand Gradient) */}
        <div className="bg-gradient-to-br from-brand-dark via-brand-navy to-brand-blue p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />

          <div>
            <div className="w-14 h-14 bg-brand-yellow text-brand-navy rounded-2xl flex items-center justify-center font-bold shadow-lg mb-6">
              <Search className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">UNIP Achados e Perdidos</h1>
            <p className="text-sm text-slate-200 leading-relaxed font-light">
              Plataforma oficial da UNIP para gerenciamento, localização e devolução de pertences perdidos no campus.
            </p>
          </div>

          <p className="text-[11px] text-slate-300 mt-8">
            © 2026 Faculdade — Sistema Integrado de Gestão Acadêmica.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Acessar a Conta</h2>
            <p className="text-xs text-slate-500 mt-1">Informe seu Registro Acadêmico (RA) e senha para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Registro Acadêmico (RA)"
              placeholder="Digite seu RA"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              autoFocus
              required
            />

            <Input
              label="Senha de Acesso"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              icon={<KeyRound className="w-4 h-4 text-slate-400" />}
              required
            />

            <Button type="submit" variant="accent" size="lg" className="w-full mt-2 font-bold shadow-md" isLoading={isLoading}>
              Entrar no Sistema
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-semibold text-brand-navy hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

