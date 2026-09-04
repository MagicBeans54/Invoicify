import React from 'react';
import { Head } from '@inertiajs/react';
import ClientLayout from '@/components/ClientLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function ClientPaymentShow({ payment }) {
    return (
        <>
            <Head title={`Payment #${payment.id}`} />
            <ClientLayout title={`Payment #${payment.id}`}>
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
                                <span className="text-muted-foreground">Invoice:</span>
                                <span className="font-medium">
                                    {payment.invoice?.invoice_number || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
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
                                    <span className="text-sm text-muted-foreground">Your Notes:</span>
                                    <p className="mt-1 text-sm">{payment.client_notes}</p>
                                </div>
                            )}
                            {payment.admin_notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Admin Notes:</span>
                                    <p className="mt-1 text-sm">{payment.admin_notes}</p>
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
                            {!payment.client_notes && !payment.admin_notes && !payment.receipt_file && (
                                <p className="text-sm text-muted-foreground">No additional information available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ClientLayout>
        </>
    );
}