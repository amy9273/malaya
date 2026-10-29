import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-card/60 p-8 text-center shadow-lg backdrop-blur-sm sm:p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated text-brand-primary shadow-inner">
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-surface-muted leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-glow/20 transition-all hover:bg-brand-glow active:scale-[0.98]"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-glow/20 transition-all hover:bg-brand-glow active:scale-[0.98]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
