'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, ShieldCheck, BookOpen, ArrowLeft, MessageSquare } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';

const mockHistory = [
  { id: '1', title: 'Security Protocol Alpha', date: '2 mins ago', status: 'Secured' },
  { id: '2', title: 'Truth Session #142', date: '1 hour ago', status: 'Encrypted' },
  { id: '3', title: 'Internal Reflection', date: 'Yesterday', status: 'Archived' },
  { id: '4', title: 'System Handover', date: 'Mar 28, 2026', status: 'Verified' },
];

const mockChatHistory = [
  { id: '1', title: 'Chat about security', date: '5 mins ago', lastMessage: 'The perimeter is secure.' },
  { id: '2', title: 'Intelligence briefing', date: '2 hours ago', lastMessage: 'Received intelligence from Alpha.' },
  { id: '3', title: 'Incident follow-up', date: 'Yesterday', lastMessage: 'Need to follow up on the door alarm.' },
];

export const Shell = ({ children, headerActions, showStatus = false }) => {





  const [activeSidebar, setActiveSidebar] = useState(null); // 'chat', 'history', or null
  const pathname = usePathname();
  const router = useRouter();
  // const { isLoggedIn, logout } = useAuth();
  const isHome = pathname === '/';





  const { data: session, status } = useSession();

  if (status == "loading") return "Loading..."
  // if (!session) return redirect("/login")

  console.log(session)

  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-rose/30 selection:text-rose overflow-hidden">
      <AnimatePresence>
        {activeSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSidebar(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] cursor-pointer"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-background/80 backdrop-blur-3xl border-r border-white/10 z-[70] p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {activeSidebar === 'chat' ? <MessageSquare className="h-5 w-5 text-primary" /> : <History className="h-5 w-5 text-primary" />}
                  </div>
                  <h2 className="font-header text-xl font-bold tracking-tight text-text-main">
                    {activeSidebar === 'chat' ? 'Chat History' : 'Past Truths'}
                  </h2>
                </div>
                <button onClick={() => setActiveSidebar(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                  <X className="h-5 w-5 text-text-dim group-hover:text-rose transition-colors" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {activeSidebar === 'chat' ? (
                  mockChatHistory.map((item) => (
                    <motion.div key={item.id} whileHover={{ x: 5 }} className="p-5 rounded-2xl glass-card transition-all cursor-pointer group hover:border-primary/30">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">SECURE CHAT</span>
                        <span className="text-[10px] font-medium text-text-dim/40 italic">{item.date}</span>
                      </div>
                      <h3 className="font-header text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate mb-1">{item.title}</h3>
                      <p className="text-[10px] text-text-dim/60 truncate">{item.lastMessage}</p>
                    </motion.div>
                  ))
                ) : (
                  mockHistory.map((item) => (
                    <motion.div key={item.id} whileHover={{ x: 5 }} className="p-5 rounded-2xl glass-card transition-all cursor-pointer group hover:border-primary/30">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">{item.status}</span>
                        <span className="text-[10px] font-medium text-text-dim/40 italic">{item.date}</span>
                      </div>
                      <h3 className="font-header text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate">{item.title}</h3>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <Link
                  href="/docs"
                  onClick={() => setActiveSidebar(null)}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 text-text-dim hover:text-primary transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase">System Documentation</span>
                </Link>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 text-primary text-[10px] font-black tracking-widest uppercase">
                  <ShieldCheck className="h-4 w-4" />
                  E2E Encryption Active
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-10 py-8">

          <div className="flex justify-start items-center gap-6">
            {session && isHome && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10"
              >
                
                hello {session.user.name}
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >.</motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                >.</motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                >.</motion.span>
              </motion.div>
            
            )}
            

            <div className={`flex items-center gap-4`}>
              {pathname === '/chat' && (
                <motion.button
                  onClick={() => setActiveSidebar('chat')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 transition-all group"
                  title="Chat History"
                >
                  <MessageSquare className="h-6 w-6 text-text-main group-hover:text-primary transition-colors" />
                </motion.button>
              )}

              {pathname === '/document' && (
                <motion.button
                  onClick={() => setActiveSidebar('history')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 transition-all group"
                  title="Document History"
                >
                  <History className="h-6 w-6 text-text-main group-hover:text-primary transition-colors" />
                </motion.button>
              )}

              {!isHome && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-all group"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            {showStatus && (
              <div className="hidden md:flex justify-center items-center gap-3 px-5 py-2 rounded-full glass-card text-emerald-500 text-[10px] font-bold tracking-[0.2em] uppercase animate-float-straight">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Secure Protocol Active
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-6">
            {headerActions}

            {session ? (
              <motion.button
                onClick={() => signOut()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-rose/10 hover:bg-rose/20 text-rose text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-rose/10"
              >
                Terminate Session
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>
            )}

            <ThemeToggle />
          </div>
      </header>

      {children}
    </div>
  );
};
