import React from 'react';
import { useUser } from '../../context/UserContext';
import BottomNav from '../layout/BottomNav';
import { Trophy, Flame, Coins, ChevronRight, Crown, Gift, Search, Bell, User, Zap, Info, ScanLine, X, LogOut, BarChart3, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as supabase from '../../services/supabase';

const xplevels = [
    { name: "Consumidor Curioso", min: 1 },
    { name: "Detetive de Rótulos", min: 4 },
    { name: "Guardião da Saúde", min: 7 },
];

const DAILY_TIPS = [
    { title: "Evite o 'Açúcar Mascarado'", tip: "Maltodextrina, Xarope de Milho e Dextrose são apenas apelidos para o açúcar que inflama seu corpo.", gender: 'all' },
    { title: "Parabenos em Shampoos", tip: "Evite metilparabeno e propilparabeno; eles podem interferir no seu sistema hormonal.", gender: 'all' },
    { title: "Cuidado com o Flúor", tip: "Em excesso, o flúor pode ser prejudicial. Considere opções de pastas de dente naturais.", gender: 'all' },
    { title: "Sodium Laureth Sulfate", tip: "Este agente espumante comum em sabonetes pode causar irritação extrema em peles sensíveis.", gender: 'all' },
    { title: "O Perigo dos Gorduras Trans", tip: "Gordura hidrogenada é o maior inimigo da sua saúde cardiovascular. Fuja sempre.", gender: 'all' },
    // Gender Specific
    { title: "Saúde Hormonal Feminina", tip: "Evite ftalatos em perfumes e plásticos quentes (BPA). Eles imitam o estrogênio e podem desregular seu ciclo.", gender: 'female' },
    { title: "Maquiagem sem Toxinas", tip: "Chumbo em batons é mais comum do que parece. Busque marcas 'Clean Beauty' certificadas.", gender: 'female' },
    { title: "Testosterona e Plásticos", tip: "BPA e Ftalatos são conhecidos por reduzir a testosterona. Evite garrafas plásticas expostas ao sol.", gender: 'male' },
    { title: "Proteína Limpa", tip: "Muitos wheys contêm adoçantes artificiais que prejudicam o intestino. Prefira opções adoçadas com Stevia ou neutras.", gender: 'male' }
];

const Dashboard = () => {
    const { user, profile, credits, history, loading, addCredits } = useUser();
    const [infoModal, setInfoModal] = React.useState(null);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [dailyTip, setDailyTip] = React.useState(DAILY_TIPS[0]);

    // Personalize Tip based on Gender
    React.useEffect(() => {
        const gender = profile?.gender || 'all';
        const filteredTips = DAILY_TIPS.filter(t => t.gender === 'all' || t.gender === gender);
        setDailyTip(filteredTips[Math.floor(Math.random() * filteredTips.length)]);
    }, [profile]);
    const navigate = useNavigate();

    const gamification = {
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        streak: profile?.streak || 0,
        badges: profile?.badges || []
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="pb-28 min-h-screen bg-white font-sans selection:bg-brand-green/20"
        >
            {/* Stat Info Modals */}
            <AnimatePresence>
                {infoModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white rounded-t-[3rem] p-8 w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setInfoModal(null)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <div className="mb-6">
                                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-[#FF385C] mb-4">
                                    {infoModal === 'fogo' && <Flame size={32} fill="currentColor" />}
                                    {infoModal === 'xp' && <Trophy size={32} />}
                                    {infoModal === 'creditos' && <Coins size={32} />}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">
                                    {infoModal === 'fogo' && 'Fogo Diário'}
                                    {infoModal === 'xp' && 'Sua Experiência'}
                                    {infoModal === 'creditos' && 'Seus Créditos'}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed italic">
                                    {infoModal === 'fogo' && 'A sequência de dias seguidos que você analisou ao menos um produto. Mantenha o fogo aceso para ganhar bônus!'}
                                    {infoModal === 'xp' && 'Seus pontos de experiência acumulados. Cada análise e cada nova descoberta aumentam seu nível de consciência.'}
                                    {infoModal === 'creditos' && 'Créditos usados para realizar análises de IA profundas. Você pode ganhar mais indicando amigos ou assinando um plano.'}
                                </p>
                            </div>
                            <button onClick={() => setInfoModal(null)} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-lg">Entendi</button>
                        </motion.div>
                    </motion.div>
                )}

                {showNotifications && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white rounded-t-[3rem] p-8 w-full max-w-lg shadow-2xl relative min-h-[400px]">
                            <button onClick={() => setShowNotifications(false)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 mt-4">Notificações</h3>
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                                <Bell size={64} strokeWidth={1} />
                                <p className="font-bold mt-4">Silêncio por aqui...</p>
                                <p className="text-xs text-center px-10">Avisaremos quando tivermos novidades sobre sua saúde ou bônus.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Header */}
            <div className="px-6 pt-8 pb-4 sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white overflow-hidden shadow-lg shadow-gray-200">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#FF385C] to-pink-600 flex items-center justify-center text-white font-black">
                                    {user?.name?.charAt(0) || 'N'}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Bem-vindo</p>
                            <h2 className="text-lg font-black text-gray-900 leading-tight">{user?.name || 'Explorador'}</h2>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {user?.email === 'admin@notoxlabel.com.br' && (
                            <Link to="/admin" className="p-2.5 bg-gray-900 text-emerald-400 rounded-full hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-4">
                                <BarChart3 size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">CEO</span>
                            </Link>
                        )}
                        <button onClick={() => {
                            if (confirm("Deseja realmente sair?")) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }} className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95 border border-gray-100">
                            <LogOut size={20} />
                        </button>
                        <button onClick={() => setShowNotifications(true)} className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-[#FF385C] transition-all hover:scale-110 active:scale-95 relative border border-gray-100">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF385C] rounded-full border-2 border-white"></div>
                        </button>
                        <Link to="/profile" className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-[#FF385C] transition-all hover:scale-110 active:scale-95 border border-gray-100">
                            <User size={20} />
                        </Link>
                    </div>
                </div>

                {/* Global XP Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-0.5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(profile?.xp % 100) || 0}%` }}
                        className="h-full bg-gradient-to-r from-[#FF385C] to-pink-500 rounded-full shadow-[0_0_8px_rgba(255,56,92,0.4)]"
                    />
                </div>
            </div>

            <div className="px-6 space-y-8 mt-4">
                {/* Hero / CTA Section */}
                <motion.div variants={itemVariants} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-brand-emerald rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Link
                        to="/scan"
                        className="relative block bg-white rounded-[2.5rem] p-8 border-2 border-gray-100 shadow-2xl shadow-emerald-900/10 group-hover:scale-[1.01] transition-all overflow-hidden"
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div className="max-w-[180px]">
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-3 inline-block">Scanner de IA</span>
                                <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">Analisar Produto</h3>
                                <p className="text-gray-400 text-xs font-medium">Capture o rótulo e descubra o que você está ingerindo.</p>
                            </div>
                            <div className="bg-[#FF385C] w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                                <Search size={28} />
                            </div>
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-50 rounded-full opacity-50"></div>
                    </Link>
                </motion.div>

                {/* Horizontal Stat Scroll (Spotify Style) */}
                <motion.div variants={itemVariants} className="overflow-x-auto pb-4 scrollbar-hide flex gap-4 -mx-6 px-6">
                    <button onClick={() => setInfoModal('fogo')} className="min-w-[140px] bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col gap-3 text-left">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-orange-100/50 rounded-2xl w-fit text-orange-600">
                                <Flame size={20} fill="currentColor" className="opacity-80" />
                            </div>
                            <Info size={14} className="text-gray-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{gamification.streak}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fogo Diário</p>
                        </div>
                    </button>
                    <button onClick={() => setInfoModal('xp')} className="min-w-[140px] bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col gap-3 text-left">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-100/50 rounded-2xl w-fit text-blue-600">
                                <Trophy size={20} />
                            </div>
                            <Info size={14} className="text-gray-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{gamification.xp}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experiência</p>
                        </div>
                    </button>
                    <button onClick={() => setInfoModal('creditos')} className="min-w-[140px] bg-brand-blue text-white p-5 rounded-3xl border border-brand-blue shadow-lg shadow-blue-900/10 flex flex-col gap-3 text-left">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit text-white">
                                <Coins size={20} />
                            </div>
                            <Info size={14} className="text-white/30" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{credits}</p>
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Créditos</p>
                        </div>
                    </button>
                </motion.div>

                {/* Sub-Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                        <Link to="/referral" className="block p-5 bg-[#F7F7F7] rounded-[2rem] border border-gray-100 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <Gift className="text-pink-500" size={20} />
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight">Ganhar Créditos</h4>
                            <p className="text-[10px] text-gray-400 font-medium">Indique amigos</p>
                        </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link to="/plans" className="block p-5 bg-white rounded-[2rem] border-2 border-gray-100 shadow-lg shadow-gray-200/30 group hover:shadow-xl transition-all">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                                <Crown className="text-yellow-500" size={20} />
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight">Assinatura Pro</h4>
                            <p className="text-[10px] text-gray-400 font-medium">+ Saúde e Autoridade</p>
                        </Link>
                    </motion.div>
                </div>

                {/* Community Insights (Pro Health Teaser) */}
                <Link to="/community" className="block">
                    <motion.div variants={itemVariants} className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100/50 hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <h3 className="text-lg font-black text-gray-900">Comunidade Pro</h3>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-white border border-emerald-100 px-3 py-1 rounded-full shadow-sm">Insights Reais</span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-100 overflow-hidden">
                                        <img src="https://i.pravatar.cc/100?u=dr_oliveira" alt="Pro" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900">Dra. Oliveira</p>
                                        <p className="text-[8px] font-bold text-emerald-500 uppercase">Nutricionista</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">
                                    "Cuidado com o 'zero açúcar' em bebidas energéticas. A sucralose em excesso pode afetar sua microbiota..."
                                </p>
                            </div>
                        </div>
                        <div className="w-full mt-6 text-center text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] py-2">Ver Feed de Especialistas</div>
                    </motion.div>
                </Link>

                {/* Healthy Evolution Teaser */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={() => navigate('/evolution')}
                        className="w-full bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-gray-400/30 active:scale-[0.98] transition-all text-left"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={18} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Evolução Saudável</span>
                                </div>
                                <h3 className="text-2xl font-black mb-1">Seu progresso real.</h3>
                                <p className="text-xs text-gray-400 font-medium italic">Veja o impacto dos hábitos limpos no seu corpo.</p>
                            </div>
                            <ChevronRight size={24} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    </button>
                </motion.div>

                {/* Recent History */}
                <Link to="/history" className="block">
                    <motion.div variants={itemVariants} className="p-6 bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/40 hover:bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all mt-4 border-l-4 border-l-transparent hover:border-l-[#FF385C]">
                        <div className="flex justify-between items-end mb-4 px-1">
                            <h3 className="text-xl font-black text-gray-900 leading-none">Jornada de Consumo</h3>
                            <div className="text-xs font-black text-[#FF385C] uppercase tracking-wider">Ver Tudo</div>
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="text-4xl mb-3 text-gray-200">
                                    <ScanLine size={40} className="mx-auto" />
                                </div>
                                <p className="text-gray-400 text-sm font-bold">Comece analisando um rótulo.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.slice(0, 3).map((scan) => (
                                    <div key={scan.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg ${scan.overall_score >= 7 ? 'bg-emerald-500' :
                                                scan.overall_score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}>
                                                {scan.overall_score}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{scan.product_name}</h4>
                                                <p className="text-[10px] font-black uppercase text-gray-300 tracking-wider">
                                                    {new Date(scan.date).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-300" size={16} strokeWidth={3} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </Link>

                {/* Tip Card */}
                <motion.div variants={itemVariants} className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/onboarding')}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Zap className="text-yellow-400" size={20} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Dica Diária</span>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="text-xl font-bold leading-tight mb-2">{dailyTip.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic">
                            {dailyTip.tip}
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                </motion.div>
            </div>

            <BottomNav />
        </motion.div>
    );
};

export default Dashboard;
