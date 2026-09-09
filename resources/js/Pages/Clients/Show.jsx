import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    dueInfo,
    dueLabel,
    formatInvoiceDate,
    formatPeso,
} from '@/lib/invoices';

export default function Show({ client }) {
    const formatDate = formatInvoiceDate;
    const formatCurrency = formatPeso;

    return (
        <>
            <Head title={'Client: ' + client.name} />
            <AppLayout
                title={client.name}
                subtitle={client.email}
                actions={
                    <Button asChild size="sm">
                        <Link href={route('invoices.create', client.id)}>
                            <Plus />
                            New Invoice
                        </Link>
                    </Button>
                }
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Contact Information
                                </p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-medium">Email:</span> {client.email}
                                    </p>
                                    {client.phone && (
                                        <p className="text-sm">
                                            <span className="font-medium">Phone:</span> {client.phone}
                                        </p>
                                    )}
                                    {client.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span> {client.address}
                                        </p>
                                    )}
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Profile details are managed by the client&apos;s own
                                    account and update here when they change them.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Invoices</h3>
                            <Badge variant="outline">
                                {client.invoices ? client.invoices.length : 0} total
                            </Badge>
                        </div>

                        {!client.invoices || client.invoices.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <p className="text-sm text-muted-foreground">No invoices yet</p>
                                <Button asChild size="sm" className="mt-4">
                                    <Link href={route('invoices.create', client.id)}>
                                        <Plus />
                                        New Invoice
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Number</TableHead>
                                        <TableHead>Issued</TableHead>
                                        <TableHead>Due</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.invoices.map((invoice) => {
                                        const { daysOverdue } = dueInfo(invoice);
                                        return (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                {invoice.invoice_number}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(invoice.invoice_date)}
                                            </TableCell>
                                            <TableCell>
                                                {daysOverdue > 0 ? (
                                                    <span className="block">
                                                        <span className="font-medium text-amber-700 dark:text-amber-300">
                                                            {formatDate(invoice.due_date)}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs font-medium text-amber-700 dark:text-amber-300">
                                                            {dueLabel(daysOverdue)}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        {formatDate(invoice.due_date)}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {formatCurrency(invoice.total)}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={invoice.status} />
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
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </AppLayout>
        </>
    );
}
