'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';

// helper to clean "null" string
const clean = (value) => {
    if (!value || value === "null") return null;
    return value;
};

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

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-scroll flex flex-col border border-slate-200 dark:border-white/10"
                >

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                                    Security Intelligence Report
                                </h2>
                                <p className="text-[10px] uppercase tracking-widest">
                                    REF: TF-2026-X892
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase">
                                <Download className="h-4 w-4" />
                                Export PDF
                            </motion.button>

                            <button onClick={onClose} className="p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto p-6 space-y-6">

                        {/* Title */}
                        <h1 className="text-3xl font-bold">📝 Incident Report</h1>

                        {/* Summary */}
                        <section>
                            <h2 className="text-xl font-semibold">Summary</h2>
                            <p>
                                {clean(data.summary) || "Not available"}
                            </p>
                        </section>

                        {/* Timeline */}
                        <section>
                            <h2 className="text-xl font-semibold">Timeline</h2>

                            {data.timeline?.map((event, index) => (
                                <div key={index} className="mt-4 p-4 border rounded-xl">

                                    <h3 className="font-semibold">
                                        Event {index + 1}: {event.event}
                                    </h3>

                                    <p><strong>Description:</strong> {event.description}</p>
                                    <p><strong>Time:</strong> {clean(event.time) || "Not specified"}</p>
                                    <p><strong>Location:</strong> {event.location}</p>

                                    <p>
                                        <strong>People:</strong>{" "}
                                        {event.people?.length > 0
                                            ? event.people.join(", ")
                                            : "None"}
                                    </p>

                                    {/* Evidence */}
                                    {event.evidence?.length > 0 && (
                                        <div className="mt-2">
                                            <strong>Evidence:</strong>
                                            <ul className="list-disc ml-6">
                                                {event.evidence.map((file, i) => (
                                                    <li key={i}>{file}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>

                        {/* People */}
                        <section>
                            <h2 className="text-xl font-semibold">People Involved</h2>
                            <ul className="list-disc ml-6">
                                {data.people?.map((p, i) => (
                                    <li key={i}>
                                        {p.name}
                                        {clean(p.role) && ` (${p.role})`}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Locations */}
                        <section>
                            <h2 className="text-xl font-semibold">Locations</h2>
                            <ul className="list-disc ml-6">
                                {data.locations?.map((loc, i) => (
                                    <li key={i}>
                                        {loc.location}
                                        {loc.relevant_event && ` (event: ${loc.relevant_event})`}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Evidence Summary */}
                        <section>
                            <h2 className="text-xl font-semibold">Evidence Summary</h2>
                            <ul className="list-disc ml-6">
                                {data.evidence?.map((e, i) => (
                                    <li key={i}>
                                        {e.file_name}
                                        {clean(e.linked_event) && ` (linked to: ${e.linked_event})`}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Notes */}
                        <section>
                            <h2 className="text-xl font-semibold">Additional Notes</h2>
                            <p>
                                {clean(data.notes) || "None"}
                            </p>
                        </section>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};