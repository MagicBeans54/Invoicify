import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import {
    PaymentAdditionalInfoCard,
    PaymentDetailsCard,
} from '@/components/PaymentDetailCards';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Separator } from '@/components/ui/separator';
import { Check, X } from 'lucide-react';
import { formatPeso } from '@/lib/invoices';

export default function AdminPaymentShow({ payment }) {
    const [showRejectForm, setShowRejectForm] = useState(false);

    const approveForm = useForm({
        admin_notes: '',
    });

    const rejectForm = useForm({
        admin_notes: '',
    });

    const handleApprove = (e) => {
        e.preventDefault();
        approveForm.post(route('admin.payments.approve', payment.id));
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('admin.payments.reject', payment.id));
    };

    const isPending = payment.status === 'pending';
    const amount = Number(payment.amount) || 0;
    const paid = Number(payment.invoice?.paid_amount) || 0;
    const remainingIfApproved = Math.max(
        0,
        (Number(payment.invoice?.total) || 0) - paid - amount
    );

    return (
        <>
            <Head title={`Review Payment #${payment.id}`} />
            <AppLayout
                title={`Review Payment #${payment.id}`}
                actions={<StatusBadge status={payment.status} />}
            >
                <div className="grid items-start gap-6 md:grid-cols-2">
                    <PaymentDetailsCard
                        payment={payment}
                        invoiceHref={
                            payment.invoice
                                ? route('invoices.show', payment.invoice.id)
                                : undefined
                        }
                    />
                    <PaymentAdditionalInfoCard payment={payment} />
                </div>

                {isPending && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Review Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg bg-muted/50 p-4 text-sm">
                                <p>
                                    Approving{' '}
                                    <span className="font-display font-semibold tabular-nums">
                                        {formatPeso(amount)}
                                    </span>{' '}
                                    toward{' '}
                                    <span className="font-medium">
                                        {payment.invoice?.invoice_number || 'this invoice'}
                                    </span>{' '}
                                    leaves{' '}
                                    <span className="font-medium tabular-nums">
                                        {formatPeso(remainingIfApproved)}
                                    </span>{' '}
                                    remaining.
                                </p>
                            </div>
                            <form onSubmit={handleApprove}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="approve_notes">Admin Notes (Optional)</Label>
                                        <AutosizeTextarea
                                            id="approve_notes"
                                            value={approveForm.data.admin_notes}
                                            onChange={(e) => approveForm.setData('admin_notes', e.target.value)}
                                            placeholder="Add any notes for approving this payment"
                                            minHeight={52}
                                            maxHeight={200}
                                        />
                                        {approveForm.errors.admin_notes && (
                                            <p role="alert" className="text-sm text-destructive">
                                                {approveForm.errors.admin_notes}
                                            </p>
                                        )}
                                    </div>
                                    <LoadingButton
                                        type="submit"
                                        loading={approveForm.processing}
                                        className="w-full"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        {approveForm.processing ? 'Approving…' : 'Approve Payment'}
                                    </LoadingButton>
                                </div>
                            </form>

                            <Separator />

                            <div>
                                {!showRejectForm ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowRejectForm(true)}
                                        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject Payment
                                    </Button>
                                ) : (
                                    <form onSubmit={handleReject}>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                Rejecting returns{' '}
                                                <span className="font-medium tabular-nums">
                                                    {formatPeso(amount)}
                                                </span>{' '}
                                                to the client&apos;s open balance. A reason is
                                                required so they know what to fix.
                                            </p>
                                            <div className="space-y-2">
                                                <Label htmlFor="reject_notes">Rejection Reason (Required)</Label>
                                                <AutosizeTextarea
                                                    id="reject_notes"
                                                    value={rejectForm.data.admin_notes}
                                                    onChange={(e) => rejectForm.setData('admin_notes', e.target.value)}
                                                    placeholder="Please provide a reason for rejection"
                                                    minHeight={52}
                                                    maxHeight={200}
                                                    required
                                                />
                                                {rejectForm.errors.admin_notes && (
                                                    <p role="alert" className="text-sm text-destructive">
                                                        {rejectForm.errors.admin_notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <LoadingButton
                                                    type="submit"
                                                    variant="destructive"
                                                    loading={rejectForm.processing}
                                                    className="flex-1"
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    {rejectForm.processing ? 'Rejecting…' : 'Confirm Reject'}
                                                </LoadingButton>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowRejectForm(false);
                                                        rejectForm.setData('admin_notes', '');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-6 flex justify-start">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={route('admin.payments.index')}>
                            Back to payment review
                        </Link>
                    </Button>
                </div>
            </AppLayout>
        </>
    );
}
