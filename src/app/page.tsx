import { Sparkles, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-b from-surface-card to-surface-canvas p-6 shadow-2xl sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3.5 py-1 text-xs font-semibold text-brand-light">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mobile-First Webtoon OS</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Read Manhwa. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-light via-brand-primary to-purple-400 bg-clip-text text-transparent">
              Zero Distractions.
            </span>
          </h1>

          <p className="max-w-xl text-sm text-surface-muted sm:text-base leading-relaxed">
            Continuous zero-gap vertical scrolling, official MangaDex catalog streaming,
            and atomic reading progress persistence—designed for 1-hand mobile reading.
          </p>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-card/60 p-5 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-light">
            <Smartphone className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Mobile PWA Native</h2>
          <p className="text-xs text-surface-muted leading-relaxed">
            Full-screen standalone view with zero browser address bar, custom tap zones,
            and gesture zoom locking.
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-card/60 p-5 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-reading/10 text-status-reading">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Zero-Gap Strip</h2>
          <p className="text-xs text-surface-muted leading-relaxed">
            GPU-accelerated panel rendering eliminates the 3px inline image gap bug native
            to standard web readers.
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-card/60 p-5 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-complete/10 text-status-complete">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Hardened SSRF Proxy</h2>
          <p className="text-xs text-surface-muted leading-relaxed">
            Next.js proxy route with DNS private IP filtering and hotlink bypass keeps
            media fetching fast and secure.
          </p>
        </div>
      </section>

      {/* 4-State UI Demonstration & Verification Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Design System & 4-State UI Verification
          </h2>
          <span className="text-xs font-medium text-surface-muted">
            Tokens & Anti-Slop Ready
          </span>
        </div>

        {/* Skeleton Shimmer Sample */}
        <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card/40 p-4">
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider">
            1. Skeleton Shimmer State
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Empty State Sample */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider">
            2. Meaningful Empty State
          </span>
          <EmptyState
            title="Your Reading Library is Empty"
            description="Start exploring 8,800+ manhwa titles from MangaDex and bookmark your favorites."
            action={{
              label: 'Explore Manhwa Catalog (Unit 04)',
              href: '#',
            }}
          />
        </div>
      </section>
    </div>
  );
}
