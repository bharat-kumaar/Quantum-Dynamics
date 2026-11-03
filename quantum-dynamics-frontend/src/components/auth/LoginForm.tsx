'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Fingerprint, Mail, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

import { loginSchema, LoginFormData } from '@/validation/auth.schema';
import { AuthService } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/error';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Handle URL pre-fill if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const passParam = params.get('password');
      if (emailParam) form.setValue('email', emailParam.trim());
      if (passParam) form.setValue('password', passParam);
    }
  }, [form]);

  // Autofill Admin helper
  const handleAutofillAdmin = () => {
    form.setValue('email', 'bharatkumar70233@gmail.com');
    form.setValue('password', 'password123');
    toast.success('Admin credentials provisioned into form.');
  };

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email: data.email.trim(),
        password: data.password
      });
      const token = response?.token;

      if (token) {
        toast.success('Clearance authorized. Welcome to Quantum Dynamics.');
        if (typeof window !== 'undefined') {
          // Replace URL directly so no history loop happens
          window.location.replace('/');
        }
      } else {
        toast.error('Authentication rejected: Gateway received invalid token payload.');
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Access denied. Verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* 1-Click Fast Fill Admin Credentials Banner */}
      <div 
        onClick={handleAutofillAdmin}
        className="group flex items-center justify-between p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors">Test as Admin</p>
            <p className="text-[10px] font-mono text-cyan-400/80">bharatkumar70233@gmail.com</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 group-hover:scale-105 transition-transform">
          Autofill ↵
        </span>
      </div>

      <Form {...form}>
        <form 
          method="POST" 
          action="#" 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-5"
        >
          {/* Corporate Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-cyan-400" /> Corporate Email
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      placeholder="e.g. bharatkumar70233@gmail.com" 
                      className="h-11 bg-[#070b16]/90 border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium text-xs" 
                      disabled={isLoading} 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-rose-400 text-xs font-mono" />
              </FormItem>
            )}
          />

          {/* Access Key Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                    <KeyRound className="h-3 w-3 text-cyan-400" /> Access Key
                  </FormLabel>
                  <Link href="/forgot-password" className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline">
                    Recover Key?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••••••••" 
                    className="h-11 bg-[#070b16]/90 border-slate-700/80 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium text-xs" 
                    disabled={isLoading} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-rose-400 text-xs font-mono" />
              </FormItem>
            )}
          />

          {/* Submit Action */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 border-0 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                <span>Establishing Neural Link...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-cyan-200" />
                <span>Initialize Session</span>
              </span>
            )}
          </Button>
        </form>
      </Form>

      {/* Register Prompt */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-400 font-mono">
          Need enterprise clearance?{' '}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
            Request Provisioning
          </Link>
        </p>
      </div>
    </div>
  );
}
