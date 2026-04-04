'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '../../../components/Shell';
import { ReportModal } from '../../../components/ReportModal';
import { Sparkles, ChevronRight, Zap, Info, Lightbulb, Send, Trash2, CheckCircle2, Paperclip, X, Image as ImageIcon, User, Bot, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';


export default function DocumentPage({ params }) {
    const { slug } = React.use(params)

    const { data: session, status } = useSession();

    console.log(session)


    const [isEnhanced, setIsEnhanced] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [text, setText] = useState('');

    const [docContent, setDocContent] = useState();

    const [previousQA, setPreviousQA] = useState();

    const [stopCounter, setStopCounter] = useState(0);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [response, setResponse] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [guidanceMessages, setGuidanceMessages] = useState([
        { id: '1', role: 'assistant', content: "Generating question..." }
    ]);
    const [guidanceInput, setGuidanceInput] = useState('');
    const [isGuidanceTyping, setIsGuidanceTyping] = useState(false);
    const fileInputRef = useRef(null);
    const guidanceEndRef = useRef(null);



    // Cleanup object URLs when component unmounts or attachments change
    useEffect(() => {
        return () => {
            attachments.forEach(a => URL.revokeObjectURL(a.previewUrl));
        };
    }, [attachments]);

    useEffect(() => {
        guidanceEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [guidanceMessages, isGuidanceTyping]);




    const handleFileSelect = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setAttachments(prev => [...prev, ...newFiles]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index) => {
        setAttachments(prev => {
            const newAttachments = [...prev];
            URL.revokeObjectURL(newAttachments[index].previewUrl);
            newAttachments.splice(index, 1);
            return newAttachments;
        });
    };

    const handleClear = () => {
        if ((text.trim() || attachments.length > 0) && confirm('Are you sure you want to clear your current work?')) {
            setText('');
            setAttachments([]);
        } else if (!text.trim() && attachments.length === 0) {
            setText('');
            setAttachments([]);
        }
    };

    const handleSubmit = async () => {
        if (!text.trim()) return;

        // Phase 1: Generating
        setIsGenerating(true);

        const formData = new FormData();
        formData.append("text", text);
        formData.append("docId", slug)

        attachments.forEach((a, index) => {
            formData.append(`file_${index}`, a.file);
        });

        const response = await fetch("/api/updateReportAndDoc/", {
            method: 'POST',
            body: formData
        })
        const data = await response.json();
        setResponse(data.data)

        console.log("the response from the llm is: ", data.data);


        // Phase 2: Report Generated (after delay)
        setTimeout(() => {
            setIsGenerating(false);
            setIsSubmitted(true);

            // Phase 3: Open Report Modal (instantly after completion)
            setTimeout(() => {
                setIsSubmitted(false);
                setShowReport(true);
            }, 1000);
        }, 2000);
    };



    const viewReport = async () => {
        const response = await fetch(`/api/viewReport?docId=${encodeURIComponent(slug)}`,)

        const data = await response.json();

        console.log(data)
        setResponse(data)
        setShowReport(true);
    }

    const startEnhancing = async (previous_qa = "") => {
        setIsEnhanced(!isEnhanced);

        const formData = new FormData();
        console.log(docContent)
        formData.append("text", docContent.note)
        formData.append("report", JSON.stringify(docContent.report))
        formData.append("previous_qa", previous_qa)

        const response = await fetch("http://127.0.0.1:8000/next-question", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        console.log(data.question)
        setGuidanceMessages(prev => prev.map(msg => msg.id === '1' ? { ...msg, content: data.question } : msg));

        // update the question in the previous QA variable
        setPreviousQA(prev => (prev || '') + "question: " + data.question + '\n');

    }


    const handleGuidanceSend = async (e, directText = null) => {

        setStopCounter(stopCounter + 1);

        if (e) e.preventDefault();
        const messageText = directText || guidanceInput;

        // update the previousQA variable
        const updatedQA = (previousQA || '') + "answer: " + messageText + '\n';
        setPreviousQA(updatedQA);

        if (!messageText.trim() || isGuidanceTyping) return;

        if (stopCounter >= 5) {

            const formData = new FormData();
            console.log(docContent)
            formData.append("text", docContent.note + "\nTHIS WAS THE ENHANCING SESSION TAKEN BY THE USER: \n" + updatedQA)
            formData.append("docId", slug)

            attachments.forEach((a, index) => {
                formData.append(`file_${index}`, a.file);
            });

            const response = await fetch("/api/updateReportAndDoc/", {
                method: 'POST',
                body: formData
            })
            const data = await response.json();

            console.log("the response from the llm is: ", data.data);

            setIsEnhanced(!isEnhanced)
            setResponse(data.data)
            setShowReport(true)

        } else {

            const userMsg = {
                id: Date.now().toString(),
                role: 'user',
                content: messageText
            };

            setGuidanceMessages(prev => [...prev, userMsg]);
            setGuidanceInput('');
            setIsGuidanceTyping(true);

            // Simulate AI response
            setTimeout(async () => {
                const formData = new FormData();
                formData.append("text", docContent.note)
                formData.append("report", JSON.stringify(docContent.report))
                formData.append("previous_qa", updatedQA)

                const response = await fetch("http://127.0.0.1:8000/next-question", {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();

                console.log(data.question)

                const assistantMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.question
                };
                setGuidanceMessages(prev => [...prev, assistantMsg]);
                setIsGuidanceTyping(false);

                // update the previousQA variable with the new question given
                setPreviousQA(prev => (prev || '') + "question: " + data.question + '\n');
            }, 1500);
        }


    };



    const headerActions = (
        <motion.button
            onClick={startEnhancing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-500 shadow-lg ${isEnhanced
                ? 'bg-rose text-white shadow-rose/20'
                : 'bg-primary text-white shadow-primary/20'
                }`}
        >
            <Sparkles className={`h-4 w-4 ${isEnhanced ? 'animate-pulse' : ''}`} />
            {isEnhanced ? 'Disable Enhancement' : 'Enhanced Report'}
        </motion.button>
    );

    useEffect(() => {
        const fetchDocument = async () => {
            const response = await fetch(`/api/fetchDocContent?docId=${encodeURIComponent(slug)}`,)

            const data = await response.json();

            console.log("this is the document content", data)
            setText(data.document.note)
            setDocContent(data.document)
            // console.log(data.document.note)
        }

        fetchDocument();
    }, [])



    if (status == "loading") return "Loading..."

    return (
        <Shell headerActions={headerActions}>
            <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />

            <main className="h-screen flex flex-col pt-32 px-8 pb-8 overflow-hidden">
                <div className="flex-1 flex gap-8 min-h-0">

                    {/* Editor Panel - Pure Solid White for absolute clarity */}
                    <motion.div
                        layout
                        animate={{
                            scale: isFocused ? 1.01 : 1,
                            y: isFocused ? -5 : 0,
                            width: isEnhanced ? '50%' : '100%'
                        }}
                        transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                        className={`flex flex-col bg-[#ffffff] dark:bg-black/20 rounded-[2rem] border shadow-2xl overflow-hidden ${isFocused ? 'border-primary/40 shadow-primary/10' : 'border-slate-200 dark:border-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-transparent dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`h-2 w-2 rounded-full ${isFocused ? 'bg-primary animate-pulse' : 'bg-text-dim/20'}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-text-dim/60">Live Documentation</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 dark:text-text-dim/30">{text.length} characters</span>
                        </div>

                        <textarea
                            value={text}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Begin documenting your story here..."
                            className="flex-1 w-full bg-white dark:bg-transparent p-10 text-lg md:text-xl leading-relaxed text-slate-900 dark:text-text-main focus:outline-none placeholder:text-slate-300 dark:placeholder:text-text-dim/40 transition-all resize-none custom-scrollbar"
                        />

                        <div className="flex items-center justify-between px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-dim/60 hover:text-rose transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    multiple
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors shrink-0"
                                >
                                    <Paperclip className="h-4 w-4" />
                                    Attach Files
                                </button>

                                {/* Attachment Preview Next to Button */}
                                <AnimatePresence>
                                    {attachments.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="flex items-center gap-2 overflow-hidden border-l border-slate-200 dark:border-white/10 pl-4 ml-2"
                                        >
                                            <div className="flex gap-2 max-w-[200px] md:max-w-[400px] overflow-x-auto py-1 custom-scrollbar scrollbar-hide">
                                                {attachments.map((file, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group cursor-pointer"
                                                    >
                                                        {file.file.type.startsWith('image/') ? (
                                                            <Image
                                                                src={file.previewUrl}
                                                                alt={file.file.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                                <Paperclip className="h-3 w-3 text-primary" />
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeAttachment(idx);
                                                            }}
                                                            className="absolute inset-0 bg-rose/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isEnhanced ? "" : (
                                <motion.button
                                    onClick={viewReport}
                                    disabled={!text.trim() || isGenerating || isSubmitted}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-xl transition-all ${isSubmitted
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                        : isGenerating
                                            ? 'bg-primary/50 text-white shadow-primary/10 cursor-wait'
                                            : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:grayscale'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Zap className="h-4 w-4" />
                                            </motion.div>
                                            View Report
                                        </>
                                    ) : isSubmitted ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            View Report
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            View Report
                                        </>
                                    )}
                                </motion.button>
                            )}



                            <motion.button
                                onClick={handleSubmit}
                                disabled={!text.trim() || isGenerating || isSubmitted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-xl transition-all ${isSubmitted
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : isGenerating
                                        ? 'bg-primary/50 text-white shadow-primary/10 cursor-wait'
                                        : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:grayscale'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Zap className="h-4 w-4" />
                                        </motion.div>
                                        Generating...
                                    </>
                                ) : isSubmitted ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Report Generated
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Generate Report
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* AI Guidance Panel - Crisp background */}
                    <AnimatePresence>
                        {isEnhanced && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: '50%', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                                className="flex flex-col bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl origin-right"
                            >
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-primary/5 dark:bg-primary/10">
                                    <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                        <Sparkles className="h-4 w-4" />
                                        AI Intelligence Guidance
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                        <AnimatePresence initial={false}>
                                            {guidanceMessages.map((msg, i) => (
                                                <motion.div
                                                    key={msg.id || i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                                >
                                                    <div className={`p-2 rounded-xl shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'} border border-white/10`}>
                                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                                    </div>

                                                    <div className={`max-w-[85%] min-w-0 rounded-2xl p-4 shadow-sm border ${msg.role === 'user'
                                                        ? 'bg-primary text-white border-primary/20 rounded-tr-none'
                                                        : 'bg-white dark:bg-white/5 text-text-main border-slate-100 dark:border-white/5 rounded-tl-none'
                                                        }`}>
                                                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                                            {msg.content}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {isGuidanceTyping && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-start gap-4"
                                                >
                                                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-white/10 shrink-0">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5">
                                                        <div className="flex gap-1.5">
                                                            <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                                                            <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                                                            <span className="h-1 w-1 rounded-full bg-primary animate-bounce"></span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div ref={guidanceEndRef} />
                                    </div>

                                    {/* AI Input Footer */}
                                    <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleGuidanceSend(e);
                                            }}
                                            className="relative group"
                                        >
                                            <input
                                                type="text"
                                                value={guidanceInput}
                                                onChange={(e) => setGuidanceInput(e.target.value)}
                                                placeholder="Provide additional details or answers here..."
                                                className="w-full bg-white dark:bg-slate-800/50 pl-6 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium placeholder:text-slate-400"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!guidanceInput.trim() || isGuidanceTyping}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                            >
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <ReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                data={response.data}
            />
        </Shell>
    );
}