import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  FileText,
  KeyRound,
  X,
  Loader2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useRouter } from '../../core/router/RouterContext';
import { useAuth } from '../../core/auth/AuthContext';

interface AuthPageViewProps {
  initialTab?: 'login' | 'register';
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({ initialTab = 'login' }) => {
  const { navigate, queryParams, currentPath } = useRouter();
  const { login, signUp, loginAsDemoUser, loginAsDemoAdmin, resetPassword, isLoading } = useAuth();

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() => {
    if (currentPath === '/cadastro') return 'register';
    return initialTab;
  });

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Feedback States
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Reset Modal States
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });

  const redirectTarget = queryParams.redirect || '/dashboard';

  // Sync tab with path if route changes
  useEffect(() => {
    if (currentPath === '/cadastro') {
      setActiveTab('register');
    } else if (currentPath === '/login') {
      setActiveTab('login');
    }
  }, [currentPath]);

  // Clear messages when changing tabs
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    if (tab === 'register' && currentPath !== '/cadastro') {
      navigate('/cadastro');
    } else if (tab === 'login' && currentPath !== '/login') {
      navigate('/login');
    }
  };

  // Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Por favor, informe seu e-mail e senha de acesso.');
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Credenciais inválidas. Verifique os dados digitados.');
    } else {
      navigate(redirectTarget);
    }
  };

  // Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios marcados com *.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem. Por favor, verifique.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Você deve aceitar os Termos de Uso e a Política de Privacidade (LGPD) para prosseguir.');
      return;
    }

    const res = await signUp(regName, regEmail, regPassword, regPhone);
    if (!res.success) {
      setErrorMessage(res.error || 'Erro ao realizar cadastro.');
    } else {
      setSuccessMessage('Conta criada com sucesso! Redirecionando para o seu painel...');
      setTimeout(() => {
        navigate(redirectTarget);
      }, 600);
    }
  };

  // Demo Login Quick Actions
  const handleDemoUser = async () => {
    setErrorMessage('');
    await loginAsDemoUser();
    navigate(redirectTarget);
  };

  const handleDemoAdmin = async () => {
    setErrorMessage('');
    await loginAsDemoAdmin();
    navigate('/admin');
  };

  // Reset Password Handler
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetStatus({ type: 'error', message: 'Por favor, informe um e-mail válido.' });
      return;
    }

    setResetStatus({ type: 'loading' });
    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetStatus({ type: 'success', message: res.message || 'Link de recuperação enviado com sucesso!' });
    } else {
      setResetStatus({ type: 'error', message: res.message || 'Erro ao solicitar recuperação.' });
    }
  };

  // Password strength calculation helper for registration
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdScore = getPasswordStrength(regPassword);

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6">
      {/* Brand Card Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Branding */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500 text-white shadow-xs shadow-orange-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'login' ? 'Acesse sua Conta' : 'Criar Nova Conta'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1">
              {activeTab === 'login'
                ? 'Entre para acompanhar seus recursos, prazos e laudos periciais.'
                : 'Cadastre-se para gerar defesas técnicas de trânsito em conformidade com o CTB.'}
            </p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="pt-2">
            <div
              id="auth-tabs-navigation"
              role="tablist"
              className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full max-w-xs"
            >
              <button
                type="button"
                role="tab"
                id="tab-login-btn"
                aria-selected={activeTab === 'login'}
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-register-btn"
                aria-selected={activeTab === 'register'}
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Criar Conta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Body Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Global Alert Messages */}
          {errorMessage && (
            <div
              id="auth-error-alert"
              className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              id="auth-success-alert"
              className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs animate-fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: ENTRAR (LOGIN) */}
          {/* ========================================================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="login-email-input" className="block font-semibold text-slate-700 mb-1.5">
                  E-mail do Condutor ou Administrador
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password-input" className="block font-semibold text-slate-700">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    id="btn-forgot-password"
                    onClick={() => {
                      setResetEmail(loginEmail);
                      setResetStatus({ type: 'idle' });
                      setResetModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha cadastrada"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    aria-label={showLoginPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Lembrar meu acesso</span>
                </label>
              </div>

              <button
                type="submit"
                id="login-submit-button"
                disabled={isLoading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no DefesAi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Fast Access Section */}
              <div className="pt-5 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Acesso Rápido de Homologação
                  </span>
                  <span className="text-[10px] text-slate-500">Clique para testar</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="btn-demo-driver-login"
                    onClick={handleDemoUser}
                    disabled={isLoading}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-slate-800 text-[11px] group-hover:text-orange-600 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Condutor Demo</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                      motorista@defesai.com.br
                    </span>
                  </button>

                  <button
                    type="button"
                    id="btn-demo-admin-login"
                    onClick={handleDemoAdmin}
                    disabled={isLoading}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-slate-800 text-[11px] group-hover:text-orange-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                      <span>Gestor / Admin</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                      admin@defesai.com.br
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Switcher */}
              <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-100">
                Ainda não possui uma conta?{' '}
                <button
                  type="button"
                  id="link-switch-to-register"
                  onClick={() => handleTabChange('register')}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Criar conta gratuitamente
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CRIAR CONTA (CADASTRO) */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="register-name-input" className="block font-semibold text-slate-700 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silveira"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="register-email-input" className="block font-semibold text-slate-700 mb-1.5">
                    E-mail Principal *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-email-input"
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-phone-input" className="block font-semibold text-slate-700 mb-1.5">
                    WhatsApp / Celular
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-phone-input"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="register-password-input" className="block font-semibold text-slate-700 mb-1.5">
                    Senha de Acesso *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label={showRegPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-confirm-password-input" className="block font-semibold text-slate-700 mb-1.5">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-confirm-password-input"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repita sua senha"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label={showRegConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Visual Meter */}
              {regPassword.length > 0 && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Segurança da senha:</span>
                    <span
                      className={`font-bold ${
                        pwdScore <= 1
                          ? 'text-rose-600'
                          : pwdScore === 2
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {pwdScore <= 1 ? 'Fraca' : pwdScore === 2 ? 'Média' : 'Forte'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    <div
                      className={`rounded-full ${
                        pwdScore >= 1 ? (pwdScore === 1 ? 'bg-rose-500' : pwdScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`rounded-full ${
                        pwdScore >= 2 ? (pwdScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`rounded-full ${
                        pwdScore >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`rounded-full ${
                        pwdScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* LGPD Terms Acceptance Checkbox */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 select-none">
                  <input
                    type="checkbox"
                    id="register-terms-checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 shrink-0"
                  />
                  <span className="leading-relaxed">
                    Concordo com os <strong>Termos de Uso</strong> e autorizo o tratamento de dados pessoais para geração de recursos de trânsito conforme a <strong>LGPD (Lei Federal nº 13.709/2018)</strong>.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                id="register-submit-button"
                disabled={isLoading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Criando sua conta...</span>
                  </>
                ) : (
                  <>
                    <span>Criar Minha Conta no DefesAi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-medium text-center">
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Análise Rápida</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Legal (CTB)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>LGPD Seguro</span>
                </div>
              </div>

              {/* Bottom Switcher */}
              <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-100">
                Já possui cadastro no DefesAi?{' '}
                <button
                  type="button"
                  id="link-switch-to-login"
                  onClick={() => handleTabChange('login')}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Acesse sua conta aqui
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Recuperação de Senha</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Informe o e-mail cadastrado na plataforma. Enviaremos as instruções para você redefinir sua senha com segurança.
            </p>

            {resetStatus.type === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{resetStatus.message}</span>
              </div>
            )}

            {resetStatus.type === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resetStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={resetStatus.type === 'loading'}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5"
                >
                  {resetStatus.type === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar Instruções</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
