import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userService } from '../services/userService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { User, LogOut, ShieldCheck, GraduationCap, Hash, BookOpen, KeyRound, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [nome, setNome] = useState(user?.nome || '');
  const [ra, setRa] = useState(user?.ra || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setRa(user.ra);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanNome = nome.trim();
    const cleanRa = ra.trim();

    if (!cleanNome || !cleanRa) {
      showToast('error', 'Campos obrigatórios', 'Por favor, informe seu nome e RA.');
      return;
    }

    setIsSaving(true);
    try {
      const finalSenha = novaSenha.trim() || user.senha || '123';
      const ok = await userService.update(user.id_usuario, {
        ra: cleanRa,
        nome: cleanNome,
        senha: finalSenha,
        tipo: user.tipo, // Mantém o tipo inalterado
      });

      if (ok) {
        const updatedUser = {
          ...user,
          ra: cleanRa,
          nome: cleanNome,
          senha: finalSenha,
        };
        updateUser(updatedUser);
        setNovaSenha('');
        showToast('success', 'Perfil atualizado', 'Seus dados foram atualizados com sucesso.');
      } else {
        showToast('error', 'Erro ao atualizar', 'Não foi possível salvar as alterações no servidor.');
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const isStudent = user?.tipo === 'aluno';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <Card variant="gradient" className="p-8 text-white relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center font-black text-3xl shadow-xl shrink-0 border-4 border-white/20">
            {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{user?.nome}</h2>
              <Badge variant={isStudent ? 'aluno' : 'admin'} size="md">
                {user?.tipo}
              </Badge>
            </div>
            <p className="text-xs text-slate-200 font-mono flex items-center justify-center sm:justify-start gap-1.5 opacity-90">
              <Hash className="w-3.5 h-3.5 text-brand-yellow" /> Registro Acadêmico (RA): {user?.ra}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Edit Form */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Editar Meu Perfil
          </h3>
          <span className="text-xs text-slate-400">ID #{user?.id_usuario}</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              icon={<User className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Registro Acadêmico (RA)"
              placeholder="Digite seu RA"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              icon={<BookOpen className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>

          <Input
            label="Nova Senha (opcional)"
            type="password"
            placeholder="Deixe em branco para manter a senha atual"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            icon={<KeyRound className="w-4 h-4 text-slate-400" />}
          />

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
              {isStudent ? (
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
              Nível de Acesso (Tipo de Usuário)
            </span>
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-700 text-xs">
                {isStudent
                  ? 'Perfil de Aluno: Permite visualizar objetos e gerenciar seus próprios registros.'
                  : 'Perfil de Administrador: Acesso completo para gerenciar usuários, categorias, locais e devoluções.'}
              </p>
              <Badge variant={isStudent ? 'aluno' : 'admin'} size="sm">
                {user?.tipo} (Fixo)
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="danger"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Sair da Conta
            </Button>

            <Button
              type="submit"
              variant="accent"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
