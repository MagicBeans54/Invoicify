import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Download, Check, X } from 'lucide-react';
import SpecularButton from '@/components/ui/SpecularButton';

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
                                    ₱{payment.invoice ? parseFloat(payment.invoice.total).toFixed(2) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Amount:</span>
                                <span className="font-medium">
                                    ₱{parseFloat(payment.amount).toFixed(2)}
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
                                <StatusBadge status={payment.status} />
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
                            <form onSubmit={handleApprove}>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="approve_notes">Admin Notes (Optional)</Label>
                                        <AutosizeTextarea
                                            id="approve_notes"
                                            value={approveForm.data.admin_notes}
                                            onChange={(e) => approveForm.setData('admin_notes', e.target.value)}
                                            placeholder="Add any notes for approving this payment"
                                            minHeight={52}
                                            maxHeight={200}
                                        />
                                    </div>
                                    <SpecularButton
                                        type="submit"
                                        disabled={approveForm.processing}
                                        size="lg"
                                        radius={18}
                                        tint="#00b1f7fc"
                                        tintOpacity={0}
                                        blur={0}
                                        textColor="#00c832"
                                        lineColor="#22cc00"
                                        baseColor="#00f8d7"
                                        intensity={2}
                                        shineSize={10}
                                        shineFade={40}
                                        thickness={2}
                                        speed={0.5}
                                        followMouse
                                        proximity={250}
                                        autoAnimate={false}
                                        className="w-full"
                                    >
                                        <div className="flex items-center">
                                            <Check className="mr-2 h-4 w-4" />
                                            {approveForm.processing ? 'Approving...' : 'Approve Payment'}
                                        </div>
                                    </SpecularButton>
                                </div>
                            </form>

                            <div className="pt-4">
                                {!showRejectForm ? (
                                    <SpecularButton
                                        onClick={() => setShowRejectForm(true)}
                                        size="lg"
                                        radius={18}
                                        tint="#ffffff"
                                        tintOpacity={0}
                                        blur={0}
                                        textColor="#ff0000"
                                        lineColor="#ff4444"
                                        baseColor="#8b0000"
                                        intensity={2}
                                        shineSize={10}
                                        shineFade={40}
                                        thickness={2}
                                        speed={0.5}
                                        followMouse
                                        proximity={250}
                                        autoAnimate={false}
                                        className="w-full"
                                    >
                                        <div className="flex items-center">
                                            <X className="mr-2 h-4 w-4" />
                                            Reject Payment
                                        </div>
                                    </SpecularButton>
                                ) : (
                                    <form onSubmit={handleReject}>
                                        <div className="space-y-4">
                                            <div>
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
                                            </div>
                                            <div className="flex gap-2">
                                                <SpecularButton
                                                    type="submit"
                                                    disabled={rejectForm.processing}
                                                    size="lg"
                                                    radius={18}
                                                    tint="#ffffff"
                                                    tintOpacity={0}
                                                    blur={0}
                                                    textColor="#f5f5f5"
                                                    lineColor="#ff4444"
                                                    baseColor="#8b0000"
                                                    intensity={1}
                                                    shineSize={10}
                                                    shineFade={40}
                                                    thickness={1}
                                                    speed={0.35}
                                                    followMouse
                                                    proximity={250}
                                                    autoAnimate={false}
                                                    className="flex-1"
                                                >
                                                    <div className="flex items-center">
                                                        <X className="mr-2 h-4 w-4" />
                                                        {rejectForm.processing ? 'Rejecting...' : 'Confirm Reject'}
                                                    </div>
                                                </SpecularButton>
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
            </AppLayout>
        </>
    );
}