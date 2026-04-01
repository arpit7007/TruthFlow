'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shell } from '../../components/Shell';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();


  const router = useRouter();

  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     login(email);
  //     setIsLoading(false);
  //   }, 1500);
  // };

  const handleSignup = async (data) => {
    // updating the data with the role field for the creation in the database

    const res = await fetch('/api/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("user created successfully")
      const data = await res.json();
      console.log(data)

      redirect('/login')

    } else {
      toast.error("not able to create user")
    }
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
              <h1 className="text-3xl font-bold tracking-tight text-text-main">Join TruthFlow</h1>
              <p className="text-sm text-text-dim/60 font-medium tracking-wide">Create your encrypted identity to begin.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/30"
                  />
                  {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/30"
                  />
                  {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Generate Secure Password"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/30"
                  />
                  {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
                </div>
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
                    <span>Sign up</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs text-text-dim/40 font-medium pt-4">
              Already have a account?{' '}
              <Link href="/login" className="text-primary font-black tracking-widest hover:text-primary/80">Login</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </Shell>
  );
}
