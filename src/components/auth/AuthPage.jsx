import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, User, Gift } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle, signInWithFacebook, signIn, signUp, isSupabaseConfigured, setSupabaseConfig } from '../../services/supabase';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser, addCredits } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Referral Logic
    const [refCode, setRefCode] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        const mode = params.get('mode');

        if (ref) {
            setRefCode(ref);
            setIsLogin(false); // Encourage signup if referred
        }

        if (mode === 'signup') {
            setIsLogin(false);
        }
    }, [location]);



    const handleEmailAuth = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const result = await signIn(email, password);
                if (result.user) {
                    setUser(result.user);
                    // Short delay to allow Context to pick up the change and fetch profile
                    setTimeout(() => navigate('/'), 100);
                }
            } else {
                const formData = new FormData(e.target);
                const gender = formData.get('gender');
                const isProfessional = formData.get('isProfessional') === 'on';

                const result = await signUp(email, password, name, {
                    gender,
                    role: isProfessional ? 'professional' : 'user',
                    is_professional: isProfessional
                });

                if (result.user) {
                    // Check if email confirmation is required (session might be null)
                    if (result.session) {
                        setUser(result.user);
                        if (refCode) {
                            addCredits(2);
                            alert(`Bem-vindo! Você ganhou +2 créditos pela indicação.`);
                        }
                        setTimeout(() => navigate('/onboarding'), 100);
                    } else {
                        // Email confirmation flow
                        alert("Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro antes de entrar.");
                        setIsLogin(true); // Switch back to login
                    }
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider) => {
        try {
            if (provider === 'google') await signInWithGoogle();
        } catch (err) { setError(err.message); }
    };



    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-green/20">


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full p-6 pt-12"
            >
                <div className="text-left mb-12">
                    <div
                        onClick={() => { setEmail('admin@notoxlabel.com.br'); setPassword('admin123'); }}
                        className="w-20 h-20 bg-gray-900 rounded-[2rem] shadow-2xl flex items-center justify-center mb-8 active:scale-90 transition-transform cursor-pointer"
                    >
                        <span className="text-3xl font-black text-white tracking-widest ml-1">NT</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-[0.9]">
                        Saber o que você usa é poder.
                    </h1>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed italic">
                        No NoToxLabel você descobre a verdade escondida nos rótulos de qualquer produto.
                    </p>
                </div>

                {refCode && !isLogin && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-blue-50 text-brand-blue p-5 rounded-3xl mb-8 flex items-center gap-4 text-sm font-black border border-blue-100 shadow-sm"
                    >
                        <div className="bg-white p-2 rounded-xl shadow-sm"><Gift size={20} /></div>
                        Parabéns! Você ganhou +2 créditos pela indicação.
                    </motion.div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-5 rounded-3xl mb-8 flex items-center gap-4 text-sm font-bold border border-red-100">
                        <AlertCircle size={20} className="shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 relative overflow-hidden"
                            >
                                <div className="relative">
                                    <input
                                        type="text" placeholder="Seu nome" required={!isLogin}
                                        value={name} onChange={e => setName(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-5 pl-14 text-gray-800 focus:border-gray-900 outline-none transition-all font-medium shadow-sm"
                                    />
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"><User size={20} /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        name="gender"
                                        className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-5 text-gray-800 focus:border-gray-900 outline-none transition-all font-medium shadow-sm appearance-none"
                                        defaultValue=""
                                        required={!isLogin}
                                    >
                                        <option value="" disabled>Sexo</option>
                                        <option value="female">Feminino</option>
                                        <option value="male">Masculino</option>
                                        <option value="other">Outro</option>
                                    </select>

                                    <label className="flex items-center gap-3 bg-white border-2 border-gray-50 rounded-[2rem] p-2 pr-4 cursor-pointer hover:border-gray-200 transition-colors">
                                        <input type="checkbox" name="isProfessional" className="w-6 h-6 rounded-xl text-gray-900 focus:ring-gray-900 border-gray-300 ml-2" />
                                        <span className="text-xs font-bold text-gray-500 leading-tight">Sou Profissional de Saúde</span>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <input
                            type="email" placeholder="E-mail" required
                            name="email" autoComplete="username"
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-5 pl-14 text-gray-800 focus:border-gray-900 outline-none transition-all font-medium shadow-sm"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"><Mail size={20} /></div>
                    </div>
                    <div className="relative">
                        <input
                            type="password" placeholder="Senha" required
                            name="password" autoComplete="current-password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-5 pl-14 text-gray-800 focus:border-gray-900 outline-none transition-all font-medium shadow-sm"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"><Lock size={20} /></div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-gray-900 text-white h-[4.5rem] rounded-[2rem] font-black text-xl shadow-2xl shadow-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : (isLogin ? 'Entrar' : 'Começar Agora')}
                        {!loading && <ArrowRight size={24} strokeWidth={3} />}
                    </button>
                </form>

                <div className="mb-6"></div>

                <div className="mb-8">
                    <button onClick={() => handleSocialAuth('google')} className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-sm transition-all active:scale-95 group">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">Continuar com Google</span>
                    </button>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-500 font-bold mb-4">
                        {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-gray-900 underline ml-2 decoration-2 underline-offset-4">
                            {isLogin ? 'Criar minha conta' : 'Fazer login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
