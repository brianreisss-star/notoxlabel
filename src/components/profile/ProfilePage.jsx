import React, { useState, useRef } from 'react';
import { Camera, Edit2, Share2, Award, Settings, LogOut, Check, ChevronRight, User, Shield, Info, Flame, Trophy, X, Star, Lock, Eye, Instagram, ShieldCheck, ArrowLeft, Heart, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import BottomNav from '../layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { isApiKeyConfigured, setApiKey } from '../../services/claudeApi';

const LEVELS = [
    { level: 1, name: "Consumidor Curioso", minXp: 0 },
    { level: 2, name: "Detetive de Rótulos", minXp: 100 },
    { level: 3, name: "Guardião da Saúde", minXp: 300 },
    { level: 4, name: "Mestre da Consciência", minXp: 600 },
    { level: 5, name: "Lenda do Rótulo", minXp: 1000 }
];

const ProfilePage = () => {
    const { user, profile, updateUser, updateEvolution, addCredits, loading } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile?.name || user?.name || '');
    const [instagram, setInstagram] = useState(profile?.instagram_handle || '');
    const [isProfessional, setIsProfessional] = useState(profile?.is_professional || false);
    const [specialty, setSpecialty] = useState(profile?.professional_specialty || '');
    const [profNumber, setProfNumber] = useState(profile?.professional_number || '');
    const [goals, setGoals] = useState(profile?.goals || []);
    const [savedFeedback, setSavedFeedback] = useState(false);
    const [showApiConfig, setShowApiConfig] = useState(false);
    const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('notoxlabel_claude_api_key') || localStorage.getItem('rotulimpo_claude_api_key') || '');

    // Biometrics State
    const evolutionArray = profile?.evolution || [];
    const latestEvo = evolutionArray.length > 0 ? evolutionArray[evolutionArray.length - 1] : {};
    const [weight, setWeight] = useState(latestEvo.weight || '');
    const [muscleMass, setMuscleMass] = useState(latestEvo.muscle_mass || '');
    const [bodyFat, setBodyFat] = useState(latestEvo.body_fat || '');

    // Sync state when profile loads (important for re-login)
    React.useEffect(() => {
        if (profile) {
            setName(profile.name || user?.name || '');
            setInstagram(profile.instagram_handle || '');
            setIsProfessional(profile.is_professional || false);
            setSpecialty(profile.professional_specialty || '');
            setProfNumber(profile.professional_number || '');
            setGoals(profile.goals || []);

            const evo = profile.evolution || [];
            const last = evo.length > 0 ? evo[evo.length - 1] : {};
            setWeight(last.weight || '');
            setMuscleMass(last.muscle_mass || '');
            setBodyFat(last.body_fat || '');
        }
    }, [profile, user]);

    const [infoModal, setInfoModal] = useState(null); // 'xp', 'streak', 'badges'
    const [showSecurity, setShowSecurity] = useState(false);
    const [showRanking, setShowRanking] = useState(false);

    const goalsOptions = [
        "🍎 Longevidade", "⚖️ Emagrecer", "💪 Hipertrofia", "⚡ Energia",
        "✨ Estética", "🧘 Saúde Mental", "🛡️ Prevenção", "🏃 Performance"
    ];

    const toggleGoal = (goal) => {
        setGoals(prev => prev.includes(goal)
            ? prev.filter(g => g !== goal)
            : [...prev, goal]
        );
    };

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const gamification = {
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        streak: profile?.streak || 0,
        badges: profile?.badges || [],
        nextLevelXp: (profile?.level || 1) * 100,
        currentProgress: (profile?.xp % 100) || 0
    };

    const currentLevelInfo = [...LEVELS].reverse().find(l => gamification.xp >= l.minXp) || LEVELS[0];

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ photoURL: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = async () => {
        const updateData = {
            name,
            instagram_handle: instagram,
            is_professional: isProfessional,
            professional_specialty: specialty,
            professional_number: profNumber,
            goals: goals
        };

        await updateUser(updateData);

        // Update evolution if any metric changed
        if (weight !== latestEvo.weight || muscleMass !== latestEvo.muscle_mass || bodyFat !== latestEvo.body_fat) {
            await updateEvolution({
                weight: Number(weight),
                muscle_mass: Number(muscleMass),
                body_fat: Number(bodyFat)
            });
        }

        setSavedFeedback(true);
        setTimeout(() => {
            setSavedFeedback(false);
            setIsEditing(false);
        }, 1500);
    };

    const handleLogout = () => {
        if (confirm("Deseja realmente sair?")) {
            // Safer logout: preserve configuration
            localStorage.removeItem('notoxlabel_user');
            localStorage.removeItem('notoxlabel_profile');
            localStorage.removeItem('notoxlabel_history');
            localStorage.removeItem('rotulimpo_user');
            // Do NOT clear keys or provider config
            window.location.reload();
        }
    };

    const handleSaveApiKey = () => {
        setApiKey(tempApiKey);
        setShowApiConfig(false);
        alert('Configuração de IA salva com sucesso!');
    };

    return (
        <div className="min-h-screen bg-white pb-32 font-sans selection:bg-brand-green/20">
            {/* Explanatory Modals */}
            <AnimatePresence>
                {infoModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white rounded-t-[3rem] p-8 w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setInfoModal(null)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <div className="mb-6">
                                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-[#FF385C] mb-4">
                                    {infoModal === 'streak' && <Flame size={32} fill="currentColor" />}
                                    {infoModal === 'xp' && <Trophy size={32} />}
                                    {infoModal === 'badges' && <Award size={32} />}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">
                                    {infoModal === 'streak' && 'Sequência (Fogo Diário)'}
                                    {infoModal === 'xp' && 'Sua Experiência (XP)'}
                                    {infoModal === 'badges' && 'Suas Conquistas'}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed italic">
                                    {infoModal === 'streak' && 'Representa sua consistência. Mantenha o hábito de escanear produtos todos os dias para aumentar sua chama e ganhar multiplicadores de bônus!'}
                                    {infoModal === 'xp' && 'Pontos que você ganha ao realizar análises, ler curiosidades e indicar amigos. Quanto mais XP, maior seu nível de influência no NoToxLabel.'}
                                    {infoModal === 'badges' && 'Troféus digitais que marcam marcos importantes da sua jornada, como sua 1ª análise ou sua 1ª indicação com sucesso.'}
                                </p>
                            </div>
                            <button onClick={() => setInfoModal(null)} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-lg">Entendi</button>
                        </motion.div>
                    </motion.div>
                )}

                {showSecurity && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[120] flex flex-col p-6">
                        <button onClick={() => setShowSecurity(false)} className="w-fit p-3 bg-gray-50 rounded-full mb-8"><ArrowLeft size={24} /></button>
                        <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">Segurança & Privacidade</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 h-fit"><Lock size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Seus dados são seus</h4>
                                    <p className="text-sm text-gray-400 font-medium">Não vendemos suas informações para empresas de publicidade ou terceiros.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 h-fit"><Eye size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Transparência Total</h4>
                                    <p className="text-sm text-gray-400 font-medium">Você pode solicitar a exclusão de todos os seus dados e histórico a qualquer momento via suporte.</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4">Central Jurídica</h4>
                                <div className="space-y-4">
                                    <button onClick={() => navigate('/legal')} className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl">
                                        <span className="font-bold text-gray-700">Termos de Uso & LGPD</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>
                                    <button onClick={() => navigate('/security')} className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl">
                                        <span className="font-bold text-gray-700">Políticas de Segurança</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {showRanking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[120] flex flex-col p-6">
                        <button onClick={() => setShowRanking(false)} className="w-fit p-3 bg-gray-50 rounded-full mb-8"><ArrowLeft size={24} /></button>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Ranking Global</h2>
                        <p className="text-gray-400 mb-8 font-medium italic">Veja quem são os guardiões da saúde mais ativos.</p>

                        <div className="flex flex-col gap-4">
                            {[
                                { name: "Você", xp: gamification.xp, rank: 124, isMe: true },
                                { name: "Ana Silva", xp: 1450, rank: 1 },
                                { name: "Marcos Lima", xp: 1200, rank: 2 },
                                { name: "Juliana Costa", xp: 1150, rank: 3 }
                            ].sort((a, b) => b.xp - a.xp).map((item, idx) => (
                                <div key={idx} className={`p-6 rounded-3xl border ${item.isMe ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-100'} flex justify-between items-center`}>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-xl opacity-40">#{idx + 1}</span>
                                        <div>
                                            <h4 className="font-bold">{item.name}</h4>
                                            <p className={`text-[10px] uppercase font-black tracking-widest ${item.isMe ? 'text-white/60' : 'text-gray-300'}`}>
                                                {item.xp} XP
                                            </p>
                                        </div>
                                    </div>
                                    <Trophy size={20} className={idx === 0 ? "text-yellow-400" : "opacity-0"} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {showApiConfig && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[130] flex items-center justify-center p-8">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl relative">
                            <button onClick={() => setShowApiConfig(false)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">IA Config</h3>
                            <p className="text-gray-400 font-medium mb-8 text-sm leading-relaxed">Configuração Avançada de API.</p>
                            <button onClick={() => navigate('/scan')} className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-2xl font-black mb-4 flex items-center justify-center gap-2">
                                <Settings size={16} /> Configurar no Scanner
                            </button>
                            <button onClick={handleSaveApiKey} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
                                Salvar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header com Botão Voltar */}
            <div className="px-6 pt-12 pb-6 bg-white border-b border-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 p-2 px-4 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition-all font-bold text-xs"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    <button onClick={handleLogout} className="p-3 bg-gray-50 text-gray-400 rounded-full hover:text-red-500 transition-colors">
                        <LogOut size={22} />
                    </button>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase text-[#FF385C] tracking-[0.3em] mb-1">Central do Usuário</p>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Meu Perfil</h1>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
            >
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl shadow-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                            {(profile?.photoURL || user?.photoURL) ? (
                                <img src={profile?.photoURL || user?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#FF385C] to-pink-600 flex items-center justify-center text-white text-4xl font-black">
                                    {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'E'}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white"
                        >
                            <Camera size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>

                    <div className="text-center w-full px-6">
                        {isEditing ? (
                            <div className="flex flex-col gap-3 items-center">
                                <input
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="text-2xl font-black text-center border-b-2 border-gray-900 focus:outline-none w-full bg-transparent"
                                    placeholder="Seu nome"
                                />
                                <div className="flex items-center gap-2 w-full bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-gray-400 font-bold">@</span>
                                    <input
                                        type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                                        className="text-sm font-bold bg-transparent outline-none w-full"
                                        placeholder="seu.instagram"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{profile?.name || user?.name || 'Explorador'}</h1>
                                    {user?.email === 'admin@notoxlabel.com.br' && (
                                        <div className="bg-blue-500 text-white rounded-full p-0.5">
                                            <CheckCircle2 size={16} strokeWidth={4} />
                                        </div>
                                    )}
                                    <button onClick={() => setIsEditing(true)} className="text-gray-300 hover:text-gray-900 p-2">
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                                {profile?.instagram_handle && (
                                    <a href={`https://instagram.com/${profile.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-pink-500 font-bold text-sm mt-1 hover:scale-105 transition-transform">
                                        <Instagram size={14} />
                                        <span>@{profile.instagram_handle}</span>
                                    </a>
                                )}
                                {profile?.is_professional && (
                                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full mt-2 border border-emerald-100">
                                        <ShieldCheck size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {profile.professional_specialty} • {profile.professional_number}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Dynamic XP Progress Bar */}
                        <div className="mt-8 w-full max-w-xs mx-auto px-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">Lvl {gamification.level}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{gamification.xp % 100} / 100 XP</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-0.5 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${gamification.currentProgress}%` }}
                                    className="h-full bg-gradient-to-r from-[#FF385C] to-pink-500 rounded-full"
                                />
                            </div>
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-2 text-center">
                                {currentLevelInfo.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Unified Sections (Integrated from Settings) */}
                <div className="space-y-6 mb-10">
                    {/* Section: Health Goals & Biometrics */}
                    <section
                        onClick={() => !isEditing && setIsEditing(true)}
                        className={`rounded-[2.5rem] p-8 border-2 transition-all ${isEditing ? 'bg-pink-50/50 border-pink-100 ring-4 ring-pink-500/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/40 hover:border-[#FF385C]/30 cursor-pointer active:scale-[0.99]'}`}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Heart size={20} className="text-[#FF385C]" />
                            <div>
                                <h3 className="font-black text-gray-900 leading-none">Objetivos & Biometria</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sua Personalização</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {goalsOptions.map(goal => (
                                        <button
                                            key={goal}
                                            onClick={() => toggleGoal(goal)}
                                            className={`p-4 rounded-[2rem] border-2 transition-all text-left group ${goals.includes(goal)
                                                ? 'bg-gray-900 border-gray-900 text-white'
                                                : 'bg-white border-gray-50 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${goals.includes(goal) ? 'text-white' : 'text-gray-300 group-hover:text-gray-400'}`}>Objetivo</span>
                                            <p className="font-bold text-xs mt-0.5">{goal}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Biometrics Input Section */}
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-pink-100">
                                    <div className="bg-white rounded-2xl p-4 border border-pink-100">
                                        <label className="text-[8px] font-black text-pink-300 uppercase block mb-1">Peso (kg)</label>
                                        <input
                                            type="number" value={weight} onChange={e => setWeight(e.target.value)}
                                            className="w-full bg-transparent font-black text-sm outline-none" placeholder="00.0"
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 border border-pink-100">
                                        <label className="text-[8px] font-black text-pink-300 uppercase block mb-1">Massa (%)</label>
                                        <input
                                            type="number" value={muscleMass} onChange={e => setMuscleMass(e.target.value)}
                                            className="w-full bg-transparent font-black text-sm outline-none" placeholder="00.0"
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 border border-pink-100">
                                        <label className="text-[8px] font-black text-pink-300 uppercase block mb-1">Gordura (%)</label>
                                        <input
                                            type="number" value={bodyFat} onChange={e => setBodyFat(e.target.value)}
                                            className="w-full bg-transparent font-black text-sm outline-none" placeholder="00.0"
                                        />
                                    </div>
                                </div>
                                <div className="sticky bottom-4 z-40 bg-white/0 pt-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); saveProfile(); }}
                                        className={`w-full text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl ${savedFeedback ? 'bg-emerald-500 scale-95' : 'bg-gray-900 shadow-gray-200/50 hover:bg-[#FF385C]'}`}
                                    >
                                        {savedFeedback ? <Check size={20} /> : <Check size={20} />}
                                        {savedFeedback ? 'Confirmar Medidas' : 'Salvar Alterações'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {goals.length > 0 ? (
                                        goals.map(goal => (
                                            <div key={goal} className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                {goal}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] text-gray-400 italic">Clique em editar para definir metas.</p>
                                    )}
                                </div>
                                {latestEvo.weight && (
                                    <div className="flex gap-4 pt-4 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Último Peso</span>
                                            <span className="font-black text-gray-900">{latestEvo.weight}kg</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Massa Magra</span>
                                            <span className="font-black text-gray-900">{latestEvo.muscle_mass}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setInfoModal('streak')} className="p-6 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center text-center relative hover:scale-[1.02] transition-all group">
                        <Info size={14} className="absolute top-4 right-4 text-gray-300 group-hover:text-gray-600" />
                        <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">🔥</div>
                        <div className="text-2xl font-black text-gray-900">{gamification.streak}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sequência</div>
                    </button>
                    <button onClick={() => setInfoModal('xp')} className="p-6 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center text-center relative hover:scale-[1.02] transition-all group">
                        <Info size={14} className="absolute top-4 right-4 text-gray-300 group-hover:text-gray-600" />
                        <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">🛡️</div>
                        <div className="text-2xl font-black text-gray-900">{gamification.xp}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experiência</div>
                    </button>
                </div>

                {/* Rest of Unified Sections (Professional) */}
                <div className="space-y-8 mb-12">
                    {/* Section: Professional Identity */}
                    <section className={`rounded-[2.5rem] p-8 border transition-all ${isEditing ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={24} className={isEditing || isProfessional ? 'text-emerald-500' : 'text-gray-300'} />
                                <div>
                                    <h3 className="font-black text-gray-900">Identidade Profissional</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selo Pro Health</p>
                                </div>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => setIsProfessional(!isProfessional)}
                                    className={`w-14 h-8 rounded-full transition-all relative ${isProfessional ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isProfessional ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            isProfessional && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                                            <label className="text-[10px] font-black text-emerald-300 uppercase block mb-1">Conselho</label>
                                            <select
                                                value={specialty}
                                                onChange={(e) => setSpecialty(e.target.value)}
                                                className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="CRM">CRM</option>
                                                <option value="CRN">CRN</option>
                                                <option value="CRO">CRO</option>
                                                <option value="CREFITO">CREFITO</option>
                                            </select>
                                        </div>
                                        <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                                            <label className="text-[10px] font-black text-emerald-300 uppercase block mb-1">Número</label>
                                            <input
                                                type="text"
                                                value={profNumber}
                                                onChange={(e) => setProfNumber(e.target.value)}
                                                className="w-full bg-transparent font-bold text-sm outline-none"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ) : (
                            isProfessional && (
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-emerald-100 w-fit">
                                    <Check size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-600">{specialty} • {profNumber}</span>
                                </div>
                            )
                        )}
                        {!isEditing && !isProfessional && (
                            <p className="text-[10px] text-gray-400 italic">Configure seu perfil profissional para postar na comunidade.</p>
                        )}
                    </section>
                </div>

                {/* Healthy Evolution Teaser (Moved Down as requested) */}
                <div className="mb-10 px-2">
                    <button
                        onClick={() => navigate('/evolution')}
                        className="w-full bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-gray-400/30 active:scale-[0.98] transition-all"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={18} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Evolução Saudável</span>
                                </div>
                                <h3 className="text-2xl font-black mb-1">Seu corpo agradece.</h3>
                                <p className="text-xs text-gray-400 font-medium italic">Veja o impacto das suas escolhas "limpas".</p>
                            </div>
                            <ChevronRight size={24} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    </button>
                </div>

                {/* Achievement Scroll */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-gray-900">Suas Conquistas</h3>
                            <button onClick={() => setInfoModal('badges')}><Info size={14} className="text-gray-300" /></button>
                        </div>
                        <button onClick={() => setShowRanking(true)} className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">Ver Ranking</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {(gamification.badges.length > 0 ? gamification.badges : ['🚀', '🔟']).map((badge, i) => (
                            <div key={i} className="min-w-[70px] h-[70px] bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-center text-3xl hover:scale-105 transition-transform cursor-pointer">
                                {badge === 'first_scan' ? '🚀' : badge === '10_scans' ? '🔟' : badge}
                            </div>
                        ))}
                        <div className="min-w-[70px] h-[70px] bg-gray-50 border border-gray-100 border-dashed rounded-3xl flex items-center justify-center">
                            <Star size={24} className="text-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Account Settings Menu */}
                <div className="space-y-3 mb-10">
                    <button onClick={() => navigate('/plans')} className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-xl shadow-gray-200/40 group hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600 shadow-inner">
                                <Award size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Assinatura & Pro</p>
                                <p className="text-xs text-gray-400 font-medium">Torne-se autoridade na comunidade</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-gray-900 transition-colors" />
                    </button>

                    <button onClick={() => setShowSecurity(true)} className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-xl shadow-gray-200/40 group hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-inner">
                                <Shield size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Segurança & Privacidade</p>
                                <p className="text-xs text-gray-400 font-medium">Proteção dos seus dados</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-gray-900 transition-colors" />
                    </button>

                    <button onClick={() => setShowApiConfig(true)} className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-xl shadow-gray-200/40 group hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl shadow-inner ${isApiKeyConfigured() ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                <Zap size={22} fill={isApiKeyConfigured() ? "currentColor" : "none"} />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900">Inteligência Artificial</p>
                                    <div className={`w-2 h-2 rounded-full ${isApiKeyConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{isApiKeyConfigured() ? 'NoTox IA Ativa' : 'Modo Demonstração Ativo'}</p>
                                {/* AI Status Indicator */}
                            </div>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-gray-900 transition-colors" />
                    </button>
                </div>

                {/* Invite Card */}
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white text-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <Share2 className="mx-auto mb-4 text-[#FF385C]" size={32} />
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Vale a pena compartilhar.</h3>
                        <p className="text-gray-400 font-medium text-sm mb-6">Ajude outras pessoas a descobrirem a verdade e ganhe créditos.</p>
                        <button
                            onClick={() => navigate('/referral')}
                            className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Indicar Amigos
                        </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </motion.div>

            <BottomNav />
        </div>
    );
};

export default ProfilePage;
