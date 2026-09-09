import React from 'react';
import { Link } from '@inertiajs/react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatInvoiceDate, formatPeso } from '@/lib/invoices';
import { friendlyPaymentMethod } from '@/lib/payments';

function Row({ label, children }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{children}</span>
        </div>
    );
}

/**
 * Shared payment detail walls used by admin + client Show pages so both
 * sides read the same money story (grouped pesos, fixed-locale dates)
 * instead of two copies drifting apart.
 */
export function PaymentDetailsCard({ payment, invoiceHref }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <Row label="Payment ID">#{payment.id}</Row>
                {payment.user && (
                    <>
                        <Row label="Client">{payment.user?.name || 'N/A'}</Row>
                        <Row label="Client Email">{payment.user?.email || 'N/A'}</Row>
                    </>
                )}
                <Row label="Invoice">
                    {invoiceHref && payment.invoice ? (
                        <Link
                            href={invoiceHref}
                            className="inline-flex items-center gap-1 text-primary-ink hover:underline dark:text-primary"
                        >
                            {payment.invoice.invoice_number}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                    ) : (
                        payment.invoice?.invoice_number || 'N/A'
                    )}
                </Row>
                <Row label="Invoice Total">
                    <span className="tabular-nums">
                        {payment.invoice ? formatPeso(payment.invoice.total) : 'N/A'}
                    </span>
                </Row>
                <Row label="Payment Amount">
                    <span className="font-display font-semibold tabular-nums">
                        {formatPeso(payment.amount)}
                    </span>
                </Row>
                <Row label="Payment Date">
                    {formatInvoiceDate(payment.payment_date)}
                </Row>
                <Row label="Payment Method">
                    {friendlyPaymentMethod(payment.payment_method)}
                </Row>
                {payment.reference_number && (
                    <Row label="Reference Number">{payment.reference_number}</Row>
                )}
                <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-muted-foreground">Status</span>
                    <StatusBadge status={payment.status} />
                </div>
                {payment.admin_reviewed_at && (
                    <Row label="Reviewed On">
                        {new Date(payment.admin_reviewed_at).toLocaleString('en-PH', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </Row>
                )}
            </CardContent>
        </Card>
    );
}

export function PaymentAdditionalInfoCard({ payment }) {
    const empty =
        !payment.client_notes && !payment.admin_notes && !payment.receipt_file;
    return (
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
                {empty && (
                    <p className="text-sm text-muted-foreground">
                        No additional information available.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
