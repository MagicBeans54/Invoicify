import * as React from 'react';
import {
    CircleCheck,
    CircleDashed,
    CircleX,
    Clock5,
    FileEdit,
    Send,
    TriangleAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Single tone map — statuses alias into these instead of repeating
// identical class strings (paid≡approved, draft≡expired).
const TONE_SUCCESS = 'bg-success/10 text-success ring-success/25';
const TONE_INFO =
    'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-300/25';
const TONE_MUTED =
    'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-300/25';
const TONE_NEUTRAL =
    'bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-neutral-400/10 dark:text-neutral-300 dark:ring-neutral-300/20';
const TONE_WARNING =
    'bg-warning/10 text-warning ring-warning/25';
const TONE_DANGER =
    'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-300/25';

const STATUS_CONFIG = {
    // Invoices
    paid: {
        label: 'Paid',
        icon: CircleCheck,
        className: TONE_SUCCESS,
    },
    approved: {
        label: 'Approved',
        icon: CircleCheck,
        className: TONE_SUCCESS,
    },
    sent: {
        label: 'Sent',
        icon: Send,
        className: TONE_INFO,
    },
    pending: {
        label: 'Pending',
        icon: CircleDashed,
        spin: true,
        className: TONE_MUTED,
    },
    draft: {
        label: 'Draft',
        icon: FileEdit,
        className: TONE_NEUTRAL,
    },
    overdue: {
        label: 'Overdue',
        icon: TriangleAlert,
        className: TONE_WARNING,
    },
    rejected: {
        label: 'Rejected',
        icon: CircleX,
        className: TONE_DANGER,
    },
    expired: {
        label: 'Expired',
        icon: Clock5,
        className: TONE_NEUTRAL,
    },
} as const;

export type StatusBadgeStatus = keyof typeof STATUS_CONFIG | (string & {});

function getStatusEntry(status: string) {
    const key = (status || '').toLowerCase();
    return (
        (STATUS_CONFIG as Record<string, (typeof STATUS_CONFIG)['paid']>)[key] ?? {
            label: status.charAt(0).toUpperCase() + status.slice(1),
            icon: Clock5,
            className: TONE_NEUTRAL,
        }
    );
}

export function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const { label, icon: Icon, className: tone, spin } = getStatusEntry(status);

    return (
        <span
            role="status"
            className={cn(
                'inline-flex select-none items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium leading-none ring-1 ring-inset',
                tone,
                className
            )}
        >
            <Icon
                className={cn(
                    'size-3.5 shrink-0',
                    spin && 'animate-spin [animation-duration:3s] motion-reduce:animate-none'
                )}
                strokeWidth={2.25}
                aria-hidden="true"
            />
            {label}
        </span>
    );
}

export default StatusBadge;
