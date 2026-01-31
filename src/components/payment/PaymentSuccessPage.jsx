import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const { profile } = useUser();

    useEffect(() => {
        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#FF385C', '#FBBF24']
        });
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8"
            >
                <CheckCircle2 size={48} strokeWidth={3} />
            </motion.div>

            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Pagamento Confirmado!</h1>
            <p className="text-gray-500 font-medium mb-12 max-w-sm">
                Sua assinatura foi ativada com sucesso. Você agora tem acesso total aos recursos do NoToxLabel.
            </p>

            <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-sm mb-8">
                <p className="text-sm font-bold text-gray-900 mb-2">O que acontece agora?</p>
                <ul className="text-left text-xs text-gray-500 space-y-2">
                    <li>• Seus créditos foram atualizados.</li>
                    <li>• O selo Pro aparecerá no seu perfil.</li>
                    <li>• Recibo enviado para seu e-mail.</li>
                </ul>
            </div>

            <button
                onClick={() => navigate('/')}
                className="w-full max-w-xs bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                Voltar ao Início <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default PaymentSuccessPage;
