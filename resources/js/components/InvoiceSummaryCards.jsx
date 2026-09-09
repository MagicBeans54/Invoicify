import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CircleCheck, FileEdit, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPeso(value) {
    return `₱${Number(value || 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function useAnimatedNumber(target, format) {
    const reduce = useReducedMotion();
    const [display, setDisplay] = useState(() => format(target));
    const prevRef = useRef(target);

    useEffect(() => {
        if (reduce) {
            setDisplay(format(target));
            prevRef.current = target;
            return;
        }
        const controls = animate(prevRef.current, target, {
            duration: 0.7,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(format(v)),
        });
        prevRef.current = target;
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, reduce]);

    return display;
}

function StatCard({ label, value, sub, icon: Icon, tone, index, filterValue, isActive, onSelect }) {
    const reduce = useReducedMotion();
    const display = useAnimatedNumber(value.raw, value.format);

    const body = (
        <Card
            className={cn(
                onSelect && 'transition-shadow duration-200 hover:shadow-md',
                isActive && 'ring-2 ring-ring'
            )}
        >
            <CardContent className="p-5">
                <div className="flex items-center gap-2.5">
                    <span className={cn('flex size-8 items-center justify-center rounded-lg', tone)}>
                        <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                </div>
                <p className="mt-3 font-display text-2xl font-semibold tracking-tight tabular-nums">
                    {display}
                </p>
                {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
            </CardContent>
        </Card>
    );

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            whileHover={reduce || !onSelect ? undefined : { y: -2 }}
            transition={
                reduce ? { duration: 0.15 } : { duration: 0.4, delay: index * 0.06, ease: 'easeOut' }
            }
            className="rounded-xl"
        >
            {onSelect ? (
                <button
                    type="button"
                    onClick={() => onSelect(filterValue)}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${label}`}
                    className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {body}
                </button>
            ) : (
                body
            )}
        </motion.div>
    );
}

export default function InvoiceSummaryCards({ invoices, activeFilter, onFilter }) {
    const list = invoices || [];
    const sum = (statuses) =>
        list.filter((inv) => statuses.includes(inv.status)).reduce((total, inv) => {
            const amount = parseFloat(inv.total);
            return total + (Number.isNaN(amount) ? 0 : amount);
        }, 0);
    const count = (statuses) => list.filter((inv) => statuses.includes(inv.status)).length;

    const overdueCount = count(['overdue']);
    const draftCount = count(['draft']);

    const cards = [
        {
            label: 'Outstanding',
            filterValue: 'outstanding',
            value: { raw: sum(['sent', 'overdue']), format: formatPeso },
            sub: 'Sent + overdue, awaiting payment',
            icon: Wallet,
            tone: 'bg-primary/10 text-primary-ink dark:text-primary',
        },
        {
            label: 'Overdue',
            filterValue: 'overdue',
            value: { raw: sum(['overdue']), format: formatPeso },
            sub: `${overdueCount} invoice${overdueCount === 1 ? '' : 's'} past due`,
            icon: AlertTriangle,
            tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
        },
        {
            label: 'Collected',
            filterValue: 'paid',
            value: { raw: sum(['paid']), format: formatPeso },
            sub: 'Paid invoices, all time',
            icon: CircleCheck,
            tone: 'bg-success/10 text-success',
        },
        {
            label: 'Drafts',
            filterValue: 'draft',
            value: { raw: draftCount, format: (v) => `${Math.round(v)}` },
            sub: 'Not yet sent',
            icon: FileEdit,
            tone: 'bg-muted text-muted-foreground',
        },
    ];

    const handleSelect = onFilter
        ? (filterValue) =>
              onFilter(activeFilter === filterValue ? 'all' : filterValue)
        : undefined;

    return (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
                <StatCard
                    key={card.label}
                    {...card}
                    index={index}
                    isActive={activeFilter === card.filterValue}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}
