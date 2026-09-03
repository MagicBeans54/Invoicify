import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import AppLayout from '@/components/AppLayout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => <span className="text-muted-foreground">{info.getValue() || '-'}</span>,
    }),
    columnHelper.accessor('invoices_count', {
        header: 'Invoices',
        cell: (info) => (
            <Badge variant="outline">{info.getValue() || 0} invoices</Badge>
        ),
    }),
    columnHelper.accessor('id', {
        header: '',
        enableSorting: false,
        cell: (info) => (
            <div className="text-right">
                <Button asChild variant="ghost" size="sm" className="-mr-2">
                    <Link href={route('clients.show', info.getValue())}>View</Link>
                </Button>
            </div>
        ),
        meta: { align: 'right' },
    }),
];

export default function Index({ clients }) {
    return (
        <>
            <Head title="Clients" />
            <AppLayout title="Clients">
                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No clients yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Clients will appear here when they register for accounts.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={clients}
                        searchPlaceholder="Search clients…"
                    />
                )}
            </AppLayout>
        </>
    );
}
