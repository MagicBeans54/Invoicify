import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ClientLayout from '@/components/ClientLayout';
import {
    PaymentAdditionalInfoCard,
    PaymentDetailsCard,
} from '@/components/PaymentDetailCards';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

export default function ClientPaymentShow({ payment }) {
    return (
        <>
            <Head title={`Payment #${payment.id}`} />
            <ClientLayout
                title={`Payment #${payment.id}`}
                actions={<StatusBadge status={payment.status} />}
            >
                <div className="grid items-start gap-6 md:grid-cols-2">
                    <PaymentDetailsCard
                        payment={payment}
                        invoiceHref={
                            payment.invoice
                                ? route('client.invoices.show', payment.invoice.id)
                                : undefined
                        }
                    />
                    <PaymentAdditionalInfoCard payment={payment} />
                </div>

                <div className="mt-6 flex justify-start">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={route('client.payments.index')}>
                            Back to my payments
                        </Link>
                    </Button>
                </div>
            </ClientLayout>
        </>
    );
}
