import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Gift, Copy, Share2, Check, ArrowLeft, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';
import { motion } from 'framer-motion';

const ReferralPage = () => {
    const { referralCode, setCustomReferralCode, addCredits, profile, redeemInvite } = useUser();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [referralInput, setReferralInput] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // { text, type: 'success' | 'error' }

    const inviteLink = `${window.location.origin}/auth?ref=${referralCode || 'CONVITE'}`;

    const handleCopy = () => {
        if (!referralCode) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveCustomCode = async () => {
        if (customCode.length < 4) {
            setMessage({ text: 'Código deve ter pelo menos 4 caracteres', type: 'error' });
            return;
        }
        try {
            await setCustomReferralCode(customCode.toUpperCase());
            setMessage({ text: 'Código personalizado ativado!', type: 'success' });
            setIsEditing(false);
        } catch (err) {
            setMessage({ text: err.message === 'CÓDIGO_JÁ_EXISTE' ? 'Este código já está em uso' : 'Erro ao salvar código', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const applyReferral = async () => {
        if (referralInput.trim().length < 4) return;

        try {
            await redeemInvite(referralInput.trim());
            setMessage({ text: 'Parabéns! Você ganhou +2 créditos.', type: 'success' });
            setReferralInput('');
        } catch (error) {
            let msg = 'Erro ao ativar código.';
            if (error.message === 'CONVITE_JA_USADO') msg = 'Você já ativou um convite antes.';
            if (error.message === 'CODIGO_INVALIDO') msg = 'Código não encontrado.';
            if (error.message === 'AUTO_INDICACAO_PROIBIDA') msg = 'Não pode usar próprio código.';
            if (error.message === 'CUPOM_INVALIDO') msg = 'Cupom inválido.';
            setMessage({ text: msg, type: 'error' });
        }

        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'NoToxLabel',
            text: 'Descubra a verdade sobre o que você consome! Use meu código para ganhar créditos.',
            url: inviteLink
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback for desktop or unsupported browsers
                handleCopy();
                alert('Link copiado! (Seu navegador não suporta compartilhamento nativo)');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            handleCopy(); // Fallback on error
        }
    };

    return (
        <div className="pb-32 min-h-screen bg-white text-gray-900 font-sans">
            {/* Airbnb Style Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-100">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <h1 className="text-lg font-black tracking-tight">Indique e Ganhe</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 pt-8"
            >
                {/* Hero section */}
                <div className="mb-12 text-center max-w-xs mx-auto">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Gift size={40} />
                    </div>
                    <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tight">Sua voz tem poder.</h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                        Ganhe <span className="text-gray-900 font-black">+2 créditos</span> por cada amigo que começar a usar o NoToxLabel.
                    </p>
                </div>

                {/* Referral Code Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 mb-8 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 text-center">Seu código exclusivo</p>

                    {isEditing ? (
                        <div className="space-y-4 mb-6">
                            <input
                                type="text"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                                placeholder="EX: PESSOA1"
                                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-center text-xl font-black tracking-widest focus:border-gray-900 outline-none transition-all"
                            />
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 font-bold text-gray-400">Cancelar</button>
                                <button onClick={handleSaveCustomCode} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-black">Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 mb-8">
                            <span className="text-5xl font-black tracking-[0.1em] text-gray-900 font-mono">{referralCode || 'CRIANDO...'}</span>
                            <button onClick={() => { setIsEditing(true); setCustomCode(referralCode); }} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                                Personalizar Código
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between gap-4 overflow-hidden">
                            <p className="text-gray-400 text-[10px] font-medium truncate flex-1">{inviteLink}</p>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 p-3 rounded-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'} transition-all active:scale-95`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                        <button
                            onClick={handleShare}
                            className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                        >
                            <Share2 size={24} />
                            Enviar Convite
                        </button>
                    </div>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl mb-8 text-center font-black text-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Redeem Section */}
                <div className="space-y-4 mb-12">
                    <h3 className="text-lg font-black text-gray-900 px-2 tracking-tight">Recebeu um convite?</h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                            placeholder="DIGITE O CÓDIGO"
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest focus:bg-white focus:border-gray-900 outline-none transition-all placeholder:text-gray-300"
                        />
                        <button
                            onClick={applyReferral}
                            className="bg-gray-900 text-white px-8 rounded-2xl font-black hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                        >
                            Ativar
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center shadow-sm">
                        <div className="text-gray-200 mb-2">
                            <Users size={20} className="mx-auto" />
                        </div>
                        <div className="text-2xl font-black">{profile?.referral_count || 0}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Indicados</div>
                    </div>
                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center shadow-sm">
                        <div className="text-gray-200 mb-2">
                            <Zap size={20} className="mx-auto" />
                        </div>
                        <div className="text-2xl font-black">{(profile?.referral_count || 0) * 2}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ganhos</div>
                    </div>
                </div>
            </motion.div>

            <BottomNav />
        </div>
    );
};

export default ReferralPage;
