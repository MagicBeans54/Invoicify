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

function StatCard({ label, value, sub, icon: Icon, tone, index }) {
    const reduce = useReducedMotion();
    const display = useAnimatedNumber(value.raw, value.format);

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            whileHover={reduce ? undefined : { y: -2 }}
            transition={
                reduce ? { duration: 0.15 } : { duration: 0.4, delay: index * 0.06, ease: 'easeOut' }
            }
            className="rounded-xl transition-shadow duration-200 hover:shadow-md"
        >
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-center gap-2.5">
                        <span className={cn('flex size-8 items-center justify-center rounded-lg', tone)}>
                            <Icon className="size-4" />
                        </span>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                        {display}
                    </p>
                    {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function InvoiceSummaryCards({ invoices }) {
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
            value: { raw: sum(['sent', 'overdue']), format: formatPeso },
            sub: 'Sent + overdue, awaiting payment',
            icon: Wallet,
            tone: 'bg-primary/10 text-primary',
        },
        {
            label: 'Overdue',
            value: { raw: sum(['overdue']), format: formatPeso },
            sub: `${overdueCount} invoice${overdueCount === 1 ? '' : 's'} past due`,
            icon: AlertTriangle,
            tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Collected',
            value: { raw: sum(['paid']), format: formatPeso },
            sub: 'Paid invoices, all time',
            icon: CircleCheck,
            tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Drafts',
            value: { raw: draftCount, format: (v) => `${Math.round(v)}` },
            sub: 'Not yet sent',
            icon: FileEdit,
            tone: 'bg-muted text-muted-foreground',
        },
    ];

    return (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
                <StatCard key={card.label} {...card} index={index} />
            ))}
        </div>
    );
}
