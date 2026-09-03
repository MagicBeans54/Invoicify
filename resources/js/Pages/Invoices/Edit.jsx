import React from 'react';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import InvoiceForm from '@/components/InvoiceForm';

export default function Edit({ invoice }) {
    const defaultValues = {
        invoice_number: invoice.invoice_number,
        contract_number: invoice.contract_number || '',
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        status: invoice.status,
        payment_terms: invoice.payment_terms || '',
        company_name: invoice.company_name,
        company_email: invoice.company_email || '',
        company_phone: invoice.company_phone || '',
        company_address: invoice.company_address || '',
        client_name: invoice.client_name,
        client_email: invoice.client_email || '',
        client_phone: invoice.client_phone || '',
        client_address: invoice.client_address || '',
        tax_rate: Number(invoice.tax_rate),
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
        })),
    };

    return (
        <>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />
            <AppLayout title={`Edit ${invoice.invoice_number}`}>
                <InvoiceForm
                    method="put"
                    action={route('invoices.update', invoice.id)}
                    defaultValues={defaultValues}
                    submitLabel="Save Changes"
                    isEdit={true}
                />
            </AppLayout>
        </>
    );
}
