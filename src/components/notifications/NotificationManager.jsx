import React, { useState, useEffect } from 'react';
import { Bell, BellOff, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../services/supabase';

const NotificationManager = () => {
    const { user, profile } = useUser();
    const [status, setStatus] = useState(Notification.permission);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Show prompt after 5 seconds if not decided
        if (Notification.permission === 'default') {
            const timer = setTimeout(() => setShowPrompt(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const requestPermission = async () => {
        const permission = await Notification.requestPermission();
        setStatus(permission);
        setShowPrompt(false);

        if (permission === 'granted' && user) {
            // Save to profile in Supabase (Optional: for backend to send push later)
            await supabase.from('profiles').update({
                push_enabled: true,
                updated_at: new Date()
            }).eq('id', user.id);
        }
    };

    if (status === 'granted') return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-24 left-6 right-6 z-[100]"
                >
                    <div className="bg-gray-900 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles size={80} className="text-white" />
                        </div>

                        <div className="flex gap-4 items-start relative z-10">
                            <div className="bg-brand-green/20 p-3 rounded-2xl text-brand-green">
                                <Bell size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-black text-lg leading-tight mb-1">Ativar Alertas de Saúde?</h4>
                                <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                    Receba avisos sobre riscos em tempo real e dicas de nutrição personalizadas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 relative z-10">
                            <button
                                onClick={() => setShowPrompt(false)}
                                className="flex-1 py-3 text-gray-400 font-bold text-xs"
                            >
                                Depois
                            </button>
                            <button
                                onClick={requestPermission}
                                className="flex-[2] py-4 bg-brand-green text-gray-900 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-brand-green/20"
                            >
                                Ativar Agora
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationManager;
