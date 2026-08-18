import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  UserPlus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Phone,
  User,
  Car,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { getStoredUsers, DEMO_USERS } from '../../lib/supabase';
import { InfractionData, VehicleData, CaseAnalysis } from '../../types';

interface AccountVerificationGateProps {
  leadName?: string;
  leadPhone?: string;
  infractionData: InfractionData;
  vehicleData: VehicleData;
  analysis: CaseAnalysis;
  onSuccess: (authenticatedUser: any) => void;
  onCancel: () => void;
}

export const AccountVerificationGate: React.FC<AccountVerificationGateProps> = ({
  leadName = '',
  leadPhone = '',
  infractionData,
  vehicleData,
  analysis,
  onSuccess,
  onCancel,
}) => {
  const { login, signUp, user, isAuthenticated } = useAuth();

  // Mode: 'check' | 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>(leadName || 'Carlos Eduardo Silveira');
  const [phone, setPhone] = useState<string>(leadPhone || '(11) 98765-4321');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkedAccountStatus, setCheckedAccountStatus] = useState<{
    tested: boolean;
    exists: boolean;
  }>({ tested: false, exists: false });

  // Pre-fill name and phone when props change
  useEffect(() => {
    if (leadName && !name) setName(leadName);
    if (leadPhone && !phone) setPhone(leadPhone);
  }, [leadName, leadPhone]);

  // If already authenticated, trigger success immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      onSuccess(user);
    }
  }, [isAuthenticated, user, onSuccess]);

  // Auto-detect if user already has an account when email or phone changes
  useEffect(() => {
    if (email.includes('@') && email.length > 5) {
      const allUsers = getStoredUsers();
      const clean = email.trim().toLowerCase();
      const found = allUsers[clean] || DEMO_USERS[clean];
      if (found) {
        setCheckedAccountStatus({ tested: true, exists: true });
        setMode('login');
      } else {
        setCheckedAccountStatus({ tested: true, exists: false });
      }
    }
  }, [email]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Fetch current user from storage/context
        const storedUsers = getStoredUsers();
        const loggedUser = storedUsers[email.trim().toLowerCase()]?.user || DEMO_USERS[email.trim().toLowerCase()]?.user;
        onSuccess(loggedUser || { name, email, phone });
      } else {
        setErrorMessage(result.error || 'Credenciais inválidas. Verifique os dados ou crie uma conta.');
      }
    } catch (err: any) {
      setErrorMessage('Erro de autenticação: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(name, email, password);
      if (result.success) {
        const storedUsers = getStoredUsers();
        const newUser = storedUsers[email.trim().toLowerCase()]?.user || {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name,
          email,
          phone,
          role: 'citizen',
        };
        onSuccess(newUser);
      } else {
        setErrorMessage(result.error || 'Não foi possível criar a conta. Tente novamente.');
      }
    } catch (err: any) {
      setErrorMessage('Erro ao criar conta: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('motorista@defesai.com.br');
    setPassword('123456');
    setIsLoading(true);
    const res = await login('motorista@defesai.com.br', '123456');
    setIsLoading(false);
    if (res.success) {
      onSuccess(DEMO_USERS['motorista@defesai.com.br'].user);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Header with Case Preservation Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% dos Dados Coletados Preservados
            </span>

            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              Voltar ao Diagnóstico
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Acesso à Sua Defesa Jurídica
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verificamos seu cadastro para vincular o auto nº <strong className="font-mono text-slate-800">{infractionData.aitNumber || '1B892014'}</strong> (Placa <strong className="font-mono text-slate-800">{vehicleData.plate || 'BRA2E19'}</strong>) com segurança.
            </p>
          </div>
        </div>

        {/* Preserved Data Summary Chip */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#155BCB]" />
              Diagnóstico Preliminar Concluído ({analysis.overallSuccessRate || 94}% de êxito)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
              3 Teses Mapeadas
            </span>
          </div>
          <p className="text-[11px] text-blue-900">
            Você não precisará preencher os dados do veículo e da autuação novamente.
          </p>
        </div>

        {/* Tab Switcher: Criar Conta (Não) vs Já Tenho Conta (Sim) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#155BCB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Nova Conta (1º Acesso)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#155BCB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Já Tenho Conta (Entrar)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* REGISTER FORM (NÃO -> CRIAÇÃO DE CONTA) */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-input-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                Seu Melhor E-mail *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com.br"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                Defina uma Senha Segura *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-input-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <button
              id="btn-register-and-continue"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#155BCB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Criando Conta e Vinculando Defesa...</span>
              ) : (
                <>
                  <span>Criar Conta & Prosseguir para Geração</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* LOGIN FORM (SIM -> LOGIN / VINCULAÇÃO) */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                E-mail Cadastrado *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="motorista@defesai.com.br"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase font-mono mb-1 block">
                Sua Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#155BCB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[11px] text-[#155BCB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                Usar Conta Demonstração Rápida
              </button>
            </div>

            <button
              id="btn-login-and-claim"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#155BCB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Autenticando e Vinculando Caso...</span>
              ) : (
                <>
                  <span>Entrar & Vincular Defesa à Minha Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security & LGPD Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            Criptografia de Ponta a Ponta
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Conformidade LGPD
          </span>
        </div>
      </div>
    </div>
  );
};
