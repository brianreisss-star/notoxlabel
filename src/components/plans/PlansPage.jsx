import React, { useState } from 'react';
import { Check, Zap, Crown, ShieldCheck, ArrowLeft, CreditCard, Users, HeartPulse, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { createCheckoutSession } from '../../services/stripeService';

const PlansPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isPaying, setIsPaying] = useState(null); // planId or null

    const plans = [
        {
            id: 'credits_50',
            name: 'Pack Créditos',
            price: 'R$ 19,90',
            period: '/único',
            description: 'Recarregue 50 análises para usar quando quiser.',
            features: [
                '50 análises de IA (sem validade)',
                'Histórico vitalício',
                'Sem recorrência (pagamento único)'
            ],
            buttonText: 'Comprar Pack',
            current: false,
            premium: false,
            color: 'bg-gray-50'
        },
        {
            id: 'pro_monthly',
            name: 'NoTox Pro',
            price: 'R$ 29,90',
            period: '/mês',
            description: 'Liberdade total para transformar sua alimentação.',
            features: [
                'Análises Ilimitadas de IA',
                'Acesso ao Chat com Nutri IA',
                'Alertas de riscos em tempo real',
                'Suporte prioritário'
            ],
            buttonText: 'Assinar Mensal',
            current: false,
            premium: true,
            highlight: true,
            color: 'bg-white'
        },
        {
            id: 'pro_annual',
            name: 'Pro Anual',
            price: 'R$ 299,00',
            period: '/ano',
            description: 'Melhor custo-benefício (2 meses grátis).',
            features: [
                'Todos os benefícios Pro',
                'Selo de Apoiador Fundador',
                'Acesso antecipado a novas features',
                'Economia de R$ 60,00'
            ],
            buttonText: 'Assinar Anual',
            current: false,
            premium: true,
            color: 'bg-gray-900',
            dark: true
        }
    ];

    const handleSelectPlan = async (planId) => {
        setIsPaying(planId);
        try {
            const session = await createCheckoutSession(planId, user?.id, user?.email);
            if (session?.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Erro ao iniciar pagamento. Tente novamente.");
        } finally {
            setIsPaying(null);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24 font-sans selection:bg-brand-green/20">
            {/* Minimal Header */}
            <div className="px-6 pt-12 pb-8 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black text-gray-900 tracking-tighter">Planos & Saúde</h1>
                <div className="w-10"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-8 space-y-12"
            >
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2 leading-[0.9] tracking-tighter">Escolha seu nível de liberdade.</h2>
                    <p className="text-gray-400 font-medium italic">Selecione o plano ideal para seus objetivos de bem-estar.</p>
                </div>

                {/* Plans List */}
                <div className="space-y-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${plan.highlight ? 'border-gray-900 shadow-2xl shadow-gray-200' :
                                plan.dark ? 'bg-gray-900 border-gray-900' : 'border-gray-50 bg-gray-50'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 bg-[#FF385C] text-white px-5 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
                                    Mais Popular
                                </div>
                            )}

                            {plan.dark && (
                                <div className="absolute top-0 right-0 bg-yellow-500 text-black px-5 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
                                    Elite
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`text-2xl font-black leading-none mb-2 ${plan.dark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                <p className={`font-medium text-sm leading-relaxed ${plan.dark ? 'text-gray-400' : 'text-gray-400'}`}>{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className={`text-4xl font-black tracking-tighter ${plan.dark ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                                {plan.period && <span className={`font-bold ml-1 ${plan.dark ? 'text-gray-500' : 'text-gray-400'}`}>{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-4">
                                        <div className={`p-1 rounded-full ${plan.dark ? 'bg-yellow-500 text-black' :
                                            plan.highlight ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <span className={`text-sm font-bold ${plan.dark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                disabled={plan.current || isPaying === plan.id}
                                className={`w-full py-5 rounded-[2rem] font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${plan.current ? 'bg-white/5 border-2 border-white/10 text-gray-600' :
                                    plan.dark ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20' :
                                        plan.highlight ? 'bg-gray-900 text-white shadow-xl shadow-gray-300' : 'bg-white border-2 border-gray-900 text-gray-900'
                                    } ${isPaying === plan.id ? 'opacity-70 animate-pulse' : ''}`}
                            >
                                {isPaying === plan.id ? <Loader2 className="animate-spin" size={24} /> : plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Professionals Section */}
                <div className="bg-gray-50 rounded-[3rem] p-10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-white p-3 rounded-2xl text-[#FF385C] shadow-sm">
                            <Users size={24} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900">Especialistas à disposição</h4>
                    </div>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed italic">
                        No plano Elite, você tem acesso direto a nutricionistas e médicos que analisam seu histórico de scans e dão orientações personalizadas.
                    </p>
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Expert" />
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            +12
                        </div>
                    </div>
                </div>

                {/* FAQ / Trust Segment */}
                <div className="text-center py-10 space-y-6">
                    <div className="flex justify-center gap-6 text-gray-200">
                        <ShieldCheck size={32} />
                        <Sparkles size={32} />
                        <HeartPulse size={32} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium px-4">
                        Pagamento 100% seguro via Stripe. <br /> Cancele quando quiser, sem letras miúdas.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PlansPage;
