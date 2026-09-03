import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import AppLayout from '@/components/AppLayout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const badgeVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

const columnHelper = createColumnHelper();

function formatAmount(value) {
    return `₱${parseFloat(value).toFixed(2)}`;
}

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : '';
}

function friendlyMethod(method) {
    return (method || '').replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

const columns = [
    columnHelper.accessor('id', {
        header: 'Payment ID',
        cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
    }),
    columnHelper.accessor('user.name', {
        header: 'Client',
        cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('invoice.invoice_number', {
        header: 'Invoice',
        cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => <span className="tabular-nums">{formatAmount(info.getValue())}</span>,
        meta: { align: 'right' },
    }),
    columnHelper.accessor('payment_date', {
        header: 'Date',
        cell: (info) => (
            <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('payment_method', {
        header: 'Method',
        cell: (info) => (
            <span className="text-muted-foreground">{friendlyMethod(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
            const status = info.getValue();
            return (
                <Badge variant={badgeVariant[status] ?? 'outline'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    }),
    columnHelper.accessor('id', {
        header: '',
        enableSorting: false,
        cell: (info) => (
            <div className="text-right">
                <Button asChild variant="ghost" size="sm" className="-mr-2">
                    <Link href={route('admin.payments.show', info.getValue())}>Review</Link>
                </Button>
            </div>
        ),
        meta: { align: 'right' },
    }),
];

export default function AdminPaymentIndex({ payments }) {
    return (
        <>
            <Head title="Payment Review" />
            <AppLayout title="Payment Review">
                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No payments to review</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            No payment submissions have been made yet.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={payments}
                        searchPlaceholder="Search payments…"
                    />
                )}
            </AppLayout>
        </>
    );
}