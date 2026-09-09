import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Download, Plus } from 'lucide-react';
import ClientLayout from '@/components/ClientLayout';
import InvoiceDocument from '@/components/InvoiceDocument';
import { Button } from '@/components/ui/button';
import { ShareMenu } from '@/components/ShareMenu';

export default function ClientShow({ invoice }) {
    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <ClientLayout
                title={invoice.invoice_number}
                subtitle={
                    invoice.contract_number
                        ? `Contract: ${invoice.contract_number}`
                        : undefined
                }
            >
                <InvoiceDocument invoice={invoice} />

                <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                    {invoice.status !== 'paid' && (
                        <Button asChild variant="default" size="sm">
                            <Link href={route('client.payments.create', { invoice_id: invoice.id })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Make Payment
                            </Link>
                        </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                        <a href={route('client.invoices.pdf', invoice.id)}>
                            <Download />
                            Download PDF
                        </a>
                    </Button>
                    <ShareMenu
                        label={`Share ${invoice.invoice_number}`}
                        copyValue={`${window.location.origin}${route('client.invoices.pdf', invoice.id)}`}
                        actions={[
                            {
                                icon: <Download size={13} />,
                                label: 'Download PDF',
                                onSelect: () =>
                                    window.open(route('client.invoices.pdf', invoice.id), '_blank'),
                            },
                        ]}
                    />
                </div>
            </ClientLayout>
        </>
    );
}
