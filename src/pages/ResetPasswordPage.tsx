import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/UserContext';
import { HeadlessSEO } from '../components/HeadlessSEO';

const ResetPasswordPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { requestPasswordReset, resetPassword, loading, error, clearError } = useAuth();

    // Query Params
    const key = searchParams.get('key');
    const login = searchParams.get('login');
    const isSettingNewPassword = !!(key && login);

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fieldError, setFieldError] = useState('');

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldError('');
        if (!email) {
            setFieldError('Email é obrigatório');
            return;
        }
        try {
            await requestPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            // Erro já tratado pelo context
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldError('');

        if (password.length < 6) {
            setFieldError('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            setFieldError('As senhas não coincidem');
            return;
        }

        try {
            await resetPassword(key!, login!, password);
            setSuccess(true);
            // Redirecionar após alguns segundos respeitando o idioma
            const homePath = i18n.language.startsWith('pt') ? '/pt/' : '/';
            setTimeout(() => navigate(homePath), 5000);
        } catch (err) {
            // Erro já tratado pelo context
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <HeadlessSEO
                title={isSettingNewPassword ? "Definir Nova Senha | DJ Zen Eyer" : "Recuperar Senha | DJ Zen Eyer"}
                noindex={true}
            />

            {/* Background Decor */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link to={i18n.language.startsWith('pt') ? '/pt/' : '/'} className="inline-block mb-6">
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Zen<span className="text-primary italic">Eyer</span>
                        </h1>
                    </Link>
                    <h2 className="text-3xl font-black text-white mb-2 font-display tracking-tight">
                        {isSettingNewPassword ? t('auth.reset_password.title_set') || 'Nova Senha' : t('auth.reset_password.title_request') || 'Recuperar Acesso'}
                    </h2>
                    <p className="text-white/60 text-sm">
                        {isSettingNewPassword
                            ? 'Escolha uma senha forte para sua segurança'
                            : 'Enviaremos um link de recuperação para o seu email'}
                    </p>
                </div>

                <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Tudo pronto!</h3>
                                <p className="text-white/60 mb-6 underline-offset-4 decoration-primary/50">
                                    {isSettingNewPassword
                                        ? 'Sua senha foi alterada com sucesso. Você será redirecionado em instantes.'
                                        : 'Se o email existir em nossa base, você receberá o link em breve. Verifique também sua caixa de spam.'}
                                </p>
                                <Link
                                    to={i18n.language.startsWith('pt') ? '/pt/' : '/'}
                                    className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold"
                                >
                                    <ArrowLeft size={18} />
                                    Voltar ao início
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div key="form" exit={{ opacity: 0, x: -20 }}>
                                {(error || fieldError) && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-3">
                                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <span>{fieldError || error}</span>
                                    </div>
                                )}

                                {!isSettingNewPassword ? (
                                    <form onSubmit={handleRequestReset} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-white/50 mb-2 ml-1">Email Cadastrado</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="seu@email.com"
                                                    className="w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Link de Reset'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSetPassword} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-white/50 mb-2 ml-1">Nova Senha</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Mínimo 6 caracteres"
                                                    className="w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-12 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase text-white/50 mb-2 ml-1">Confirmar Senha</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Repita a nova senha"
                                                    className="w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Nova Senha'}
                                        </button>
                                    </form>
                                )}

                                <div className="mt-8 text-center pt-6 border-t border-white/5">
                                    <Link to={i18n.language.startsWith('pt') ? '/pt/' : '/'} className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                                        Voltar para o Login
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
