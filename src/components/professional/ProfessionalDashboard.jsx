import React from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, FileText, CheckCircle2, TrendingUp, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';

const ProfessionalDashboard = () => {
    const { user, profile } = useUser();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans">
            {/* Header */}
            <div className="bg-white rounded-b-[3rem] p-8 shadow-sm border-b border-gray-100 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900"><ArrowLeft /></button>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                            <ShieldCheck size={12} /> Pro Health
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-200">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-none">{user?.name}</h1>
                            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wide">
                                {profile?.professional_specialty || "Especialista em Saúde"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-2xl font-black text-gray-900">12</p>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Pacientes</p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-2xl font-black text-gray-900">4.9</p>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Avaliação</p>
                        </div>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={200} />
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Verification Status */}
                {!profile?.professional_number && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
                        <h3 className="text-orange-800 font-bold mb-2">Verificação Pendente</h3>
                        <p className="text-orange-600/80 text-sm mb-4">Adicione seu número de registro profissional para ganhar o selo de verificação.</p>
                        <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-200 transition-colors">
                            Verificar Agora
                        </button>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <h3 className="text-lg font-black text-gray-900 ml-2">Ferramentas Pro</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-left hover:scale-[1.02] transition-transform">
                        <Users className="text-blue-500 mb-3" size={24} />
                        <h4 className="font-bold text-gray-900">Meus Pacientes</h4>
                        <p className="text-xs text-gray-400 mt-1">Gerenciar acompanhamento</p>
                    </button>
                    <button className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-left hover:scale-[1.02] transition-transform">
                        <FileText className="text-emerald-500 mb-3" size={24} />
                        <h4 className="font-bold text-gray-900">Materiais Educativos</h4>
                        <p className="text-xs text-gray-400 mt-1">PDFs e Guias</p>
                    </button>
                </div>

                {/* AI Content Generator Teaser */}
                <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2">Crie conteúdo com IA</h3>
                        <p className="text-gray-400 text-sm mb-6">Gere artigos baseados em evidência para engajar seus pacientes em segundos.</p>
                        <button onClick={() => navigate('/admin')} className="w-full bg-white text-gray-900 py-3 rounded-xl font-black text-sm">Acessar Gerador</button>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp size={100} />
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default ProfessionalDashboard;
