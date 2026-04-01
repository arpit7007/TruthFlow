'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, FileText, Shield, Clock, User, 
    MapPin, Paperclip, AlertTriangle, Calendar, 
    Hash, CheckCircle2, ChevronRight 
} from 'lucide-react';

const clean = (value) => {
    if (!value || value === "null" || value === "None") return null;
    return value;
};

const Badge = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        primary: 'bg-primary/10 text-primary',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
            {children}
        </span>
    );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                {title}
            </h3>
            {subtitle && <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
    </div>
);

export const ReportModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-white/10"
                >
                    {/* Top Status Bar */}
                    <div className="h-1 bg-gradient-to-r from-primary via-indigo-500 to-primary/50" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-10 py-8 border-b dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-50" />
                                <div className="relative p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                                    <Shield className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                        Intelligence Report
                                    </h2>
                                    <Badge variant="danger">Confidential</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Hash className="h-3.5 w-3.5 opacity-50" />
                                        REF: TF-2026-X892
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                                        ISSUED: {today}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl transition-all"
                            >
                                <Download className="h-4 w-4" />
                                Export PDF
                            </motion.button>
                            <button 
                                onClick={onClose} 
                                className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors"
                            >
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-4xl mx-auto px-10 py-12 space-y-16">
                            
                            {/* Executive Summary */}
                            <section className="relative">
                                <div className="absolute -left-10 top-0 bottom-0 w-1 bg-primary rounded-full opacity-20" />
                                <SectionHeader icon={FileText} title="Executive Summary" subtitle="Incident Overview & Key Findings" />
                                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Shield className="h-32 w-32" />
                                    </div>
                                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                        {clean(data.summary) || "Information pending further investigation."}
                                    </p>
                                </div>
                            </section>

                            {/* Timeline of Events */}
                            <section>
                                <SectionHeader icon={Clock} title="Event Timeline" subtitle="Chronological Reconstruction" />
                                <div className="relative ml-4 space-y-0">
                                    {/* Vertical Line */}
                                    <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200 dark:bg-white/10" />
                                    
                                    {data.timeline?.map((event, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-10 pb-12 last:pb-0"
                                        >
                                            {/* Dot */}
                                            <div className="absolute left-[-5px] top-2 h-[11px] w-[11px] rounded-full border-2 border-primary bg-white dark:bg-slate-900 z-10 shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]" />
                                            
                                            <div className="group">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {event.event}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <Clock className="h-3 w-3" />
                                                            {clean(event.time) || "Time Unknown"}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <MapPin className="h-3 w-3" />
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 max-w-2xl">
                                                    {event.description}
                                                </p>

                                                <div className="flex flex-wrap gap-6 text-xs">
                                                    {event.people?.length > 0 && (
                                                        <div className="flex items-center gap-2 text-slate-500">
                                                            <User className="h-4 w-4 opacity-50" />
                                                            <span className="font-semibold uppercase tracking-wider text-[10px]">Identified:</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {event.people.map((p, i) => (
                                                                    <span key={i} className="text-slate-900 dark:text-white font-medium">{p}{i < event.people.length - 1 ? ',' : ''}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {event.evidence?.length > 0 && (
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Paperclip className="h-4 w-4" />
                                                            <span className="font-semibold uppercase tracking-wider text-[10px]">Evidence Attached:</span>
                                                            <div className="flex gap-2">
                                                                {event.evidence.map((file, i) => (
                                                                    <Badge key={i} variant="primary">{file}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Entities Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* People Involved */}
                                <section>
                                    <SectionHeader icon={User} title="Identified Entities" subtitle="Persons of Interest & Witnesses" />
                                    <div className="space-y-3">
                                        {data.people?.map((person, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                                        <User className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{person.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">
                                                            {clean(person.role) || "Role Undefined"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* <ChevronRight className="h-4 w-4 text-slate-300" /> */}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Locations */}
                                <section>
                                    <SectionHeader icon={MapPin} title="Geospatial Points" subtitle="Areas of Significance" />
                                    <div className="space-y-3">
                                        {data.locations?.map((loc, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                                        <MapPin className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{loc.location || loc.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">
                                                            {loc.relevant_event || "General Site"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data.locations || data.locations.length === 0) && (
                                            <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                                                <p className="text-xs text-slate-400 uppercase tracking-widest">No primary locations documented</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Evidence Summary */}
                            <section>
                                <SectionHeader icon={Paperclip} title="Chain of Evidence" subtitle="Verified Digital Artifacts" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.evidence?.map((e, i) => (
                                        <div key={i} className="group relative flex items-center gap-4 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                                            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white truncate">{e.file_name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Linked to: {e.linked_event}</p>
                                                </div>
                                            </div>
                                            <Download className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Additional Notes */}
                            <section className="p-10 bg-amber-50/50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100/50 dark:border-amber-900/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight text-amber-900 dark:text-amber-100 uppercase leading-none">
                                        Analyst Notes
                                    </h3>
                                </div>
                                <div className="text-amber-800 dark:text-amber-300 leading-relaxed italic space-y-2 text-sm md:text-base">
                                    {Array.isArray(data.notes) ? (
                                        data.notes.map((note, i) => (
                                            <p key={i}>"{clean(note)}"</p>
                                        ))
                                    ) : (
                                        <p>"{clean(data.notes) || "No additional observations noted at this time."}"</p>
                                    )}
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-10 py-6 border-t dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                            Veritas Intelligence Services • Generated via TruthFlow Engine v1.0
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};