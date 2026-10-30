'use client';

import { useState, useActionState } from 'react';
import { signInAction, signUpAction } from '@/app/auth/actions';
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [signInState, signInDispatch, isSignInPending] = useActionState(signInAction, {});
  const [signUpState, signUpDispatch, isSignUpPending] = useActionState(signUpAction, {});

  const isPending = isSignInPending || isSignUpPending;
  const activeError = mode === 'signin' ? signInState.error : signUpState.error;
  const successMessage = mode === 'signup' ? signUpState.successMessage : undefined;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-surface-border bg-surface-card/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
      {/* Mode Toggle Tabs */}
      <div className="flex rounded-2xl border border-surface-border bg-surface-elevated/60 p-1">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200 active:scale-95',
            mode === 'signin'
              ? 'border border-surface-border bg-surface-card text-foreground shadow-md'
              : 'text-surface-muted hover:text-foreground',
          )}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200 active:scale-95',
            mode === 'signup'
              ? 'border border-surface-border bg-surface-card text-foreground shadow-md'
              : 'text-surface-muted hover:text-foreground',
          )}
        >
          Create Account
        </button>
      </div>

      {/* Status Messages */}
      {activeError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-status-dropped/30 bg-status-dropped/10 p-3 text-xs text-status-dropped">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-status-complete/30 bg-status-complete/10 p-3 text-xs text-status-complete">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Submission */}
      <form
        action={mode === 'signin' ? signInDispatch : signUpDispatch}
        className="mt-6 flex flex-col gap-4"
      >
        {/* Display Name Input (Only on Sign Up) */}
        {mode === 'signup' && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="displayName"
              className="text-xs font-semibold text-surface-muted"
            >
              Display Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
              <input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Jinwoo Sung"
                className="h-12 w-full rounded-xl border border-surface-border bg-surface-elevated/70 pl-10 pr-4 text-xs text-foreground placeholder-surface-muted outline-none transition-colors focus:border-brand-primary"
              />
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-surface-muted">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="hunter@malaya.app"
              className="h-12 w-full rounded-xl border border-surface-border bg-surface-elevated/70 pl-10 pr-4 text-xs text-foreground placeholder-surface-muted outline-none transition-colors focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-surface-muted">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-surface-border bg-surface-elevated/70 pl-10 pr-4 text-xs text-foreground placeholder-surface-muted outline-none transition-colors focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95 disabled:opacity-50"
        >
          <span>
            {isPending
              ? 'Processing...'
              : mode === 'signin'
                ? 'Sign In to Malaya'
                : 'Create Account'}
          </span>
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
