import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import ClientLayout from '@/components/ClientLayout';
import DataTable from '@/components/DataTable';
import InvoiceSummaryCards from '@/components/InvoiceSummaryCards';
import InvoiceStatusFilter from '@/components/InvoiceStatusFilter';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
    dueInfo,
    dueLabel,
    filterInvoices,
    formatInvoiceDate,
    formatPeso,
} from '@/lib/invoices';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('invoice_number', {
        header: 'Number',
        cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('invoice_date', {
        header: 'Issued',
        cell: (info) => (
            <span className="text-muted-foreground">{formatInvoiceDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('due_date', {
        header: 'Due',
        cell: (info) => {
            const invoice = info.row.original;
            const { daysOverdue, dueSoon } = dueInfo(invoice);
            if (daysOverdue > 0) {
                return (
                    <span className="block">
                        <span className="font-medium text-warning">
                            {formatInvoiceDate(info.getValue())}
                        </span>
                        <span className="mt-0.5 block text-xs font-medium text-warning">
                            {dueLabel(daysOverdue)}
                        </span>
                    </span>
                );
            }
            if (dueSoon) {
                return (
                    <span className="block">
                        <span>{formatInvoiceDate(info.getValue())}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                            Due soon
                        </span>
                    </span>
                );
            }
            return (
                <span className="text-muted-foreground">{formatInvoiceDate(info.getValue())}</span>
            );
        },
    }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: (info) => (
            <span className="tabular-nums">{formatPeso(info.getValue())}</span>
        ),
        meta: { align: 'right' },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('id', {
        header: '',
        enableSorting: false,
        cell: (info) => (
            <div className="text-right">
                <Button asChild variant="ghost" size="sm" className="-mr-2">
                    <Link href={route('client.invoices.show', info.getValue())}>View</Link>
                </Button>
            </div>
        ),
        meta: { align: 'right' },
    }),
];

export default function ClientIndex({ invoices }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const counts = useMemo(() => {
        const list = invoices || [];
        return {
            all: list.length,
            outstanding: list.filter((inv) => ['sent', 'overdue'].includes(inv.status)).length,
            draft: list.filter((inv) => inv.status === 'draft').length,
            sent: list.filter((inv) => inv.status === 'sent').length,
            overdue: list.filter((inv) => inv.status === 'overdue').length,
            paid: list.filter((inv) => inv.status === 'paid').length,
        };
    }, [invoices]);

    const filtered = useMemo(
        () => filterInvoices(invoices, statusFilter),
        [invoices, statusFilter]
    );

    return (
        <>
            <Head title="My Invoices" />
            <ClientLayout title="My Invoices">
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No invoices found</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            You don&apos;t have any invoices yet. New invoices
                            from your provider will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        <InvoiceSummaryCards
                            invoices={invoices}
                            activeFilter={statusFilter}
                            onFilter={setStatusFilter}
                        />
                        <div className="mb-4">
                            <InvoiceStatusFilter
                                value={statusFilter}
                                onChange={setStatusFilter}
                                counts={counts}
                            />
                        </div>
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <p className="text-sm font-medium">No invoices match this filter</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Try a different status, or clear the filter.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setStatusFilter('all')}
                                >
                                    Clear filter
                                </Button>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filtered}
                                searchPlaceholder="Search invoices…"
                                getRowClassName={(row) =>
                                    dueInfo(row).daysOverdue > 0
                                        ? 'bg-warning/[0.07]'
                                        : undefined
                                }
                            />
                        )}
                    </>
                )}
            </ClientLayout>
        </>
    );
}
