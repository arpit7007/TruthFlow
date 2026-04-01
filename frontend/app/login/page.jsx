'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shell } from '../../components/Shell';
import { useAuth } from '../providers';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirect);
    }
  }, [isLoggedIn, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Shell>
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />
      
      <main className="flex-1 flex items-center justify-center px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-10 rounded-[3rem] border-white/20 shadow-2xl space-y-10">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text-main">Access TruthVault</h1>
              <p className="text-sm text-text-dim/60 font-medium tracking-wide">Enter your secure credentials to proceed.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/30"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Secure Password"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded-md border-white/20 bg-white/5 text-primary focus:ring-primary/20" />
                  <label htmlFor="remember" className="text-xs text-text-dim/60 font-medium cursor-pointer">Remember device</label>
                </div>
                <button type="button" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Forgot Pin?</button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>Decrypt Vault</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Social Login */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-white dark:bg-[#0f172a] px-4 text-text-dim/30">Or Secure OAuth</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-text-main w-full">
                  <Github className="h-4 w-4" />
                  Github
                </button>
                <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-text-main w-full">
                  <span className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">G</span>
                  Google
                </button>
              </div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-xs text-text-dim/40 font-medium">
              Don&apos;t have a protocol?{' '}
              <Link href="/signup" className="text-primary font-black uppercase tracking-widest hover:text-primary/80">Initiate Signup</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </Shell>
  );
}
