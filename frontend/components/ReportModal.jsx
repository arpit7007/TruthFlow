'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';

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
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">
                                    Security Intelligence Report
                                </h2>
                                <p className="text-[10px] text-text-dim/60 font-bold tracking-widest uppercase">
                                    REF: TF-2026-X892
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-xs tracking-wider uppercase shadow-lg"
                            >
                                <Download className="h-4 w-4" />
                                Export PDF
                            </motion.button>

                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                            >
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
                            <p className="text-gray-700">
                                {data.summary || "Not available"}
                            </p>
                        </section>

                        {/* Timeline */}
                        <section>
                            <h2 className="text-xl font-semibold">Timeline</h2>

                            {data.timeline?.map((event, index) => (
                                <div key={index} className="mt-4 p-4 border rounded-xl shadow-sm">
                                    
                                    <h3 className="font-semibold">
                                        Event {index + 1}: {event.event}
                                    </h3>

                                    <p><strong>Description:</strong> {event.description}</p>
                                    <p><strong>Time:</strong> {event.time || "Not specified"}</p>
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
                                    <li key={i}>{p.name}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Locations */}
                        <section>
                            <h2 className="text-xl font-semibold">Locations</h2>
                            <ul className="list-disc ml-6">
                                {data.locations?.map((loc, i) => (
                                    <li key={i}>{loc.name}</li>
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
                                        {e.linked_event && ` (linked to: ${e.linked_event})`}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Notes */}
                        <section>
                            <h2 className="text-xl font-semibold">Additional Notes</h2>

                            {data.notes?.length > 0 ? (
                                <ul className="list-disc ml-6">
                                    {data.notes.map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700">None</p>
                            )}
                        </section>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};