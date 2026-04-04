'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Edit, Brain } from 'lucide-react';
import { EditorModal } from './EditorModal';
import { useRouter } from 'next/navigation';

const clean = (value) => {
    if (!value || value === "null" || value === "None") return "N/A";
    return value;
};

const Section = ({ title, children }) => (
    <div className="mb-8 border-b border-black pb-4 text-black">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 underline text-black">
            {title}
        </h3>
        <div className="space-y-2 text-black">
            {children}
        </div>
    </div>
);

const LabelValue = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:gap-4 text-black">
        <span className="font-bold min-w-[150px] uppercase text-[12px] text-black">{label}:</span>
        <span className="text-[13px] text-black">{clean(value)}</span>
    </div>
);

export const ReportModal = ({ isOpen, onClose, data = {}, docId, localAttachments = [] }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const reportRef = useRef(null);
    const router = useRouter();

    const handleExportPDF = async () => {
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = reportRef.current;
            
            const opt = {
                margin:       10,
                filename:     `truthflow_report_${data.victim_details?.full_name || 'document'}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF Export Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
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
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white text-black shadow-2xl overflow-hidden flex flex-col border border-black font-mono"
                >
                    {/* Header Controls (Functional Look) */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-black bg-white z-10">
                        <div className="flex flex-col text-black">
                            <h2 className="text-lg font-bold uppercase tracking-tight text-black">TRUTHFLOW REPORT</h2>
                            <p className="text-[10px] opacity-70 text-black">CONFIDENTIAL DOCUMENT • FOR OFFICIAL USE ONLY</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {docId && (
                                <motion.button 
                                    onClick={() => router.push(`/document/${docId}/analysis`)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg transition-all"
                                >
                                    <Brain className="h-4 w-4" />
                                    Analyse Report
                                </motion.button>
                            )}
                            <motion.button 
                                onClick={() => setIsEditorOpen(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black border border-black hover:bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg transition-all"
                            >
                                <Edit className="h-4 w-4" />
                                Open in Editor
                            </motion.button>
                            <motion.button 
                                onClick={handleExportPDF}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg transition-all"
                            >
                                <Download className="h-4 w-4" />
                                Export PDF
                            </motion.button>
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-black/5 rounded-lg transition-colors border border-black/10"
                            >
                                <X className="h-5 w-5 text-black" />
                            </button>
                        </div>
                    </div>

                    {/* Report Content (Notepad Style) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white text-black">
                        <div className="max-w-4xl mx-auto px-10 py-12 text-black" ref={reportRef}>
                            
                            {/* Document Heading */}
                            <div className="mb-12 border-b-2 border-black pb-6 text-center text-black">
                                <h1 className="text-2xl font-black uppercase mb-1 text-black">INTELLIGENCE REPORT</h1>
                                <p className="text-sm text-black">RECORDED BY: {clean(data.heading?.recorded_by)}</p>
                                <p className="text-sm text-black">DATE/TIME: {data.heading?.recording_datetime ? new Date(data.heading.recording_datetime).toLocaleString() : "PENDING"}</p>
                            </div>

                            {/* Section 1: Survivor Details */}
                            <Section title="Survivor Details">
                                <LabelValue label="Full Name" value={data.victim_details?.full_name} />
                                <LabelValue label="D.O.B." value={data.victim_details?.date_of_birth ? new Date(data.victim_details.date_of_birth).toLocaleDateString() : null} />
                                <LabelValue label="Gender" value={data.victim_details?.gender} />
                                <LabelValue label="Address" value={data.victim_details?.address} />
                                <LabelValue label="Contact" value={data.victim_details?.contact_number} />
                                <LabelValue label="ID Proof" value={data.victim_details?.id_proof} />
                            </Section>

                            {/* Section 2: Accused Information */}
                            <Section title="Accused Information">
                                <LabelValue label="Name" value={data.accused?.name} />
                                <LabelValue label="Age" value={data.accused?.age} />
                                <LabelValue label="Description" value={data.accused?.description} />
                                <LabelValue label="Relationship" value={data.accused?.relationship} />
                            </Section>

                            {/* Section 3: Incident Details */}
                            <Section title="Incident Details">
                                <p className="text-[13px] leading-relaxed whitespace-pre-wrap italic text-black">
                                    "{clean(data.incident_details)}"
                                </p>
                            </Section>

                            {/* Section 4: Summary */}
                            <Section title="Executive Summary">
                                <p className="text-[13px] leading-relaxed text-black">
                                    {clean(data.summary)}
                                </p>
                            </Section>

                            {/* Section 5: Timeline */}
                            <Section title="Timeline of Events">
                                {data.timeline?.map((event, idx) => (
                                    <div key={idx} className="mb-6 last:mb-0 border-l-2 border-black pl-4 py-1">
                                        <div className="flex flex-wrap gap-x-4 mb-2">
                                            <span className="font-bold underline text-[12px] text-black">{event.event}</span>
                                            <span className="text-[11px] opacity-70 italic text-black">[{clean(event.time) || "TIME UNKNOWN"}]</span>
                                            <span className="text-[11px] opacity-70 italic text-black">@{clean(event.location)}</span>
                                        </div>
                                        <p className="text-[12px] mb-2 text-black">{event.description}</p>
                                        {event.people?.length > 0 && (
                                            <p className="text-[11px] text-black"><span className="font-bold uppercase text-black">People:</span> {event.people.join(', ')}</p>
                                        )}
                                    </div>
                                ))}
                            </Section>

                            {/* Section 5.5: People Involved */}
                            <Section title="People Involved">
                                {data.people?.map((person, idx) => (
                                    <div key={idx} className="mb-4">
                                        <LabelValue label="Name" value={person.name} />
                                    </div>
                                ))}
                            </Section>

                            {/* Section 6: Medical Information */}
                            <Section title="Medical Information">
                                <LabelValue label="Referred" value={data.medical?.referred} />
                                <LabelValue label="DateTime" value={data.medical?.datetime} />
                            </Section>

                            {/* Section 7: Witnesses */}
                            <Section title="Witnesses">
                                {data.witnesses?.length > 0 ? data.witnesses.map((w, idx) => (
                                    <div key={idx} className="mb-2">
                                        <LabelValue label={`Witness ${idx+1}`} value={`${clean(w.name)} (${clean(w.contact)})`} />
                                    </div>
                                )) : <p className="text-[13px]">No witnesses recorded.</p>}
                            </Section>

                            {/* Section 8: Evidence */}
                            <Section title="Chain of Evidence">
                                {data.evidence?.length > 0 ? data.evidence.map((e, idx) => (
                                    <div key={idx} className="text-[12px] text-black">
                                        [FILE_{idx+1}]: {e.file_name} (Linked to: {e.linked_event})
                                    </div>
                                )) : null}
                                {localAttachments?.length > 0 ? localAttachments.map((att, idx) => (
                                    <div key={`local-${idx}`} className="mt-4 mb-4">
                                        <p className="text-[12px] font-bold uppercase mb-2 text-black">Attached Evidence {idx + 1}: {att.file.name}</p>
                                        {att.file.type.startsWith('image/') && (
                                            <img 
                                                src={att.previewUrl} 
                                                alt="evidence preview" 
                                                className="max-w-xs border border-black p-1 object-contain"
                                            />
                                        )}
                                    </div>
                                )) : null}
                                {(!data.evidence || data.evidence.length === 0) && (!localAttachments || localAttachments.length === 0) && (
                                    <p className="text-[13px] text-black">No evidence files attached.</p>
                                )}
                            </Section>

                            {/* Section 9: Officer Notes */}
                            <Section title="Officer/Analyst Notes">
                                <p className="text-[13px] whitespace-pre-wrap text-black">
                                    {clean(data.officer_notes || data.notes)}
                                </p>
                            </Section>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-10 py-4 border-t border-black bg-white text-center text-black">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black">
                            Generated by TRUTHFLOW v1.0 • END OF REPORT
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
        <EditorModal 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)} 
            initialData={data} 
        />
        </>
    );
};