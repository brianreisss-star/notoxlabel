import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Calendar, Info, Scale, Target, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';

const EvolutionPage = () => {
    const { profile, history } = useUser();
    const navigate = useNavigate();
    const evolution = profile?.evolution || [];

    // Sort evolution entries by date
    const sortedEvolution = [...evolution].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedEvolution[0] || {};
    const previous = sortedEvolution[1] || {};

    const calculateDiff = (key) => {
        if (!latest[key] || !previous[key]) return null;
        const diff = latest[key] - previous[key];
        return diff.toFixed(1);
    };

    const weightDiff = calculateDiff('weight');
    const muscleDiff = calculateDiff('muscle_mass');

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-8 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-all">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Evolução Saudável</h1>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Correlation Hero */}
                <section className="bg-gray-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-500 p-2 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Índice Nutricional</h3>
                        </div>

                        <div className="flex items-end gap-1 mb-2">
                            <span className="text-6xl font-black leading-none">{profile?.clean_habit_score || '0.0'}</span>
                            <span className="text-emerald-500 font-bold mb-2">/10</span>
                        </div>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[200px]">
                            Nota média das suas últimas 10 escolhas. Quanto maior, mais limpo seu organismo.
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </section>

                {/* Biometric Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm"><Scale size={20} className="text-blue-500" /></div>
                            {weightDiff && (
                                <span className={`text-[10px] font-black flex items-center gap-0.5 ${weightDiff < 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {weightDiff < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                                    {Math.abs(weightDiff)}kg
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-black text-gray-900">{latest.weight || '--'} <span className="text-xs font-bold text-gray-400">kg</span></p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peso Atual</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm"><Target size={20} className="text-pink-500" /></div>
                            {muscleDiff && (
                                <span className={`text-[10px] font-black flex items-center gap-0.5 ${muscleDiff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {muscleDiff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(muscleDiff)}%
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-black text-gray-900">{latest.muscle_mass || '--'} <span className="text-xs font-bold text-gray-400">%</span></p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Massa Magra</p>
                    </div>
                </div>

                {/* Evolution History */}
                <section>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Histórico de Medidas</h3>
                    <div className="space-y-3">
                        {sortedEvolution.length > 0 ? sortedEvolution.map((entry, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-50 p-3 rounded-2xl"><Calendar size={18} className="text-gray-400" /></div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Registrado</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-gray-900">{entry.weight}kg</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{entry.body_fat}% BF</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                <Sparkles size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold">Nenhum registro ainda.</p>
                                <p className="text-[10px] text-gray-300 px-10 mt-2 italic">Comece a preencher no seu perfil para ver sua transformação.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <BottomNav />
        </div>
    );
};

export default EvolutionPage;
