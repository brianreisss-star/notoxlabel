import React from 'react';
import { ArrowLeft, Shield, FileText, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LegalPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
            <div className="px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center gap-4 z-50">
                <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black tracking-tight">Termos & Privacidade</h1>
            </div>

            <div className="p-8 max-w-2xl mx-auto space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-emerald-500" size={24} />
                        <h2 className="text-2xl font-black">Termos de Uso</h2>
                    </div>
                    <div className="prose prose-gray text-sm text-gray-600 space-y-4">
                        <p>Bem-vindo ao NoToxLabel. Ao utilizar nossos serviços, você concorda com os seguintes termos:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>O uso do Scanner é informativo e não substitui aconselhamento médico profissional.</li>
                            <li>Os créditos são pessoais e intransferíveis.</li>
                            <li>É proibido o uso automatizado de nossa API sem autorização (scraping).</li>
                            <li>Respeitamos a propriedade intelectual e as marcas dos produtos analisados.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-blue-500" size={24} />
                        <h2 className="text-2xl font-black">Política de Privacidade (LGPD)</h2>
                    </div>
                    <div className="prose prose-gray text-sm text-gray-600 space-y-4">
                        <p>Sua privacidade é nossa prioridade. Em conformidade com a LGPD (Lei Geral de Proteção de Dados):</p>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">Seus Direitos</h3>
                            <ul className="list-disc pl-5 space-y-1 text-blue-800">
                                <li><strong>Acesso:</strong> Você pode ver todos os dados que temos sobre você.</li>
                                <li><strong>Portabilidade:</strong> Você pode exportar seu histórico de saúde.</li>
                                <li><strong>Exclusão:</strong> Você pode deletar sua conta permanentemente.</li>
                            </ul>
                        </div>
                        <p>Coletamos apenas o necessário para fornecer análises personalizadas e melhorar sua saúde.</p>
                    </div>
                </section>

                <div className="p-6 bg-gray-50 rounded-[2rem] text-center">
                    <p className="text-xs text-gray-400 font-medium">Última atualização: Janeiro 2026</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Contato Jurídico: legal@notoxlabel.com.br</p>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
