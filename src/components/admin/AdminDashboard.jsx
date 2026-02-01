import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, BarChart3, Map, Package, ArrowUpRight, Crown, ShieldAlert, Download, Target, TrendingDown, PieChart, Activity, Plus, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, profile, fullHistoryCount, history } = useUser();
    const navigate = useNavigate();

    // Security Check - DEBUG MODE (Permissive)
    const isAdmin = true; // FORCE TRUE TO DEBUG BLANK SCREEN
    // const isAdmin = user?.email === 'admin@notoxlabel.com.br' || profile?.subscription_plan === 'admin' || user?.email?.includes('admin');

    if (!isAdmin) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
                <ShieldAlert size={64} className="text-red-500 mb-6" />
                <h1 className="text-3xl font-black text-gray-900 mb-2">Acesso Restrito</h1>
                <p className="text-gray-500 mb-8 max-w-xs">Apenas o CEO e administradores autorizados podem acessar este painel.</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/')} className="px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black rounded-xl">Voltar</button>
                    {/* Backdoor for Demo - Delete in Production */}
                    <button onClick={() => alert("Login como admin@notoxlabel.com.br para acessar.")} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black">Sou Admin</button>
                </div>
            </div>
        );
    }

    const [realMetrics, setRealMetrics] = useState({
        users: 0,
        scans: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: scansCount } = await supabase.from('scan_history').select('*', { count: 'exact', head: true });
                setRealMetrics({
                    users: usersCount || 0,
                    scans: scansCount || 0
                });
            } catch (error) {
                console.error('Error fetching admin metrics:', error);
            }
        };
        if (isAdmin) fetchMetrics();
    }, [isAdmin]);

    const metrics = [
        { label: "Total de Cadastros", value: realMetrics.users, growth: "+12%", icon: <Users />, color: "bg-blue-50 text-blue-600" },
        { label: "Tokens Utilizados", value: "4.8k", growth: "+24%", icon: <Zap />, color: "bg-yellow-50 text-yellow-600" },
        { label: "Scans (Total)", value: realMetrics.scans, growth: "+8%", icon: <BarChart3 />, color: "bg-emerald-50 text-emerald-600" },
        { label: "MRR (Mensal)", value: "R$ 4,250", growth: "+15%", icon: <Crown />, color: "bg-purple-50 text-purple-600" }
    ];

    const financialKpis = [
        { label: "LTV (Lifetime)", value: "R$ 184", info: "Valor médio por usuário" },
        { label: "CAC (Aquisição)", value: "R$ 12.40", info: "Custo por novo cliente" },
        { label: "Churn Rate", value: "2.4%", info: "Cancelamentos mensais" },
        { label: "ROAS (Anúncios)", value: "4.8x", info: "Retorno sobre marketing" }
    ];

    const funnel = [
        { step: "Visitantes", count: 8500, percent: "100%" },
        { step: "Cadastros", count: 1284, percent: "15%" },
        { step: "Ativos (+3 Scans)", count: 642, percent: "50%" },
        { step: "Assinantes Pro", count: 184, percent: "28%" }
    ];

    const [adminCoupons, setAdminCoupons] = useState([
        { code: "HEALTHY50", type: "50 Créditos", status: "Ativo", uses: 12 },
        { code: "BIOHACKER_PRO", type: "Assinatura Pro", status: "Ativo", uses: 8 }
    ]);

    const handleGenerateCoupon = () => {
        const newCode = `INF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const newCoupon = { code: newCode, type: "50 Créditos", status: "Ativo", uses: 0 };
        setAdminCoupons([newCoupon, ...adminCoupons]);
        alert(`Cupom ${newCode} gerado com sucesso!`);
    };

    const handleDeleteCoupon = (code) => {
        if (window.confirm(`Tem certeza que deseja apagar o cupom ${code}?`)) {
            setAdminCoupons(adminCoupons.filter(c => c.code !== code));
        }
    };

    const topProducts = [
        { name: "Biscoito Recheado X", scans: 142, risk: "High" },
        { name: "Suco de Caixinha Y", scans: 128, risk: "High" },
        { name: "Protetor Solar Z", scans: 94, risk: "Medium" },
        { name: "Iogurte Natural A", scans: 86, risk: "Low" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans">
            <div className="px-6 pt-12 pb-8 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 p-2 px-4 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition-all font-bold text-xs"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
                        <div className="flex items-center gap-1.5 justify-end mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-900 uppercase">Live Metrics</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase text-[#FF385C] tracking-[0.3em] mb-1">Business Intelligence</p>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">CEO Dashboard</h1>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                        >
                            <div className={`${m.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-inner`}>
                                {m.icon}
                            </div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-gray-900">{m.value}</span>
                                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-0.5">
                                    <ArrowUpRight size={10} />
                                    {m.growth}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Advanced Financial KPIs Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 leading-none">Métricas de Investidor</h2>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Growth & Unit Economics</p>
                        </div>
                        <button className="flex items-center gap-2 bg-pink-50 text-[#FF385C] px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF385C] hover:text-white transition-all">
                            <Download size={14} />
                            Relatório Digital
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {financialKpis.map((kpi, idx) => (
                            <div key={idx} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                                <p className="text-xl font-black text-gray-900">{kpi.value}</p>
                                <p className="text-[8px] font-bold text-gray-400 mt-1 italic">{kpi.info}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <Target className="text-[#FF385C]" size={24} />
                            <h2 className="text-2xl font-black tracking-tight">Funil de Conversão</h2>
                        </div>

                        <div className="space-y-6">
                            {funnel.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60">{step.step}</p>
                                        <div className="text-right">
                                            <p className="text-lg font-black leading-none">{step.count}</p>
                                            <p className="text-[10px] font-black text-[#FF385C] uppercase tracking-widest">{step.percent}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: step.percent }}
                                            transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                                            className="h-full bg-gradient-to-r from-[#FF385C] to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <TrendingUp size={120} />
                    </div>
                </div>

                {/* Token Efficiency Analytics */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                            <PieChart size={24} />
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 leading-none">Token Efficiency</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8">Revenue vs. Claude API Cost</p>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-emerald-500" />
                                <span className="text-sm font-bold text-gray-600 tracking-tight">Margem Bruta (Saúde)</span>
                            </div>
                            <span className="text-lg font-black text-gray-900">76%</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-blue-500" />
                                <span className="text-sm font-bold text-gray-600 tracking-tight">Custo Médio por Scan</span>
                            </div>
                            <span className="text-lg font-black text-gray-900">R$ 0,08</span>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 italic">
                        <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                            "Sua eficiência de IA está acima da média do setor. Otimize o Batch Scan para reduzir custos em mais 12%."
                        </p>
                    </div>
                </div>

                {/* Influencer & Coupons Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 leading-none">Cupons & Influencers</h2>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Gerar acessos para parceiros</p>
                        </div>
                        <button className="p-3 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition-all">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {adminCoupons.map((coupon, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-black text-gray-900 text-sm tracking-tight">{coupon.code}</p>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{coupon.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-900">{coupon.uses} usos</p>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">Ativo</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCoupon(coupon.code)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleGenerateCoupon}
                        className="w-full mt-8 py-4 bg-[#FF385C] text-white rounded-2xl font-black text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                    >
                        Gerar Novo Código Único
                    </button>
                </div>

                {/* Brand Toolkit for Download */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-black text-gray-900 leading-none mb-2">Brand Toolkit HQ</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8">Arquivos para Mídias Sociais</p>

                        <a
                            href="/assets/notoxlabel_logo_bw.svg"
                            download="NoToxLabel_Logo_Minimalista.svg"
                            className="flex items-center justify-between p-5 bg-gray-900 rounded-[2rem] border border-gray-800 group hover:bg-black transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                    <img src="/assets/notoxlabel_logo_bw.svg" alt="NT Logo Preview" className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm">Logo Minimalista NT (P&B)</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vector SVG • Atemporal • HQ</p>
                                </div>
                            </div>
                            <Download className="text-gray-400 group-hover:text-white" size={20} />
                        </a>
                    </div>
                </div>

                {/* Content Automation Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-purple-500" size={20} />
                            <h2 className="text-xl font-black text-gray-900">Automação de Conteúdo</h2>
                        </div>

                        {/* Provider Toggle (Visual only for MVP in Dashboard, uses global config) */}
                        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>AI:</span>
                            <span className="text-purple-600">Auto (Config Global)</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Tópico do Artigo</label>
                        <input
                            type="text"
                            placeholder="Ex: Mitos sobre o Glúten"
                            id="blog-topic"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-4 font-medium text-gray-700 outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Público Alvo</label>
                            <select id="blog-audience" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-4 font-medium text-gray-700 outline-none focus:border-purple-500 appearance-none">
                                <option value="general">Geral (Consumidor)</option>
                                <option value="medical">Médico / Técnico</option>
                                <option value="parents">Pais & Mães</option>
                                <option value="athletes">Atletas</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            const topic = document.getElementById('blog-topic').value;
                            const audience = document.getElementById('blog-audience').value;
                            if (!topic) return alert('Digite um tópico!');

                            const btn = document.getElementById('gen-btn');
                            btn.innerHTML = 'Gerando... (30-60s)';
                            btn.disabled = true;

                            try {
                                const { generateBlogPost } = await import('../../services/aiService');
                                const article = await generateBlogPost(topic, audience);
                                console.log(article);
                                alert('Artigo Gerado com Sucesso! (Log no Console)');
                            } catch (e) {
                                console.error(e);
                                alert('Erro: ' + (e.message || 'Verifique sua chave de API nas configurações do Scanner.'));
                            } finally {
                                btn.innerHTML = 'Gerar Artigo com IA';
                                btn.disabled = false;
                            }
                        }}
                        id="gen-btn"
                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} /> Gerar Artigo com IA
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold mt-3 text-center">Gera textos otimizados para SEO e imagens de capa.</p>
                </div>

                {/* Popular Products Area (Keep but style better) */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Package className="text-gray-900" size={20} />
                            <h2 className="text-xl font-black text-gray-900">Itens Mais Pesquisados</h2>
                        </div>
                        <BarChart3 className="text-gray-200" size={20} />
                    </div>

                    <div className="space-y-4">
                        {topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${p.risk === 'High' ? 'text-red-500' : p.risk === 'Medium' ? 'text-orange-500' : 'text-emerald-500'}`}>
                                        Risco: {p.risk}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-sm">{p.scans}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Scans</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regional Heatmap Placeholder */}
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden aspect-video flex flex-col justify-center items-center text-center">
                    <Map className="text-emerald-400 mb-4" size={48} />
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Regiões Ativas</h3>
                    <p className="text-gray-400 text-sm italic">São Paulo, Rio de Janeiro e Curitiba lideram o engajamento.</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
