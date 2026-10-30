import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Authentication — Malaya',
  description:
    'Sign in or create an account to synchronize your reading progress, bookmarks, and personal manhwa library.',
};

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col items-center justify-center px-4 py-8 sm:px-6">
      {/* Brand Identity */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-xl shadow-brand-glow/30 transition-transform active:scale-95"
        >
          <BookOpen className="h-6 w-6" />
        </Link>

        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Welcome to Malaya
        </h1>

        <p className="max-w-sm text-xs text-surface-muted leading-relaxed sm:text-sm">
          Sign in to automatically sync your reading history, chapter progress, and
          curated library across all devices.
        </p>
      </div>

      {/* Interactive Form Component */}
      <AuthForm />
    </div>
  );
}
