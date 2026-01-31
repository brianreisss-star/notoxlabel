import React from 'react';
import { useUser } from '../../context/UserContext';
import { ArrowLeft, ChevronRight, Search, Calendar, Lock, BarChart3, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';
import { motion } from 'framer-motion';

const HistoryPage = () => {
    const { history, fullHistoryCount, isPro, loading } = useUser();
    const navigate = useNavigate();
    const hasLockedScans = !isPro && fullHistoryCount > history.length;

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32 font-sans selection:bg-brand-green/20">
            {/* Minimal Header */}
            <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black text-gray-900 tracking-tighter">Sua Jornada</h1>
                <div className="w-10"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6"
            >
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 leading-[0.9] tracking-tighter">O histórico da sua saúde.</h2>
                        <p className="text-gray-400 font-medium italic">Reveja o que você descobriu nos rótulos.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
                        <BarChart3 size={14} className="text-[#FF385C]" />
                        Relatório
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="text-6xl mb-6 grayscale opacity-20">🥗</div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Nada por aqui ainda.</h3>
                        <p className="text-gray-400 font-medium mb-8">Comece analisando seu primeiro produto.</p>
                        <button
                            onClick={() => navigate('/scan')}
                            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
                        >
                            Escanear Agora
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((scan, idx) => (
                            <motion.div
                                key={scan.id || idx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link
                                    to="/results"
                                    state={{ result: scan }}
                                    className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover:shadow-2xl hover:shadow-gray-200/40 transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-2xl text-white shadow-lg ${scan.overall_score >= 7 ? 'bg-emerald-500 shadow-emerald-100' :
                                            scan.overall_score >= 4 ? 'bg-yellow-500 shadow-yellow-100' :
                                                'bg-red-500 shadow-red-100'
                                            }`}>
                                            {scan.overall_score}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg leading-tight mb-1 group-hover:text-[#FF385C] transition-colors line-clamp-1">{scan.product_name}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                    <Calendar size={12} />
                                                    {new Date(scan.date).toLocaleDateString('pt-BR')}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${scan.risk_level === 'high' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {scan.risk_level === 'high' ? 'Alto Risco' : 'Aprovado'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-200 group-hover:text-gray-900 transition-colors" size={24} strokeWidth={3} />
                                </Link>
                            </motion.div>
                        ))}

                        {hasLockedScans && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200 text-center relative overflow-hidden group"
                            >
                                <Lock className="mx-auto mb-4 text-gray-300 group-hover:text-gray-900 transition-colors" size={32} />
                                <h3 className="text-lg font-black text-gray-900 mb-1">+{fullHistoryCount - history.length} Scans Ocultos</h3>
                                <p className="text-xs text-gray-400 font-medium mb-6">Assine o Pro para desbloquear seu acervo completo e histórico ilimitado.</p>
                                <button
                                    onClick={() => navigate('/plans')}
                                    className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black border border-gray-100 shadow-sm hover:bg-gray-900 hover:text-white transition-all"
                                >
                                    Ver Planos Archive
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>

            <BottomNav />
        </div>
    );
};

export default HistoryPage;
