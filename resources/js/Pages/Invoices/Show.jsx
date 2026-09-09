import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Download, Pencil, Send, Trash2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import InvoiceDocument from '@/components/InvoiceDocument';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { ShareMenu } from '@/components/ShareMenu';



export default function Show({ invoice }) {
    const [sending, setSending] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const disarmTimer = useRef(null);

    useEffect(
        () => () => {
            if (disarmTimer.current) window.clearTimeout(disarmTimer.current);
        },
        []
    );

    const armDelete = () => {
        setConfirmingDelete(true);
        if (disarmTimer.current) window.clearTimeout(disarmTimer.current);
        disarmTimer.current = window.setTimeout(() => setConfirmingDelete(false), 5000);
    };

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
                    <ShareMenu
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
                    {confirmingDelete ? (
                        <>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                    router.delete(route('invoices.destroy', invoice.id))
                                }
                            >
                                <Trash2 />
                                Confirm delete
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmingDelete(false)}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={armDelete}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 />
                            Delete
                        </Button>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
