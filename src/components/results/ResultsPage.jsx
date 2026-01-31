import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle, AlertOctagon, Info, Sparkles, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {};
    const { addXp, referralCode } = useUser();
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        if (!result) {
            navigate('/scan');
        } else {
            addXp(25);
        }
    }, [result, navigate]);

    if (!result) return null;

    const handleActualShare = async () => {
        const shareData = {
            title: `NoToxLabel - Análise do ${result.product_name}`,
            text: `Acabei de descobrir que o ${result.product_name} tem nota ${result.overall_score}/10 no NoToxLabel! Descubra você também o que está comendo. Use meu link:`,
            url: `${window.location.origin}/auth?ref=${referralCode}`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                setShowShareModal(true);
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 7) return 'text-emerald-500';
        if (score >= 4) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-white pb-32 font-sans selection:bg-brand-green/20">
            {/* Minimal Sticky Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <h1 className="font-black text-sm tracking-tight truncate max-w-[180px] text-gray-400 uppercase tracking-widest">
                    Relatório Detalhado
                </h1>
                <button onClick={handleActualShare} className="p-2 -mr-2 hover:bg-gray-50 rounded-full text-gray-900 transition-colors">
                    <Share2 size={24} />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto px-6"
            >
                {/* Professional Hero Section */}
                <div className="relative pt-12 pb-16 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-8"
                    >
                        <div className={`text-[12rem] font-black leading-none tracking-tighter select-none ${getScoreColor(result.overall_score)} drop-shadow-2xl`}>
                            {result.overall_score}
                        </div>
                        <div className="mt-[-2rem] inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                            <Sparkles size={12} className="text-emerald-400" />
                            Nota NoToxLabel
                        </div>
                    </motion.div>

                    <h2 className="text-5xl font-black text-gray-900 mb-6 leading-[1.05] tracking-tight">
                        {result.product_name}
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm border-2 ${result.risk_level === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                            result.risk_level === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                            {result.risk_level === 'high' ? '⚠️ Alto Risco' : result.risk_level === 'medium' ? '⚠️ Risco Moderado' : '✅ Produto Limpo'}
                        </div>
                        <div className="px-6 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-xs text-gray-400 uppercase tracking-widest">
                            {result.category || 'Análise Geral'}
                        </div>
                    </div>

                    <div className="bg-gray-50/50 backdrop-blur-sm p-8 rounded-[3rem] border border-gray-100 text-left relative overflow-hidden">
                        <div className="relative z-10 flex gap-4">
                            <Info size={24} className="text-gray-300 shrink-0" />
                            <p className="text-gray-600 text-lg font-medium leading-relaxed italic">
                                "{result.summary}"
                            </p>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white rounded-full opacity-50 blur-2xl"></div>
                    </div>
                </div>

                {/* Alerts Section - Structured */}
                {result.personalized_alerts && result.personalized_alerts.length > 0 && (
                    <div className="mb-14">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Análise Clínica de Risco</h3>
                        <div className="space-y-4">
                            {result.personalized_alerts.map((alert, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-[2rem] border-2 border-red-50 flex gap-5 shadow-sm"
                                >
                                    <div className="bg-red-50 p-3 h-fit rounded-2xl text-red-500 shadow-inner">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm leading-snug">{alert}</p>
                                        <p className="text-[10px] text-red-300 font-black uppercase tracking-widest mt-1">Nível Crítico</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ingredients Analysis - Professional Grid */}
                <div className="mb-16">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Composição Detalhada</h3>
                    <div className="space-y-5">
                        {result.ingredients.map((ing, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="bg-white border-2 border-gray-50 p-8 rounded-[3rem] shadow-xl shadow-gray-200/20 hover:border-gray-200 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="max-w-[75%]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{ing.name}</h4>
                                            {ing.db_verified && <ShieldCheck size={16} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{ing.technical_name}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg ${ing.risk_score >= 7 ? 'bg-emerald-500' :
                                        ing.risk_score >= 4 ? 'bg-orange-500' : 'bg-red-500'
                                        }`}>
                                        {ing.risk_score}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 italic">
                                    "{ing.description}"
                                </p>

                                {ing.health_impact && (
                                    <div className="flex gap-4 bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400 shrink-0">
                                            <Activity size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impacto Biológico</p>
                                            <p className="text-xs text-gray-700 font-bold leading-snug">{ing.health_impact}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Better Brand Alternatives */}
                {result.alternatives && result.alternatives.length > 0 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-gray-900 p-8 rounded-[3rem] text-white relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-500 p-2 rounded-xl">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">Alternativas Reais</h3>
                            </div>
                            <div className="space-y-3">
                                {result.alternatives.map((alt, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 font-black text-lg">
                                        {alt}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    </motion.div>
                )}
            </motion.div>

            {/* Premium Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl px-6 py-6 border-t border-gray-100 flex gap-4 z-[60]">
                <button
                    onClick={() => navigate('/scan')}
                    className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    Novo Scan
                </button>
                <button
                    onClick={handleActualShare}
                    className="flex-1 py-4 bg-[#FF385C] text-white rounded-2xl font-black shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Share2 size={20} />
                    Compartilhar
                </button>
            </div>

            {/* Minimal Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end justify-center" onClick={() => setShowShareModal(false)}>
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        className="bg-white rounded-t-[3rem] w-full max-w-md p-8 pb-12 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">Compartilhe Saúde</h3>
                            <p className="text-gray-500 font-medium">Tire um print da nota ou envie o link direto para seus amigos.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-8 flex flex-col items-center">
                            <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overall_score)}`}>{result.overall_score}</div>
                            <div className="font-black text-xl text-gray-900">{result.product_name}</div>
                        </div>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-gray-300 transition-all active:scale-95"
                        >
                            Fechar
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
