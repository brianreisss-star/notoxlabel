import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, ArrowRight, Loader2, ScanLine, Settings, Info, Plus, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { analyzeLabel, isConfigured, getProvider, setProvider, hashImage, getCachedAnalysis, cacheAnalysis } from '../../services/aiService';
import { setApiKey as setClaudeKey } from '../../services/claudeApi';
import { setOpenAiKey } from '../../services/openaiApi';
import { motion, AnimatePresence } from 'framer-motion';

const ScanPage = () => {
    const { user } = useUser();
    const isAdmin = user?.email === 'admin@notoxlabel.com.br';
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingText, setLoadingText] = useState('Enviando imagem...');
    const [showApiModal, setShowApiModal] = useState(false);

    // Config State
    const [selectedProvider, setSelectedProvider] = useState(getProvider());
    const [claudeKey, setClaudeKeyInput] = useState('');
    const [openAiKey, setOpenAiKeyInput] = useState('');

    const navigate = useNavigate();
    const { credits, deductCredit, addScanToHistory } = useUser();

    // ... (handleFileChange, triggerCamera kept same)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isBatchMode) {
                    setPreviews(prev => [...prev, reader.result]);
                    setPreview(reader.result);
                } else {
                    setPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerCamera = () => {
        fileInputRef.current?.click();
    };


    const saveConfig = () => {
        if (claudeKey.trim()) setClaudeKey(claudeKey.trim());
        if (openAiKey.trim()) setOpenAiKey(openAiKey.trim());

        setProvider(selectedProvider);
        setShowApiModal(false);
        alert(`Configuração Salva! Usando: ${selectedProvider === 'claude' ? 'Claude 3.5' : 'GPT-4o'}`);
    };

    const getMockResult = () => {
        // ... (kept same)
        const mockScenarios = [
            {
                product_name: "Biscoito Recheado",
                category: "alimento",
                overall_score: 3,
                risk_level: "high",
                image: preview,
                ingredients: [
                    { name: "Açúcar", technical_name: "Sacarose", risk_score: 2, description: "Altamente inflamatório.", health_impact: "Pico de insulina." },
                    { name: "Gordura Hidrogenada", technical_name: "Trans", risk_score: 1, description: "Extremamente prejudicial.", health_impact: "Risco cardíaco." }
                ],
                personalized_alerts: ["Excesso de Açúcar", "Gordura Trans Detectada"],
                alternatives: ["Fruta Fresca", "Biscoito de Arroz"],
                summary: "Ultraprocessado com baixo valor nutricional."
            }
        ];
        return mockScenarios[0];
    };

    const analyzeImage = async () => {
        try {
            if (credits <= 0) {
                alert("Créditos insuficientes.");
                return;
            }

            setIsAnalyzing(true);
            await deductCredit();

            let result;
            const useRealApi = isConfigured();
            const analysisData = isBatchMode ? previews : preview;

            if (useRealApi) {
                const imageHash = await hashImage(Array.isArray(analysisData) ? analysisData[0] : analysisData);
                const cached = getCachedAnalysis(imageHash);

                if (cached && !isBatchMode) {
                    result = { ...cached, image: preview };
                } else {
                    const providerName = getProvider() === 'claude' ? 'NoTox IA 1.7' : 'GPT-4o';
                    setLoadingText(isBatchMode ? `Analisando ${previews.length} rótulos com ${providerName}...` : `Analisando com ${providerName}...`);

                    result = await analyzeLabel(analysisData);
                    result.image = preview;

                    if (!isBatchMode) cacheAnalysis(imageHash, result);
                }
            } else {
                setLoadingText("Simulando análise...");
                await new Promise(r => setTimeout(r, 2000));
                result = getMockResult();
            }

            await addScanToHistory(result);
            navigate('/results', { state: { result } });
            navigate('/results', { state: { result } });
        } catch (error) {
            console.error(error);
            const errorMsg = error.message === 'API_KEY_MISSING'
                ? 'Configure sua chave de API nas configurações (ícone de engrenagem).'
                : `Erro na API: ${error.message}`;
            alert(errorMsg);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative font-sans">
            {/* API Key Modal */}
            <AnimatePresence>
                {showApiModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative"
                        >
                            <button onClick={() => setShowApiModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Configurar NoTox Brain</h3>
                            <p className="text-gray-400 font-medium mb-6 text-sm">Painel Administrativo do Sistema Neural.</p>

                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setSelectedProvider('claude')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedProvider === 'claude' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'}`}
                                >
                                    NoTox v1.7 (Stable)
                                </button>
                                <button
                                    onClick={() => setSelectedProvider('openai')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedProvider === 'openai' ? 'bg-white shadow-md text-emerald-600' : 'text-gray-400'}`}
                                >
                                    GPT-4o
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Anthropic Key (Claude)</label>
                                    <input
                                        type="password"
                                        value={claudeKey}
                                        onChange={(e) => setClaudeKeyInput(e.target.value)}
                                        placeholder="sk-ant-..."
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:bg-white focus:border-gray-900 outline-none transition-all font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">OpenAI Key (GPT-4)</label>
                                    <input
                                        type="password"
                                        value={openAiKey}
                                        onChange={(e) => setOpenAiKeyInput(e.target.value)}
                                        placeholder="sk-..."
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:bg-white focus:border-emerald-500 outline-none transition-all font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <button onClick={saveConfig} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
                                Salvar e Ativar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden Input */}
            <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

            {!preview ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-center p-8 w-full max-w-sm"
                >
                    <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10">
                        <ScanLine size={48} className="text-[#FF385C]" />
                    </div>

                    <h2 className="text-5xl font-black leading-none tracking-tighter mb-4">A verdade no rótulo em segundos.</h2>
                    <p className="text-gray-400 text-lg font-medium mb-12 italic leading-relaxed">
                        Aponte para os ingredientes e nossa IA cuida do resto.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={triggerCamera}
                            className="w-full bg-white text-gray-900 h-20 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95"
                        >
                            <Camera size={28} />
                            {isBatchMode ? 'Adicionar Foto' : 'Tirar Foto'}
                        </button>

                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-6 overflow-hidden">
                            <button
                                onClick={() => setIsBatchMode(false)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${!isBatchMode ? 'bg-white text-gray-900 shadow-lg' : 'text-white/40'}`}
                            >
                                Único Scan
                            </button>
                            <button
                                onClick={() => setIsBatchMode(true)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${isBatchMode ? 'bg-white text-gray-900 shadow-lg' : 'text-white/40'}`}
                            >
                                Analisar Vários
                            </button>
                        </div>

                        {isBatchMode && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-xs font-medium text-emerald-400 mt-2 bg-emerald-500/10 py-2 px-4 rounded-xl border border-emerald-500/20"
                            >
                                Perfeito para analisar todas as compras do mês de uma vez só! 🛍️
                            </motion.p>
                        )}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-3 py-3 px-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit mx-auto">
                        <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            {isConfigured() ? 'NoTox IA 1.7 Conectada' : 'Modo Demonstração (Ativo)'}
                        </span>
                    </div>
                </motion.div>
            ) : (
                <div className="relative w-full h-full bg-black flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/40">
                        {isBatchMode && previews.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-6 w-full px-2 scrollbar-hide">
                                {previews.map((img, i) => (
                                    <div key={i} className="relative shrink-0">
                                        <img src={img} alt="preview" className="w-24 h-32 object-cover rounded-2xl border-2 border-white/20" />
                                        <button onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-[#FF385C] text-white p-1 rounded-full shadow-lg">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={triggerCamera} className="w-24 h-32 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                    <Plus size={24} />
                                </button>
                            </div>
                        )}
                        <img src={preview} alt="Preview" className={`max-w-full max-h-[60vh] object-contain rounded-[2rem] shadow-2xl transition-all ${isBatchMode ? 'mt-4 border-4 border-white/10' : ''}`} />
                    </div>

                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-[200] text-white">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="mb-8"
                            >
                                <Loader2 size={64} strokeWidth={3} className="text-[#FF385C]" />
                            </motion.div>
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Analisando</h3>
                            <p className="text-[#FF385C] font-black uppercase tracking-[0.2em] text-[10px]">{loadingText}</p>
                        </div>
                    )}

                    {!isAnalyzing && (
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            className="p-10 bg-white rounded-t-[3rem] shadow-2xl space-y-8"
                        >
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">Ficou nítido?</h3>
                                <p className="text-gray-400 font-medium">Os ingredientes precisam aparecer claramente.</p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setPreview(null)} className="flex-1 py-5 rounded-3xl border-2 border-gray-100 text-gray-400 font-black text-lg active:scale-95 transition-all">
                                    Refazer
                                </button>
                                <button
                                    onClick={analyzeImage}
                                    className="flex-[2] py-5 rounded-3xl bg-gray-900 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                                >
                                    Analisar
                                    <ArrowRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Floating Controls */}
            <div className="absolute top-8 left-8 z-[60]">
                <button onClick={() => navigate('/')} className="bg-white/10 border border-white/10 text-white p-3 rounded-2xl backdrop-blur-xl active:scale-90 transition-all">
                    <X size={24} strokeWidth={3} />
                </button>
            </div>
            {isAdmin && (
                <div className="absolute top-8 right-8 z-[60]">
                    <button onClick={() => setShowApiModal(true)} className="bg-white/10 border border-white/10 text-white p-3 rounded-2xl backdrop-blur-xl active:scale-90 transition-all">
                        <Settings size={22} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScanPage;
