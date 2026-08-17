import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
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

const statusColors = {
    paid: 'bg-green-500/10 text-green-700',
    sent: 'bg-primary/10 text-primary',
    overdue: 'bg-red-500/10 text-red-700',
    draft: 'bg-muted text-muted-foreground',
};

export default function Index({ invoices }) {
    return (
        <div className="min-h-screen bg-background py-8">
            <Head title="Invoices" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
                    <Button asChild>
                        <Link href={route('invoices.create')}>+ Create Invoice</Link>
                    </Button>
                </div>

                {invoices.length === 0 ? (
                    <div className="border border-border rounded-lg p-12 text-center bg-card">
                        <p className="text-lg text-muted-foreground">No invoices found</p>
                        <Button asChild variant="link" className="mt-4">
                            <Link href={route('invoices.create')}>Create your first invoice</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="border border-border rounded-lg overflow-hidden bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice_number}
                                        </TableCell>
                                        <TableCell>{invoice.client_name}</TableCell>
                                        <TableCell>
                                            {new Date(invoice.invoice_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${parseFloat(invoice.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={statusColors[invoice.status] ?? statusColors.draft}
                                            >
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-x-2">
                                                <Button asChild variant="link" className="p-0 h-auto">
                                                    <Link href={route('invoices.show', invoice.id)}>View</Link>
                                                </Button>
                                                <Button asChild variant="link" className="p-0 h-auto">
                                                    <Link href={route('invoices.edit', invoice.id)}>Edit</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}