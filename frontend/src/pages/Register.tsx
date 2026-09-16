import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';
import { Search, KeyRound, UserPlus, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Register: React.FC = () => {
  const [ra, setRa] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanRa = ra.trim();
    const cleanNome = nome.trim();
    const cleanSenha = senha.trim();
    const cleanConfirmar = confirmarSenha.trim();

    if (!cleanRa || !cleanNome || !cleanSenha || !cleanConfirmar) {
      showToast('error', 'Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    if (cleanSenha !== cleanConfirmar) {
      showToast('error', 'Senhas não coincidem', 'A confirmação de senha deve ser idêntica à senha digitada.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await userService.create({
        ra: cleanRa,
        nome: cleanNome,
        senha: cleanSenha,
        tipo: 'aluno', // Todo cadastro público é obrigatoriamente aluno
      });

      if (ok) {
        showToast('success', 'Cadastro realizado!', 'Sua conta foi criada com sucesso. Faça login para acessar.');
        navigate('/login');
      } else {
        showToast('error', 'Falha no cadastro', 'Não foi possível cadastrar a conta. Verifique se o RA já está registrado.');
      }
    } catch (err: any) {
      showToast('error', 'Erro no cadastro', err.message || 'Ocorreu um erro ao comunicar com o servidor.');
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Crie sua Conta</h1>
            <p className="text-sm text-slate-200 leading-relaxed font-light">
              Cadastre seu Registro Acadêmico para ter acesso ao sistema de Achados e Perdidos da UNIP.
            </p>
          </div>

          <p className="text-[11px] text-slate-300 mt-8">
            © 2026 Faculdade — Sistema Integrado de Gestão Acadêmica.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-brand-navy hover:text-brand-dark font-medium mb-3 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Login
            </Link>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Cadastro de Aluno</h2>
            <p className="text-xs text-slate-500 mt-1">Preencha seus dados para criar sua conta no sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registro Acadêmico (RA)"
              placeholder="Digite seu RA"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              autoFocus
              required
            />

            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              icon={<KeyRound className="w-4 h-4 text-slate-400" />}
              required
            />

            <Button type="submit" variant="accent" size="lg" className="w-full mt-2 font-bold shadow-md" isLoading={isLoading} icon={<UserPlus className="w-4 h-4" />}>
              Cadastrar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Já possui uma conta?{' '}
              <Link to="/login" className="font-semibold text-brand-navy hover:underline">
                Faça Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
