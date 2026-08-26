import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ArrowLeft, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

export default function Show({ client }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return '₱' + parseFloat(amount).toFixed(2);
    };

    return (
        <>
            <Head title={'Client: ' + client.name} />
            <AppLayout
                title={
                    <span className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon-sm" className="-ml-2">
                            <Link href={route('clients.index')}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <div className="flex flex-col">
                            <span>{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                        </div>
                    </span>
                }
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
                            <div className="text-center py-8 text-muted-foreground">
                                No invoices yet
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
                                    {client.invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                {invoice.invoice_number}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(invoice.invoice_date)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(invoice.due_date)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {formatCurrency(invoice.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={badgeVariant[invoice.status] || 'outline'}
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
                        )}
                    </CardContent>
                </Card>
            </AppLayout>
        </>
    );
}
