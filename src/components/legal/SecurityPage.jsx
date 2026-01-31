import React from 'react';
import { ArrowLeft, Lock, Fingerprint, EyeOff, Server, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SecurityPage = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Criptografia", value: "SSL/TLS 256-bit", icon: <Lock size={16} /> },
        { label: "Servidor", value: "Supabase (Google Cloud)", icon: <Server size={16} /> },
        { label: "Privacidade", value: "Zero Data Sale", icon: <Fingerprint size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-white pb-12 font-sans">
            <div className="px-6 pt-12 pb-6 border-b border-gray-50 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Segurança</h1>
            </div>

            <div className="p-6 space-y-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="min-w-[160px] p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-3">
                            <div className="text-[#FF385C]">{stat.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-xs font-black text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 bg-emerald-500 rounded-[3rem] text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <ShieldCheck className="mb-4" size={48} />
                        <h2 className="text-4xl font-black mb-4 leading-none tracking-tighter">Sua segurança é nossa prioridade.</h2>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Utilizamos infraestrutura de nível bancário para garantir que suas análises e dados biométricos estejam sempre protegidos.
                        </p>
                    </div>
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                </motion.div>

                <div className="space-y-6">
                    <div className="flex gap-4 p-6 bg-white border-2 border-gray-100 rounded-[2.5rem]">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 h-fit">
                            <EyeOff size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Proteção de Identidade</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Suas fotos dos rótulos são processadas temporariamente e não são associadas à sua imagem pessoal por reconhecimento facial.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-white border-2 border-gray-100 rounded-[2.5rem]">
                        <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 h-fit">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Backup Automático</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Seus registros evolutivos e histórico de análise são sincronizados na nuvem sob demanda, garantindo que nada se perca ao trocar de aparelho.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
