import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { createColumnHelper } from '@tanstack/react-table';
import { Check, Link2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { copyText } from '@/lib/clipboard';

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
        cell: (info) => {
            const count = info.getValue() || 0;
            return (
                <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
                    <Link href={route('clients.show', info.row.original.id)}>
                        {count} invoice{count === 1 ? '' : 's'}
                    </Link>
                </Button>
            );
        },
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
    const [copied, setCopied] = useState(false);

    const copyRegistrationLink = async () => {
        await copyText(`${window.location.origin}${route('register')}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="Clients" />
            <AppLayout title="Clients">
                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No clients yet</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Clients appear here when they register for accounts —
                            share your registration link to onboard them.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={copyRegistrationLink}
                        >
                            {copied ? (
                                <>
                                    <Check /> Copied
                                </>
                            ) : (
                                <>
                                    <Link2 /> Copy registration link
                                </>
                            )}
                        </Button>
                        <span role="status" aria-live="polite" className="sr-only">
                            {copied ? 'Registration link copied' : ''}
                        </span>
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
