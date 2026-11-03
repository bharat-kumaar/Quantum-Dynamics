'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Mail, User, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

import { registerSchema, RegisterFormData } from '@/validation/auth.schema';
import { AuthService } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/error';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      await AuthService.register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      
      toast.success('Clearance granted. Account initialized successfully.');
      router.push('/login');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to initialize account.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form 
        method="POST" 
        action="#" 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }} 
        className="space-y-4"
      >
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <User className="h-3 w-3 text-violet-400" /> Full Legal Name
          </label>
          <div className="relative group">
            <input 
              {...register('name')}
              placeholder="e.g. Sarah Jenkins" 
              className="w-full h-11 px-3.5 bg-[#070b16]/90 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 text-xs font-medium focus:outline-none transition-all" 
              disabled={isLoading} 
            />
          </div>
          {errors.name && <p className="text-xs text-rose-400 font-mono mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-violet-400" /> Corporate Email
          </label>
          <div className="relative group">
            <input 
              {...register('email')}
              placeholder="name@quantumdynamics.com" 
              className="w-full h-11 px-3.5 bg-[#070b16]/90 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 text-xs font-medium focus:outline-none transition-all" 
              disabled={isLoading} 
            />
          </div>
          {errors.email && <p className="text-xs text-rose-400 font-mono mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <KeyRound className="h-3 w-3 text-violet-400" /> Access Key (Min 6 chars)
          </label>
          <div className="relative group">
            <input 
              type="password"
              {...register('password')}
              placeholder="••••••••••••" 
              className="w-full h-11 px-3.5 bg-[#070b16]/90 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 text-xs font-medium focus:outline-none transition-all" 
              disabled={isLoading} 
            />
          </div>
          {errors.password && <p className="text-xs text-rose-400 font-mono mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-violet-400" /> Confirm Access Key
          </label>
          <div className="relative group">
            <input 
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••••••" 
              className="w-full h-11 px-3.5 bg-[#070b16]/90 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 text-xs font-medium focus:outline-none transition-all" 
              disabled={isLoading} 
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-rose-400 font-mono mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 mt-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Transmitting Request...</span>
            </>
          ) : (
            <>
              <span>Submit Clearance Request</span>
              <ArrowRight className="h-4 w-4 text-violet-200" />
            </>
          )}
        </button>
      </form>

      {/* Return to Login */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 font-mono">
          Already authorized?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold hover:underline">
            Enter Gateway
          </Link>
        </p>
      </div>
    </div>
  );
}
