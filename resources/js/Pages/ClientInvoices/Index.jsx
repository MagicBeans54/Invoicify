import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ClientLayout from '@/components/ClientLayout';
import InvoiceSummaryCards from '@/components/InvoiceSummaryCards';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function ClientIndex({ invoices }) {
    return (
        <>
            <Head title="My Invoices" />
            <ClientLayout title="My Invoices">
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No invoices found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            You don't have any invoices yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <InvoiceSummaryCards invoices={invoices} />
                        <div className="rounded-lg border bg-card">
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
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice_number}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(invoice.invoice_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            ₱{parseFloat(invoice.total).toFixed(2)}
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
                                                <Link href={route('client.invoices.show', invoice.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    </>
                )}
            </ClientLayout>
        </>
    );
}
