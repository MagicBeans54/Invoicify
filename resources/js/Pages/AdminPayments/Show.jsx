import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, Check, X } from 'lucide-react';

const badgeVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

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
        const formData = new FormData();
        formData.append('admin_notes', approveForm.data.admin_notes);
        approveForm.post(route('admin.payments.approve', payment.id), formData);
    };

    const handleReject = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('admin_notes', rejectForm.data.admin_notes);
        rejectForm.post(route('admin.payments.reject', payment.id), formData);
    };

    const isPending = payment.status === 'pending';

    return (
        <>
            <Head title={`Review Payment #${payment.id}`} />
            <AppLayout title={`Review Payment #${payment.id}`}>
                <div className="mb-4">
                    <Button asChild variant="ghost">
                        <Link href={route('admin.payments.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment ID:</span>
                                <span className="font-medium">#{payment.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Client:</span>
                                <span className="font-medium">{payment.user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Client Email:</span>
                                <span className="font-medium">{payment.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Invoice:</span>
                                <span className="font-medium">
                                    {payment.invoice?.invoice_number || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Invoice Total:</span>
                                <span className="font-medium">
                                    ${payment.invoice ? parseFloat(payment.invoice.total).toFixed(2) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Amount:</span>
                                <span className="font-medium">
                                    ${parseFloat(payment.amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Date:</span>
                                <span className="font-medium">
                                    {new Date(payment.payment_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span className="font-medium">
                                    {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                            {payment.reference_number && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference Number:</span>
                                    <span className="font-medium">{payment.reference_number}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={badgeVariant[payment.status] ?? 'outline'}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                            </div>
                            {payment.admin_reviewed_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reviewed On:</span>
                                    <span className="font-medium">
                                        {new Date(payment.admin_reviewed_at).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {payment.client_notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Client Notes:</span>
                                    <p className="mt-1 text-sm">{payment.client_notes}</p>
                                </div>
                            )}
                            {payment.receipt_file && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Receipt:</span>
                                    <div className="mt-2">
                                        <Button asChild variant="outline" size="sm">
                                            <a
                                                href={`/storage/${payment.receipt_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                View Receipt
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {payment.admin_notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Admin Notes:</span>
                                    <p className="mt-1 text-sm">{payment.admin_notes}</p>
                                </div>
                            )}
                            {!payment.client_notes && !payment.admin_notes && !payment.receipt_file && (
                                <p className="text-sm text-muted-foreground">No additional information available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {isPending && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Review Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <form onSubmit={handleApprove} className="flex-1">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="approve_notes">Admin Notes (Optional)</Label>
                                            <Textarea
                                                id="approve_notes"
                                                value={approveForm.data.admin_notes}
                                                onChange={(e) => approveForm.setData('admin_notes', e.target.value)}
                                                placeholder="Add any notes for approving this payment"
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={approveForm.processing}
                                            className="w-full"
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            {approveForm.processing ? 'Approving...' : 'Approve Payment'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="flex-1">
                                    {!showRejectForm ? (
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowRejectForm(true)}
                                            className="w-full"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Reject Payment
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleReject}>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="reject_notes">Rejection Reason (Required)</Label>
                                                    <Textarea
                                                        id="reject_notes"
                                                        value={rejectForm.data.admin_notes}
                                                        onChange={(e) => rejectForm.setData('admin_notes', e.target.value)}
                                                        placeholder="Please provide a reason for rejection"
                                                        rows={2}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                        disabled={rejectForm.processing}
                                                        className="flex-1"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        {rejectForm.processing ? 'Rejecting...' : 'Confirm Reject'}
                                                    </Button>
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
                            </div>
                        </CardContent>
                    </Card>
                )}
            </AppLayout>
        </>
    );
}