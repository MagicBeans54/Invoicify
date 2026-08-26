import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ClientLayout from '@/components/ClientLayout';
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
import { Plus } from 'lucide-react';

const badgeVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

export default function ClientPaymentIndex({ payments }) {
    return (
        <>
            <Head title="My Payments" />
            <ClientLayout title="My Payments">
                <div className="mb-4 flex justify-end">
                    <Button asChild>
                        <Link href={route('client.payments.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Payment
                        </Link>
                    </Button>
                </div>

                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No payments found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            You haven't submitted any payments yet.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            {payment.invoice?.invoice_number || 'N/A'}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            ₱{parseFloat(payment.amount).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={badgeVariant[payment.status] ?? 'outline'}
                                            >
                                                {payment.status.charAt(0).toUpperCase() +
                                                    payment.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="-mr-2"
                                            >
                                                <Link href={route('client.payments.show', payment.id)}>
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
            </ClientLayout>
        </>
    );
}