import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, Target, BarChart3, Users, Star, Check, Instagram, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "NoTox IA 1.7",
            desc: "Análise profunda de ingredientes em milissegundos usando nossa rede neural exclusiva.",
            icon: <Zap className="text-emerald-500" />
        },
        {
            title: "Analisar Vários",
            desc: "Analise múltiplos produtos ou partes de um rótulo de uma só vez.",
            icon: <Target className="text-[#FF385C]" />
        },
        {
            title: "Acervo Pro",
            desc: "Histórico ilimitado e ferramentas para profissionais de saúde.",
            icon: <BarChart3 className="text-blue-500" />
        }
    ];

    const testimonials = [
        { name: "Dra. Ana Silva", role: "Nutricionista", text: "O NoToxLabel mudou a forma como meus pacientes entendem o que compram. Essencial.", scans: "428" },
        { name: "Marcos Lima", role: "Atleta", text: "Finalmente sei o que tem no meu Pré-Treino. Sem segredos.", scans: "156" }
    ];

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden text-gray-900">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-3xl sm:px-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">NT</div>
                    <span className="text-lg font-black tracking-tighter">NoToxLabel</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/auth" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors hidden sm:block">Entrar</Link>
                    <button
                        onClick={() => navigate('/auth?mode=signup')}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all"
                    >
                        Começar Agora
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 sm:px-12 lg:pt-48 lg:pb-32 max-w-7xl mx-auto">
                <div className="lg:flex items-center gap-16">
                    <div className="lg:w-1/2 mb-20 lg:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                A Verdade sem Filtros
                            </span>
                            <h1 className="text-6xl sm:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 relative z-10">
                                Descubra o que você <span className="text-[#FF385C]">realmente</span> usa.
                            </h1>
                            <div className="absolute -z-10 top-0 left-0 w-full h-[600px] opacity-[0.03] pointer-events-none overflow-hidden blur-3xl">
                                <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-600 rounded-full"></div>
                                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-yellow-600 rounded-full"></div>
                                <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-black rounded-full"></div>
                            </div>
                            <p className="text-xl text-gray-500 font-medium mb-12 max-w-md leading-relaxed">
                                Use inteligência artificial de ponta para analisar rótulos em segundos. Teste o impacto de alimentos e cosméticos na sua saúde.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/auth?mode=signup')}
                                    className="bg-gray-900 text-white px-10 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-gray-400/30 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Teste Grátis Agora
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative z-10"
                        >
                            {/* Hero Image Mockup */}
                            <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white">
                                <img
                                    src="/assets/hero_mockup.png"
                                    alt="NoToxLabel App Preview"
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>
                        {/* Background Decor */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FF385C]/5 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50/50 border-y border-gray-100 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-[#FF385C]/30 transition-all"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter leading-none">Aprovado por Especialistas.</h2>
                    <p className="text-gray-400 font-medium">Junte-se a milhares de pessoas que buscam a verdade.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 flex flex-col justify-between">
                            <p className="text-xl text-gray-700 font-medium leading-[1.6] italic mb-8">"{t.text}"</p>
                            <div className="flex items-center justify-between border-t border-gray-50 pt-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">{t.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">{t.role}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    🎯 {t.scans} Scans
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Massive CTA Section */}
            <section className="py-32 px-6 sm:px-12 bg-gray-900 border-y border-white/5 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl sm:text-7xl font-black text-white mb-8 tracking-tighter leading-none">Pronto para revelar o invisível?</h2>
                        <p className="text-gray-400 text-xl font-medium mb-12 max-w-sm mx-auto">Sua saúde não deveria ter segredos. Comece agora.</p>
                        <button
                            onClick={() => navigate('/auth?mode=signup')}
                            className="bg-white text-gray-900 px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-[#FF385C] hover:text-white transition-all active:scale-95"
                        >
                            Teste Grátis Agora
                        </button>
                    </motion.div>
                </div>
                {/* Visual Glows */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF385C]/20 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[150px]"></div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-gray-50">
                <div className="flex flex-col md:flex-row justify-between gap-12">
                    <div className="max-w-xs">
                        <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs">NT</div>
                        <span className="text-lg font-black tracking-tighter">NoToxLabel</span>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Potencializando a transparência nutricional através da Inteligência Artificial.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-6">Produto</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li><Link to="/plans" className="hover:text-gray-900 transition-colors">Planos Pro</Link></li>
                                <li><Link to="/security" className="hover:text-gray-900 transition-colors">Segurança</Link></li>
                                <li><Link to="/legal" className="hover:text-gray-900 transition-colors">Jurídico</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-6">Social</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                    <a href="https://instagram.com/notoxlabel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Instagram size={14} /> Instagram
                                    </a>
                                </li>
                                <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                    <ArrowUpRight size={14} /> Twitter
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2026 NoToxLabel. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <Link to="/legal" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-900">Privacidade</Link>
                        <Link to="/legal" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-900">Termos</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
