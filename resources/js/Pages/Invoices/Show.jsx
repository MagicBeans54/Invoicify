import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Download, Pencil, Send } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import InvoiceDocument from '@/components/InvoiceDocument';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { HoldToConfirmButton } from '@/components/ui/hold-to-confirm';
import { ShareButton } from '@/components/ui/share-button';



export default function Show({ invoice }) {
    const [sending, setSending] = useState(false);

    const sendInvoice = () => {
        setSending(true);
        router.post(route('invoices.send', invoice.id), {}, {
            onFinish: () => setSending(false),
        });
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <AppLayout
                title={invoice.invoice_number}
                subtitle={
                    invoice.contract_number
                        ? `Contract: ${invoice.contract_number}`
                        : undefined
                }
            >
                <InvoiceDocument invoice={invoice} />

                <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                    <LoadingButton
                        size="sm"
                        loading={sending}
                        onClick={sendInvoice}
                        disabled={!invoice.client_email}
                        title={
                            invoice.client_email
                                ? `Email this invoice to ${invoice.client_email}`
                                : 'Add a client email to enable sending'
                        }
                    >
                        <Send />
                        Send
                    </LoadingButton>
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('invoices.edit', invoice.id)}>
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <a href={route('invoices.pdf', invoice.id)}>
                            <Download />
                            Download PDF
                        </a>
                    </Button>
                    <ShareButton
                        size="sm"
                        direction="left"
                        label={`Share ${invoice.invoice_number}`}
                        copyValue={`${window.location.origin}${route('invoices.pdf', invoice.id)}`}
                        actions={[
                            {
                                icon: <Download size={13} />,
                                label: 'Download PDF',
                                onSelect: () =>
                                    window.open(route('invoices.pdf', invoice.id), '_blank'),
                            },
                            {
                                icon: <Send size={13} />,
                                label: 'Send by email',
                                onSelect: sendInvoice,
                            },
                        ]}
                    />
                    <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
                    <HoldToConfirmButton
                        size="sm"
                        label="Hold to delete"
                        confirmedLabel="Deleted"
                        onConfirm={() =>
                            router.delete(route('invoices.destroy', invoice.id))
                        }
                    />
                </div>
            </AppLayout>
        </>
    );
}
