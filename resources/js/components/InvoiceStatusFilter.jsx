import React from 'react';
import { STATUS_FILTER_OPTIONS } from '@/lib/invoices';
import { cn } from '@/lib/utils';

/**
 * Segmented status control shared by admin + client invoice indexes.
 * Single-select buttons with aria-pressed — the text label carries meaning,
 * never color alone.
 */
export default function InvoiceStatusFilter({ value, onChange, counts }) {
    return (
        <div
            role="group"
            aria-label="Filter invoices by status"
            className="flex flex-wrap gap-1.5"
        >
            {STATUS_FILTER_OPTIONS.map((option) => {
                const active = value === option.value;
                const count = counts?.[option.value];
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active
                                ? 'border-transparent bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {option.label}
                        {typeof count === 'number' && (
                            <span
                                className={cn(
                                    'rounded-md px-1 text-xs tabular-nums',
                                    active
                                        ? 'bg-black/10 dark:bg-white/10'
                                        : 'bg-muted'
                                )}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
