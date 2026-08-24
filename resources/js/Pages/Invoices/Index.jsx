import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const badgeVariant = {
    paid: 'default',
    sent: 'secondary',
    overdue: 'destructive',
    draft: 'outline',
};

export default function Index({ invoices }) {
    return (
        <>
            <Head title="Invoices" />
            <AppLayout
                title="Invoices"
                actions={
                    <Button asChild size="sm">
                        <Link href={route('invoices.create')}>
                            <Plus />
                            New Invoice
                        </Link>
                    </Button>
                }
            >
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No invoices yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first invoice to get started.
                        </p>
                        <Button asChild variant="outline" size="sm" className="mt-4">
                            <Link href={route('invoices.create')}>New Invoice</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Issued</TableHead>
                                    <TableHead>Due</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice_number}
                                        </TableCell>
                                        <TableCell>{invoice.client_name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(invoice.invoice_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            ${parseFloat(invoice.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={badgeVariant[invoice.status] ?? 'outline'}
                                            >
                                                {invoice.status.charAt(0).toUpperCase() +
                                                    invoice.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="-mr-2"
                                            >
                                                <Link href={route('invoices.show', invoice.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
