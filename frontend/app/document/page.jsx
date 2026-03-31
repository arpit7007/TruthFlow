
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '../../components/Shell';
import { ReportModal } from '../../components/ReportModal';
import { Sparkles, ChevronRight, Zap, Info, Lightbulb, Send, Trash2, CheckCircle2 } from 'lucide-react';

const mockAIQuestions = [
  { id: '1', type: 'Detail', text: 'Can you elaborate on the specific environment where this happened?', icon: <Zap className="h-4 w-4" /> },
  { id: '2', type: 'Emotion', text: 'How did your perception of the event change after the first few minutes?', icon: <Lightbulb className="h-4 w-4" /> },
  { id: '3', type: 'Clarification', text: 'Were there any specific sensory details (smells, sounds) that stood out?', icon: <Info className="h-4 w-4" /> },
  { id: '4', type: 'Context', text: 'Was there anyone else present whose reaction you noticed?', icon: <ChevronRight className="h-4 w-4" /> },
];

export default function DocumentPage() {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [response, setResponse] = useState({});

  const handleClear = () => {
    if (text.trim() && confirm('Are you sure you want to clear your current work?')) {
      setText('');
    } else if (!text.trim()) {
      setText('');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    // Phase 1: Generating
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("text", text)

    const response = await fetch("http://127.0.0.1:8000/generate-report", {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    setResponse(data)

    // console.log("the input was", text);
    console.log("the response from the llm is: ", data);





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

  const headerActions = (
    <motion.button
      onClick={() => setIsEnhanced(!isEnhanced)}
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

  return (
    <Shell headerActions={headerActions}>
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />

      <main className="flex-1 flex flex-col pt-28 px-8 pb-16 transition-all duration-700 ease-in-out min-h-screen">
        <div className="flex gap-8 transition-all duration-700 ease-in-out min-h-[calc(100vh-12rem)]">

          {/* Editor Panel - Pure Solid White for absolute clarity */}
          <motion.div
            layout
            animate={{ scale: isFocused ? 1.01 : 1, y: isFocused ? -5 : 0 }}
            className={`flex flex-col flex-1 bg-[#ffffff] dark:bg-black/20 rounded-[2rem] border transition-all duration-500 shadow-2xl overflow-hidden ${isFocused ? 'border-primary/40 shadow-primary/10' : 'border-slate-200 dark:border-white/10'
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
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-dim/60 hover:text-rose transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>

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
                initial={{ width: 0, opacity: 0, x: 20 }}
                animate={{ width: '40%', opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                className="hidden lg:flex flex-col bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl origin-right"
              >
                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-primary/5 dark:bg-primary/10">
                  <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                    <Sparkles className="h-4 w-4" />
                    AI Intelligence Guidance
                  </h3>
                </div>

                <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar min-w-[320px]">
                  <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-8">
                    <p className="text-sm font-medium text-text-dim leading-relaxed italic">
                      &quot;I&apos;ve analyzed your initial draft. To strengthen the evidence chain, consider addressing these clarifying questions.&quot;
                    </p>
                  </div>

                  {mockAIQuestions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group cursor-pointer border border-slate-100 dark:border-white/5 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          {q.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{q.type}</span>
                      </div>
                      <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-normal">
                        {q.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        data={response}
      />
    </Shell>
  );
}