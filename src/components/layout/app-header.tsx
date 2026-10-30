import Link from 'next/link';
import { BookOpen, Search, Bookmark, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/auth/actions';

export async function AppHeader() {
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Graceful fallback if placeholder or offline credentials
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-canvas/80 backdrop-blur-md pt-safe">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white shadow-md shadow-brand-glow/30">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              Malaya
            </span>
          </div>
        </Link>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search Manhwa"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-surface-muted transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/library"
            aria-label="Personal Library"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-surface-muted transition-colors hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
          </Link>

          {/* User Auth State */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1">
              <span
                title={user.email}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-primary/40 bg-brand-primary/10 text-xs font-bold text-brand-light"
              >
                {userInitial}
              </span>

              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-surface-muted transition-colors hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-surface-border bg-surface-card px-3 text-xs font-semibold text-foreground transition-colors hover:border-surface-muted"
            >
              <User className="h-3.5 w-3.5 text-brand-light" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
