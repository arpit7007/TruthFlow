'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export const EditorModal = ({ isOpen, onClose, initialData = {} }) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (isOpen && initialData) {
            let str = `TRUTHFLOW INTELLIGENCE REPORT\n`;
            str += `=============================\n\n`;
            
            str += `RECORDED BY: ${initialData.heading?.recorded_by || "N/A"}\n`;
            str += `DATE/TIME: ${initialData.heading?.recording_datetime ? new Date(initialData.heading.recording_datetime).toLocaleString() : "PENDING"}\n\n`;
            
            str += `SURVIVOR DETAILS\n----------------\n`;
            str += `Full Name: ${initialData.victim_details?.full_name || "N/A"}\n`;
            str += `D.O.B.: ${initialData.victim_details?.date_of_birth ? new Date(initialData.victim_details.date_of_birth).toLocaleDateString() : "N/A"}\n`;
            str += `Gender: ${initialData.victim_details?.gender || "N/A"}\n`;
            str += `Address: ${initialData.victim_details?.address || "N/A"}\n`;
            str += `Contact: ${initialData.victim_details?.contact_number || "N/A"}\n`;
            str += `ID Proof: ${initialData.victim_details?.id_proof || "N/A"}\n\n`;

            str += `ACCUSED INFORMATION\n-------------------\n`;
            str += `Name: ${initialData.accused?.name || "N/A"}\n`;
            str += `Age: ${initialData.accused?.age || "N/A"}\n`;
            str += `Description: ${initialData.accused?.description || "N/A"}\n`;
            str += `Relationship: ${initialData.accused?.relationship || "N/A"}\n\n`;

            str += `INCIDENT DETAILS\n----------------\n${initialData.incident_details || "N/A"}\n\n`;
            str += `EXECUTIVE SUMMARY\n-----------------\n${initialData.summary || "N/A"}\n\n`;

            str += `TIMELINE OF EVENTS\n------------------\n`;
            if (initialData.timeline?.length > 0) {
                initialData.timeline.forEach(event => {
                    str += `- ${event.event} [${event.time || "TIME UNKNOWN"}] @${event.location || "N/A"}\n`;
                    str += `  ${event.description}\n`;
                    if (event.people?.length > 0) {
                        str += `  People: ${event.people.join(', ')}\n`;
                    }
                });
            } else {
                str += `No events recorded.\n`;
            }
            str += `\n`;

            str += `MEDICAL INFORMATION\n-------------------\n`;
            str += `Referred: ${initialData.medical?.referred || "N/A"}\n`;
            str += `DateTime: ${initialData.medical?.datetime || "N/A"}\n\n`;

            str += `WITNESSES\n---------\n`;
            if (initialData.witnesses?.length > 0) {
                initialData.witnesses.forEach((w, idx) => {
                    str += `${idx + 1}. ${w.name} (${w.contact})\n`;
                });
            } else {
                str += `No witnesses recorded.\n`;
            }
            str += `\n`;

            str += `OFFICER/ANALYST NOTES\n---------------------\n${initialData.officer_notes || initialData.notes || "N/A"}\n\n`;

            setContent(str);
        }
    }, [isOpen, initialData]);

    const handleExportPDF = async () => {
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            
            const opt = {
                margin:       15,
                filename:     'truthflow_intelligence_report.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            const element = document.createElement('div');
            // Adding basic inline styles for the exported PDF
            element.innerHTML = `<pre style="font-family: monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; color: black; line-height: 1.5;">${content}</pre>`;
            
            html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error('Failed to export PDF:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
            >
                <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl h-full max-h-[85vh] bg-white shadow-2xl flex flex-col font-mono border border-black rounded-lg overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-gray-100 z-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest">Report Text Editor</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded border border-black hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                <Download className="h-4 w-4" />
                                Export as PDF
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded transition-colors text-black border border-transparent hover:border-gray-300"
                                title="Close Editor"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-white overflow-hidden">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full p-4 bg-gray-50 border border-black text-black text-sm outline-none resize-none focus:ring-2 focus:ring-black/20 focus:bg-white custom-scrollbar whitespace-pre-wrap rounded-md leading-relaxed"
                            spellCheck={false}
                            placeholder="Edit the report text here..."
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};