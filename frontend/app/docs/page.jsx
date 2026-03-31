'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shell } from '../../components/Shell';
import { 
  Shield, 
  MessageSquare, 
  FileText, 
  Zap, 
  Lock, 
  EyeOff, 
  Globe, 
  Cpu,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    title: "End-to-End Encryption",
    description: "Every byte of data you input is encrypted locally before reaching our secure servers. Only you hold the keys.",
    icon: <Lock className="h-6 w-6 text-primary" />,
    color: "bg-primary/10"
  },
  {
    title: "AI-Powered Clarity",
    description: "Our advanced neural models help you refine your reports, identifying gaps and suggesting sensory details for maximum impact.",
    icon: <Cpu className="h-6 w-6 text-rose" />,
    color: "bg-rose/10"
  },
  {
    title: "Zero-Knowledge Storage",
    description: "We don't store plain text. Your documentation is yours alone, protected by industry-leading security protocols.",
    icon: <EyeOff className="h-6 w-6 text-amber-500" />,
    color: "bg-amber-500/10"
  },
  {
    title: "Real-time Workspace",
    description: "Seamlessly switch between conversational discovery and structured documentation in a single unified interface.",
    icon: <Globe className="h-6 w-6 text-emerald-500" />,
    color: "bg-emerald-500/10"
  }
];

export default function DocsPage() {
  return (
    <Shell>
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-20" />
      
      <main className="flex-1 flex flex-col pt-32 px-6 pb-24 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Shield className="h-3.5 w-3.5" />
            System Documentation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-header font-black text-text-main mb-8 leading-[1.1] tracking-tight"
          >
            Mastering the <span className="text-primary italic">TruthFlow</span> Workspace
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-dim/70 max-w-2xl leading-relaxed mb-10"
          >
            TruthFlow is more than just a reporting tool&mdash;it&apos;s a high-fidelity sanctuary for your 
            perspectives. Learn how to leverage our encrypted ecosystem.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
              className="glass-card p-10 rounded-[2.5rem] border-white/10 group group cursor-default"
            >
              <div className={`p-4 rounded-2xl ${feature.color} w-fit mb-6 transition-transform group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-text-dim/60 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Getting Started Section */}
        <section className="space-y-12">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-header font-bold text-text-main flex items-center gap-4"
          >
            <Zap className="h-8 w-8 text-primary" />
            Getting Started
          </motion.h2>

          <div className="space-y-4">
            {[
              { step: "01", title: "Initialize Secure Session", text: "Navigate to the Chat interface to begin a secure dialogue. Every session is unique and ephemeral until you choose to commit it.", link: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
              { step: "02", title: "Generate Enhanced Reports", text: "Use the Document view to draft high-fidelity records. Enable 'Enhanced Report' for AI-driven sensory expansion and clarity checks.", link: "/document", icon: <FileText className="h-4 w-4" /> },
              { step: "03", title: "Verify & Submit", text: "Once satisfied, use the Submit button to finalize your findings. Our cryptographic signatures ensure your truth remains untampered.", link: "/document", icon: <Shield className="h-4 w-4" /> }
            ].map((step, idx) => (
              <motion.a
                key={idx}
                href={step.link}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-text-main mb-2 flex items-center gap-2">
                    {step.icon}
                    {step.title}
                  </h4>
                  <p className="text-sm text-text-dim/60 leading-relaxed">
                    {step.text}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/30">
            Powered by TruthFlow Cryptographic Engine v4.2.0
          </p>
        </footer>
      </main>
    </Shell>
  );
}
