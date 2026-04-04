'use client';

import React, { use } from 'react';
import { motion } from 'framer-motion';
import { Shell } from '../../../../components/Shell';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, ShieldAlert, FileText, Users, Eye, Target, Scale, CheckCircle2, AlertTriangle, XCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATIC_ANALYSIS_DATA = [
    { subject: 'Timeline', score: 8, icon: Target, description: 'Events are well chronologized' },
    { subject: 'Evidence', score: 6, icon: FileText, description: 'Some physical evidence gaps exist' },
    { subject: 'Witness', score: 3, icon: Eye, description: 'Lacking corroborating testimony' },
    { subject: 'People', score: 9, icon: Users, description: 'All individuals properly identified' },
    { subject: 'Clarity', score: 7, icon: Brain, description: 'Narrative is mostly coherent' },
    { subject: 'Details', score: 8, icon: FileText, description: 'High level of descriptive detail' },
    { subject: 'Legal Strength', score: 5, icon: Scale, description: 'Case requires more solid foundation' }
];

const SUGGESTIONS = [
    { text: "Witness consistency is extremely poor. Strongly recommend identifying external corroborating witness accounts immediately.", type: 'critical' },
    { text: "Legal strength is currently moderate. Consider gathering more definitive documentation and precedents.", type: 'warning' },
    { text: "Evidence chain is somewhat weak indicating gaps in evidence handling. Verify evidence origins and chain of custody.", type: 'warning' },
    { text: "Timeline and People identification are robust. Maintain these elements unchanged.", type: 'success' },
];

const getColorClass = (score, isBg = false) => {
    if (score <= 4) return isBg ? 'bg-rose-500' : 'text-rose-500';
    if (score <= 7) return isBg ? 'bg-amber-500' : 'text-amber-500';
    return isBg ? 'bg-emerald-500' : 'text-emerald-500';
};

const getStatusIcon = (score) => {
    if (score <= 4) return <XCircle className="w-5 h-5 text-rose-500" />;
    if (score <= 7) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
};

export default function AnalysisPage({ params }) {
    const { slug } = use(params);
    const router = useRouter();

    const overallScore = (STATIC_ANALYSIS_DATA.reduce((acc, curr) => acc + curr.score, 0) / STATIC_ANALYSIS_DATA.length).toFixed(1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    const headerActions = (
        <motion.button
            onClick={() => router.push(`/document/${slug}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-500 shadow-lg bg-slate-800 text-white hover:bg-slate-700"
        >
            <ArrowLeft className="h-4 w-4" />
            Back to Document
        </motion.button>
    );

    return (
        <Shell headerActions={headerActions}>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

            <main className="h-full overflow-y-auto pt-32 px-8 pb-12 custom-scrollbar">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 mb-4">
                            <Brain className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                            Legal Context Analysis
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
                            AI-driven assessment and statistical breakdown of the document's legal merits, structural integrity, and credibility scores.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Overall Score & Chart */}
                        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
                            
                            {/* Score Card */}
                            <div className="relative overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <ShieldAlert className="w-32 h-32" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">Overall Score</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-8xl font-black tracking-tighter ${getColorClass(overallScore)} drop-shadow-sm`}>
                                        {overallScore}
                                    </span>
                                    <span className="text-3xl font-bold text-slate-400">/ 10</span>
                                </div>
                                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium uppercase tracking-wider">
                                    {overallScore >= 8 ? 'Exceptional Quality' : overallScore >= 5 ? 'Needs Improvement' : 'Critical Weaknesses'}
                                </div>
                            </div>

                            {/* Radar Chart Card */}
                            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 flex flex-col">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6 text-center">Score Vector Graph</h3>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={STATIC_ANALYSIS_DATA}>
                                            <PolarGrid stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeOpacity={0.5} />
                                            <PolarAngleAxis 
                                                dataKey="subject" 
                                                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }} 
                                                className="text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono"
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                            />
                                            <Radar 
                                                name="Score" 
                                                dataKey="score" 
                                                stroke="#6366f1" 
                                                strokeWidth={3} 
                                                fill="#6366f1" 
                                                fillOpacity={0.3} 
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </motion.div>

                        {/* Right Column - Breakdown & Suggestions */}
                        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8 flex flex-col">
                            
                            {/* Detailed Breakdown List */}
                            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 flex-1">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white flex items-center gap-2">
                                        <Target className="w-5 h-5 text-indigo-500" />
                                        Metrics Breakdown
                                    </h3>
                                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> 0-4</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 5-7</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 8-10</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {STATIC_ANALYSIS_DATA.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.div 
                                                key={idx}
                                                whileHover={{ scale: 1.01, x: 5 }}
                                                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-transparent hover:border-indigo-500/30 transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/10 ${getColorClass(item.score)}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-bold uppercase tracking-wider text-sm text-slate-800 dark:text-slate-200">{item.subject}</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.description}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress Bar Area */}
                                                <div className="flex-1 flex items-center gap-4 mt-2 sm:mt-0">
                                                    <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(item.score / 10) * 100}%` }}
                                                            transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                                                            className={`h-full rounded-full ${getColorClass(item.score, true)} shadow-[0_0_10px_currentColor]`}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 min-w-[60px] justify-end">
                                                        <span className={`font-black text-lg ${getColorClass(item.score)}`}>{item.score}</span>
                                                        {getStatusIcon(item.score)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* AI Suggestions List */}
                            <div className="bg-white/40 dark:bg-indigo-900/10 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] shadow-2xl p-8 shrink-0 relative overflow-hidden">
                                {/* Decor flair */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
                                
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                                    <Brain className="w-5 h-5 text-indigo-500" />
                                    AI Prescriptions
                                </h3>
                                
                                <div className="space-y-3 relative z-10">
                                    {SUGGESTIONS.map((sug, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + idx * 0.1 }}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20 dark:border-white/5"
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {sug.type === 'critical' ? <XCircle className="w-5 h-5 text-rose-500" /> :
                                                 sug.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                                                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {sug.text}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </Shell>
    );
}