import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, ScanLine, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const steps = [
    { id: 'welcome', title: 'A verdade está no rótulo.', description: 'O NoToxLabel ajuda você a entender exatamente o que você consome no seu dia a dia.' },
    { id: 'name', title: 'Como podemos te chamar?', description: 'Queremos tornar sua jornada mais pessoal.' },
    { id: 'goals', title: 'Sua meta principal é...', description: 'Selecione seus objetivos de saúde.' },
    { id: 'professional', title: 'Você é um profissional?', description: 'Profissionais de saúde podem ganhar selos de autoridade.' },
    { id: 'finish', title: 'Tudo pronto!', description: 'Sua conta foi configurada com sucesso.' }
];

const goalsOptions = [
    "🍎 Longevidade", "⚖️ Emagrecer", "💪 Hipertrofia", "⚡ Energia",
    "✨ Estética", "🧘 Saúde Mental", "🛡️ Prevenção", "🏃 Performance"
];

const conditionsOptions = [
    "Diabetes", "Hipertensão", "Colesterol", "Glúten",
    "Lactose", "Vegano", "Vegetariano", "Nenhum"
];

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { profile, updateUser, addXp } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        goals: profile?.goals || [],
        is_professional: profile?.is_professional || false,
        professional_specialty: profile?.professional_specialty || '',
        professional_number: profile?.professional_number || ''
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            finishOnboarding();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const finishOnboarding = () => {
        updateUser({ ...formData, onboardingCompleted: true });
        addXp(100);
        navigate('/');
    };

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
            {/* Header / Nav */}
            <div className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-50">
                <button
                    onClick={handleBack}
                    className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-all"
                >
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <div className="flex gap-1.5">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-100'
                                }`}
                        />
                    ))}
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="flex-1 flex flex-col px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col pt-4"
                    >
                        <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tighter">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 italic">
                            {steps[currentStep].description}
                        </p>

                        <div className="flex-1">
                            {/* Step Content */}
                            {steps[currentStep].id === 'welcome' && (
                                <div className="aspect-square bg-gray-50 rounded-[3rem] flex flex-col items-center justify-center mb-12 shadow-inner text-[#FF385C]">
                                    <ScanLine size={120} strokeWidth={3} />
                                    <p className="mt-6 text-sm font-black uppercase tracking-widest text-gray-300">Escaneie & Descubra</p>
                                </div>
                            )}

                            {steps[currentStep].id === 'name' && (
                                <input
                                    type="text"
                                    placeholder="Meu nome é..."
                                    className="w-full text-3xl font-black bg-white border-b-4 border-gray-100 py-4 focus:border-gray-900 outline-none transition-all placeholder:text-gray-100"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    autoFocus
                                />
                            )}

                            {steps[currentStep].id === 'goals' && (
                                <div className="grid grid-cols-1 gap-3 w-full pb-10">
                                    {goalsOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => toggleSelection('goals', option)}
                                            className={`flex justify-between items-center p-6 rounded-3xl border-2 transition-all duration-300 ${formData.goals.includes(option)
                                                ? 'bg-gray-900 border-gray-900 text-white scale-[1.02]'
                                                : 'border-gray-100 text-gray-800 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="text-lg font-black tracking-tight">{option}</span>
                                            {formData.goals.includes(option) && (
                                                <ChevronRight size={20} className="opacity-50" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {steps[currentStep].id === 'professional' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: false, label: "Cidadão Consciente", icon: "🌱" },
                                            { id: true, label: "Profissional da Saúde", icon: "🩺" }
                                        ].map(opt => (
                                            <button
                                                key={opt.label}
                                                onClick={() => setFormData({ ...formData, is_professional: opt.id })}
                                                className={`flex justify-between items-center p-6 rounded-3xl border-2 transition-all duration-300 ${formData.is_professional === opt.id
                                                    ? 'bg-gray-900 border-gray-900 text-white'
                                                    : 'border-gray-100 text-gray-800 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl">{opt.icon}</span>
                                                    <span className="text-lg font-black tracking-tight">{opt.label}</span>
                                                </div>
                                                {formData.is_professional === opt.id && <Check size={20} className="text-white" />}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {formData.is_professional && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 pt-4 overflow-hidden"
                                            >
                                                <div className="flex gap-3">
                                                    <select
                                                        className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none appearance-none"
                                                        value={formData.professional_specialty}
                                                        onChange={(e) => setFormData({ ...formData, professional_specialty: e.target.value })}
                                                    >
                                                        <option value="">Conselho</option>
                                                        <option value="CRM">CRM</option>
                                                        <option value="CRN">CRN</option>
                                                        <option value="CRO">CRO</option>
                                                        <option value="CREFITO">CREFITO</option>
                                                        <option value="Outro">Outro</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="Nº Profissional"
                                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-gray-900 outline-none transition-all"
                                                        value={formData.professional_number}
                                                        onChange={(e) => setFormData({ ...formData, professional_number: e.target.value })}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {steps[currentStep].id === 'finish' && (
                                <div className="bg-emerald-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
                                    <div className="relative z-10 text-center">
                                        <div className="text-7xl mb-6">✨</div>
                                        <h3 className="text-3xl font-black mb-4">Você está pronto.</h3>
                                        <p className="text-emerald-100 font-bold mb-8">
                                            Adicionamos <span className="text-white">+3 créditos</span> extras para você começar agora mesmo.
                                        </p>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticky Actions */}
            <div className="p-6 pb-12 bg-white/80 backdrop-blur-md">
                <button
                    onClick={handleNext}
                    disabled={
                        (steps[currentStep].id === 'name' && !formData.name) ||
                        (steps[currentStep].id === 'professional' && formData.is_professional && (!formData.professional_specialty || !formData.professional_number))
                    }
                    className="w-full bg-gray-900 py-5 rounded-[2.5rem] font-black text-xl text-white shadow-2xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                >
                    {currentStep === steps.length - 1 ? 'Começar Jornada' : 'Continuar'}
                    {currentStep < steps.length - 1 && <ChevronRight size={24} strokeWidth={3} />}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
