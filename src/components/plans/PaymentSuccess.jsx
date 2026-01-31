import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { updateUser } = useUser();

    useEffect(() => {
        // In a real flow, the webhook handles this in the background.
        // But for a smooth UX, we can optimistically set a flag or refetch.
        const timer = setTimeout(() => {
            // Simulator: Update plan locally for immediate feedback
            updateUser({ subscription_plan: 'pro' });
        }, 1000);
        return () => clearTimeout(timer);
    }, [updateUser]);

    return (
        <div className="h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-10"
            >
                <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 mb-8 mx-auto relative">
                    <CheckCircle size={48} strokeWidth={3} />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute -top-2 -right-2 text-yellow-500"
                    >
                        <Sparkles size={24} />
                    </motion.div>
                </div>

                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Bem-vindo ao Pro!</h1>
                <p className="text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                    Seu pagamento foi confirmado. Agora você tem acesso ilimitado à transparência e saúde.
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-sm"
            >
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap size={18} className="text-[#FF385C]" />
                        <span className="text-sm font-bold text-gray-600">Scans Ilimitados Ativados</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check size={18} className="text-emerald-500" />
                        <span className="text-sm font-bold text-gray-600">Acervo Completo Desbloqueado</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                >
                    Acessar Dashboard
                    <ArrowRight size={20} />
                </button>
            </motion.div>
        </div>
    );
};

// Simple check icon fix (lucide-react doesn't have Check in the prev list)
const Check = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default PaymentSuccess;
