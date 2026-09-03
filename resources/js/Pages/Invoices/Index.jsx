import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import AppLayout from '@/components/AppLayout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const badgeVariant = {
    paid: 'default',
    sent: 'secondary',
    overdue: 'destructive',
    draft: 'outline',
};

const columnHelper = createColumnHelper();

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : '';
}

const columns = [
    columnHelper.accessor('invoice_number', {
        header: 'Number',
        cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('client_name', {
        header: 'Client',
    }),
    columnHelper.accessor('invoice_date', {
        header: 'Issued',
        cell: (info) => (
            <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('due_date', {
        header: 'Due',
        cell: (info) => (
            <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: (info) => (
            <span className="tabular-nums">₱{parseFloat(info.getValue()).toFixed(2)}</span>
        ),
        meta: { align: 'right' },
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
                    <Link href={route('invoices.show', info.getValue())}>View</Link>
                </Button>
            </div>
        ),
        meta: { align: 'right' },
    }),
];

export default function Index({ invoices }) {
    return (
        <>
            <Head title="Invoices" />
            <AppLayout title="Invoices">
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No invoices yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create invoices from the Clients page to get started.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={invoices}
                        searchPlaceholder="Search invoices…"
                    />
                )}
            </AppLayout>
        </>
    );
}
