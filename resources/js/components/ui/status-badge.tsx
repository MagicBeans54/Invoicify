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

const STATUS_CONFIG = {
    // Invoices
    paid: {
        label: 'Paid',
        icon: CircleCheck,
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-300/25',
    },
    approved: {
        label: 'Approved',
        icon: CircleCheck,
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-300/25',
    },
    sent: {
        label: 'Sent',
        icon: Send,
        className:
            'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-300/25',
    },
    pending: {
        label: 'Pending',
        icon: CircleDashed,
        spin: true,
        className:
            'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-300/25',
    },
    draft: {
        label: 'Draft',
        icon: FileEdit,
        className:
            'bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-neutral-400/10 dark:text-neutral-300 dark:ring-neutral-300/20',
    },
    overdue: {
        label: 'Overdue',
        icon: TriangleAlert,
        className:
            'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-300/25',
    },
    rejected: {
        label: 'Rejected',
        icon: CircleX,
        className:
            'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-300/25',
    },
    expired: {
        label: 'Expired',
        icon: Clock5,
        className:
            'bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-neutral-400/10 dark:text-neutral-300 dark:ring-neutral-300/20',
    },
} as const;

export type StatusBadgeStatus = keyof typeof STATUS_CONFIG | (string & {});

function getStatusEntry(status: string) {
    const key = (status || '').toLowerCase();
    return (
        (STATUS_CONFIG as Record<string, (typeof STATUS_CONFIG)['paid']>)[key] ?? {
            label: status.charAt(0).toUpperCase() + status.slice(1),
            icon: Clock5,
            className:
                'bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-neutral-400/10 dark:text-neutral-300 dark:ring-neutral-300/20',
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
