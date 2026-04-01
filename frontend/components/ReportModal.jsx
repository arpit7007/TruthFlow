import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Clock, MapPin, Users, Shield, Info, CheckCircle2 } from 'lucide-react';

// helper to clean "null" string
const clean = (value) => {
    if (!value || value === "null") return null;
    return value;
};

const StatusBadge = () => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Verified Intelligence
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-main">{title}</h2>
            {subtitle && <p className="text-[10px] font-medium text-text-dim/60 uppercase tracking-widest mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

const EntityCard = ({ icon: Icon, title, subtitle, tag }) => (
    <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="p-5 rounded-2xl glass-card border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full bg-white/50 dark:bg-white/5 backdrop-blur-sm"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-primary/5 rounded-lg text-primary/60 group-hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
            </div>
            {tag && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/10 rounded-md text-text-dim/40 group-hover:text-primary/60 transition-colors">{tag}</span>}
        </div>
        <h3 className="font-header text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate mb-1">{title}</h3>
        {subtitle && <p className="text-xs text-text-dim/60 line-clamp-2">{subtitle}</p>}
    </motion.div>
);

export const ReportModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

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
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#f8fafc] dark:bg-[#020617] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-white/5"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-black uppercase tracking-[0.2em] text-text-main">
                                        Truth Session Report
                                    </h2>
                                    <StatusBadge />
                                </div>
                                <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-text-dim/40 font-bold">
                                    <span>REF: TF-2026-X892</span>
                                    <div className="h-1 w-1 rounded-full bg-text-dim/20" />
                                    <span>GENERATED: APR 01, 2026</span>
                                    <div className="h-1 w-1 rounded-full bg-text-dim/20" />
                                    <span>E2E ENCRYPTED (V4.2)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:bg-primary/90"
                            >
                                <Download className="h-4 w-4" />
                                Export Intelligence
                            </motion.button>
                            <button 
                                onClick={onClose} 
                                className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-rose/10 hover:text-rose text-text-dim transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar space-y-20 selection:bg-primary/20">
                        
                        {/* Summary Section - Narrative Hero */}
                        <section className="relative group max-w-4xl mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-rose/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative p-10 rounded-[2.5rem] glass-card border-primary/10 dark:bg-white/5 space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <Info className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em]">Executive Summary</span>
                                </div>
                                <p className="text-xl md:text-2xl font-medium text-text-main leading-relaxed tracking-tight">
                                    {clean(data.summary) || "Awaiting intelligence processing..."}
                                </p>
                            </div>
                        </section>

                        {/* Intelligence Timeline */}
                        <section className="max-w-4xl mx-auto">
                            <SectionHeader 
                                icon={Clock} 
                                title="Chronological Sequence" 
                                subtitle="Sequential event reconstruction for documented session." 
                            />
                            
                            <div className="relative ml-6 pl-10 space-y-12">
                                {/* Vertical Line */}
                                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
                                
                                {data.timeline?.map((event, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative group"
                                    >
                                        {/* Dot */}
                                        <div className="absolute -left-12.5 top-1.5 h-5 w-5 rounded-full bg-[#f8fafc] dark:bg-[#020617] border-4 border-primary flex items-center justify-center">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">
                                                    {event.event}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full">
                                                        <Clock className="h-3 w-3" />
                                                        {clean(event.time) || "N/A"}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 text-text-dim/60 rounded-full">
                                                        <MapPin className="h-3 w-3" />
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-base text-text-dim leading-relaxed max-w-2xl">
                                                {event.description}
                                            </p>

                                            {(event.people?.length > 0 || event.evidence?.length > 0) && (
                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    {event.people?.map((person, i) => (
                                                        <span key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-text-dim/40 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                                                            <Users className="h-2.5 w-2.5" />
                                                            {person}
                                                        </span>
                                                    ))}
                                                    {event.evidence?.map((file, i) => (
                                                        <span key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500/60 bg-emerald-500/5 px-2 py-1 rounded-md">
                                                            <Shield className="h-2.5 w-2.5" />
                                                            {file}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Grid: Entities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                            
                            {/* People */}
                            <div className="space-y-6">
                                <SectionHeader icon={Users} title="Identified Entities" />
                                <div className="space-y-4">
                                    {data.people?.map((p, i) => (
                                        <EntityCard 
                                            key={i} 
                                            icon={Users} 
                                            title={p.name} 
                                            subtitle={clean(p.role) || "Unspecified Role"} 
                                            tag="PERSONNEL"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="space-y-6">
                                <SectionHeader icon={MapPin} title="Spatial Analysis" />
                                <div className="space-y-4">
                                    {data.locations?.map((loc, i) => (
                                        <EntityCard 
                                            key={i} 
                                            icon={MapPin} 
                                            title={loc.location} 
                                            subtitle={loc.relevant_event ? `Primary location for: ${loc.relevant_event}` : "Multiple interactions recorded"}
                                            tag="GEO-TAG"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Evidence Summary */}
                            <div className="space-y-6">
                                <SectionHeader icon={Shield} title="Secured Evidence" />
                                <div className="space-y-4">
                                    {data.evidence?.map((e, i) => (
                                        <EntityCard 
                                            key={i} 
                                            icon={FileText} 
                                            title={e.file_name} 
                                            subtitle={clean(e.linked_event) ? `Linked to sequence: ${e.linked_event}` : "General supporting evidence"}
                                            tag="VERIFIED FILE"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <section className="max-w-4xl mx-auto pt-10 border-t border-slate-200 dark:border-white/5">
                           <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/2 space-y-4 border border-dashed border-slate-300 dark:border-white/10">
                                <div className="flex items-center gap-3 text-text-dim/40">
                                    <Info className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Analyst Intelligence Notes</span>
                                </div>
                                <p className="text-sm text-text-dim italic leading-relaxed">
                                    &quot;{clean(data.notes) || "No additional intelligence observations recorded for this session. System integrity remains optimal."}&quot;
                                </p>
                           </div>
                           
                           {/* Sign-off */}
                           <div className="mt-12 flex items-center justify-between text-text-dim/20">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em]">Validated by TruthFlow Protocol</p>
                                    <p className="text-[7px] uppercase tracking-widest">Instance ID: TF-CORE-2026-ALPHA</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 opacity-30" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hash Verified</span>
                                </div>
                           </div>
                        </section>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};