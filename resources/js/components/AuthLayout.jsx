import React from 'react';
import { Head } from '@inertiajs/react';
import { InvoicifyMark } from '@/components/InvoicifyLogo';

/**
 * Static invoice-paper brand moment: a calm, decorative preview of the
 * product story (draft → sent → paid) instead of a heavyweight 3D logo.
 * Zero CDN, zero JS animation, hidden from assistive tech.
 */
function InvoiceArtifact() {
    return (
        <div
            aria-hidden="true"
            className="mb-8 w-64 -rotate-2 rounded-xl bg-white p-4 text-left shadow-2xl xl:w-72"
        >
            <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-bold tracking-tight text-neutral-900">
                    INV-001-2026-09-09
                </span>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Sent
                </span>
            </div>
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="h-2 w-2/3 rounded-full bg-neutral-200" />
                    <span className="text-[10px] font-medium tabular-nums text-neutral-500">
                        ₱12.00
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="h-2 w-1/2 rounded-full bg-neutral-200" />
                    <span className="text-[10px] font-medium tabular-nums text-neutral-500">
                        ₱11.00
                    </span>
                </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2 border-t-2 border-[#006B54] pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Total due
                </span>
                <span className="text-sm font-bold tabular-nums text-neutral-900">
                    ₱23.00
                </span>
            </div>
        </div>
    );
}

export default function AuthLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen bg-background">
                <aside className="relative hidden w-1/3 shrink-0 overflow-hidden bg-gradient-to-br from-[#071A12] to-[#00553F] lg:block">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_65%)]"
                    />
                    <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center text-white xl:px-10">
                        <InvoiceArtifact />
                        <div className="mb-4 flex items-center gap-2.5">
                            <InvoicifyMark className="size-8 text-white" />
                            <span className="font-display text-[32px] font-bold leading-tight">
                                Invoicify
                            </span>
                        </div>
                        <p className="max-w-sm text-[15px] font-medium leading-[1.7] text-white">
                            Professional invoicing — create, send, and track
                            invoices with live totals and PDF delivery.
                        </p>
                    </div>
                </aside>
                <main className="flex flex-1 items-center justify-center p-4 py-10 sm:p-8">
                    <div className="w-full max-w-md">{children}</div>
                </main>
            </div>
        </>
    );
}
