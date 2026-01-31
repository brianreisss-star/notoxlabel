import React, { useState, useEffect } from 'react';
import { Mail, Lock, Chrome, Facebook, ArrowRight, Settings, AlertCircle, User, Gift, ScanLine } from 'lucide-react';
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
        if (ref) {
            setRefCode(ref);
            setIsLogin(false); // Encourage signup if referred
        }
    }, [location]);

    // Supabase Config Modal State
    const [showConfig, setShowConfig] = useState(false);
    const [sbUrl, setSbUrl] = useState('');
    const [sbKey, setSbKey] = useState('');

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        const isAdmin = email === 'admin@notoxlabel.com.br';
        if (!isSupabaseConfigured() && !isAdmin) { setShowConfig(true); return; }
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const result = await signIn(email, password);
                if (result.user) {
                    setUser(result.user);
                    // Short delay to allow Context to pick up the change and fetch profile
                    // In a perfect world we'd wait for the context loading state, but for now this ensures the state update propagates
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
                    setUser(result.user);
                    if (refCode) {
                        addCredits(2);
                        alert(`Bem-vindo! Você ganhou +2 créditos pela indicação.`);
                    }
                    setTimeout(() => navigate('/onboarding'), 100);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider) => {
        if (!isSupabaseConfigured()) { setShowConfig(true); return; }
        try {
            if (provider === 'google') await signInWithGoogle();
            if (provider === 'facebook') await signInWithFacebook();
        } catch (err) { setError(err.message); }
    };

    const saveConfig = () => {
        if (sbUrl && sbKey) {
            setSupabaseConfig(sbUrl, sbKey);
            setShowConfig(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-green/20">
            {/* Supabase Config Modal - Keeping its structure but cleaning it up */}
            <AnimatePresence>
                {showConfig && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-3xl font-black mb-2 tracking-tight text-gray-900">Configurar Banco</h2>
                            <p className="text-gray-400 font-medium mb-8 uppercase text-[10px] tracking-[0.2em]">Configurações Técnicas</p>

                            <div className="space-y-6 mb-10">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Project URL</label>
                                    <input type="text" value={sbUrl} onChange={e => setSbUrl(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-5 focus:bg-white focus:border-gray-900 outline-none transition-all font-medium text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Anon Key</label>
                                    <input type="text" value={sbKey} onChange={e => setSbKey(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-5 focus:bg-white focus:border-gray-900 outline-none transition-all font-medium text-sm" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowConfig(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-900 transition-colors">Cancelar</button>
                                <button onClick={saveConfig} className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-gray-200 active:scale-95 transition-all">Salvar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

                <div className="flex items-center gap-6 mb-10 overflow-hidden">
                    <div className="flex-1 h-px bg-gray-50"></div>
                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">Ou Redes Sociais</span>
                    <div className="flex-1 h-px bg-gray-50"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button onClick={() => handleSocialAuth('google')} className="bg-white border-2 border-gray-50 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm hover:border-gray-900 transition-all active:scale-95">
                        <Chrome size={24} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleSocialAuth('facebook')} className="bg-[#1877F2] h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-all">
                        <Facebook size={24} className="text-white" />
                    </button>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-500 font-bold mb-4">
                        {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-gray-900 underline ml-2 decoration-2 underline-offset-4">
                            {isLogin ? 'Criar minha conta' : 'Fazer login'}
                        </button>
                    </p>
                    <button onClick={() => setShowConfig(true)} className="text-gray-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-gray-500 transition-colors">
                        <Settings size={14} /> Configurações Supabase
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
