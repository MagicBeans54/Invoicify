import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
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
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

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
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment ID</TableHead>
                                    <TableHead>Client</TableHead>
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
                                        <TableCell className="font-medium">#{payment.id}</TableCell>
                                        <TableCell>{payment.user?.name || 'N/A'}</TableCell>
                                        <TableCell>
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
                                                <Link href={route('admin.payments.show', payment.id)}>
                                                    Review
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