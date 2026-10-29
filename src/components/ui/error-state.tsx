import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load manhwa data. Please check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-status-dropped/30 bg-status-dropped/5 p-8 text-center sm:p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-status-dropped/10 text-status-dropped">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-surface-muted leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface-border active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
