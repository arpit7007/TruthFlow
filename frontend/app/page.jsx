'use client';

import React from 'react';

import { Shell } from '../components/Shell';
import { motion } from 'framer-motion';
import { MessageCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Home() {
  const headline = "TruthFlow, Guided with Care.";
  const router = useRouter();


  const { data: session, status } = useSession();

  if (status == "loading") return "Loading..."
  // if (!session) return redirect("/login")

    console.log(session)

  return (
    <Shell showStatus={true}>
      {/* Background Layers */}
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-50" />
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Floating Blobs */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] -z-10"
      />
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 70, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-rose/10 rounded-full blur-[140px] -z-10"
      />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center space-y-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-text-main font-header text-5xl leading-[1.1] font-bold md:text-7xl lg:text-8xl tracking-tighter"
          >
            {headline.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.2em] last:mr-0">
                {word.split("").map((char, charIndex) => {
                  const globalIndex = headline.split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0) + charIndex;
                  return (
                    <motion.span
                      key={charIndex}
                      variants={charVariants}
                      className={`inline-block ${globalIndex > 10 ? 'text-gradient' : ''}`}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-text-dim mx-auto max-w-2xl text-lg md:text-xl leading-relaxed font-medium tracking-tight"
          >
            Modern documentation for sensitive stories. <br className="hidden md:block" />
            Designed for total privacy, built for absolute peace of mind.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row pt-4"
          >
            <motion.button
              onClick={() => redirect('/document')}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glow-button group relative flex w-full sm:w-[280px] items-center justify-center gap-4 rounded-[2.5rem] bg-primary px-8 py-5 text-xl font-bold text-white overflow-hidden shadow-2xl shadow-primary/20 whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              <FileText className="h-6 w-6" />
              Document Story
            </motion.button>
            <motion.button
              onClick={() => redirect('/chat')}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card group flex w-full sm:w-[280px] items-center justify-center gap-4 px-8 py-5 text-xl font-bold text-text-main hover:bg-white/10 transition-all border-white/20 whitespace-nowrap"
            >
              <MessageCircle className="h-6 w-6 group-hover:text-rose transition-colors" />
              Start Conversation
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-12 px-10 flex justify-between items-center text-text-dim/40 text-[11px] font-bold tracking-[0.4em] uppercase mt-auto">
        <div className="flex items-center gap-4">
          <div className="h-1 w-1 rounded-full bg-cyan animate-pulse" />
          <span>Encrypted Protocol 4.0</span>
        </div>
        <div className="flex gap-10">
          <span className="hover:text-rose transition-colors cursor-pointer border-b border-transparent hover:border-rose/30">Privacy</span>
          <span className="hover:text-rose transition-colors cursor-pointer border-b border-transparent hover:border-rose/30">Terms</span>
        </div>
      </footer>
    </Shell>
  );
}
