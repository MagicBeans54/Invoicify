import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import ClientLayout from '@/components/ClientLayout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Plus } from 'lucide-react';
import { formatInvoiceDate, formatPeso } from '@/lib/invoices';
import { friendlyPaymentMethod } from '@/lib/payments';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('invoice.invoice_number', {
        header: 'Invoice',
        cell: (info) => (
            <span className="font-medium">{info.getValue() || 'N/A'}</span>
        ),
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => (
            <span className="tabular-nums">{formatPeso(info.getValue())}</span>
        ),
        meta: { align: 'right' },
    }),
    columnHelper.accessor('payment_date', {
        header: 'Date',
        cell: (info) => (
            <span className="text-muted-foreground">{formatInvoiceDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('payment_method', {
        header: 'Method',
        cell: (info) => (
            <span className="text-muted-foreground">{friendlyPaymentMethod(info.getValue())}</span>
        ),
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
                    <Link href={route('client.payments.show', info.getValue())}>View</Link>
                </Button>
            </div>
        ),
        meta: { align: 'right' },
    }),
];

export default function ClientPaymentIndex({ payments }) {
    return (
        <>
            <Head title="My Payments" />
            <ClientLayout
                title="My Payments"
                actions={
                    payments.length > 0 ? (
                        <Button asChild size="sm">
                            <Link href={route('client.payments.create')}>
                                <Plus />
                                New Payment
                            </Link>
                        </Button>
                    ) : undefined
                }
            >
                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No payments found</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            You haven&apos;t submitted any payments yet. Pick an
                            outstanding invoice and submit one in seconds.
                        </p>
                        <Button asChild size="sm" className="mt-4">
                            <Link href={route('client.payments.create')}>
                                <Plus />
                                New Payment
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={payments}
                        searchPlaceholder="Search payments…"
                    />
                )}
            </ClientLayout>
        </>
    );
}
