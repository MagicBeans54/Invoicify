import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import InvoiceForm from '@/components/InvoiceForm';

function todayIso() {
    return new Date().toISOString().split('T')[0];
}

export default function Create({ companySettings }) {
    const page = usePage();
    const client = page.props.client || null;

    const defaultValues = {
        invoice_number: '',
        contract_number: '',
        invoice_date: todayIso(),
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        payment_terms: '',
        company_name: companySettings.company_name || 'Techstacks',
        company_email: companySettings.email || '',
        company_phone: companySettings.phone || '',
        company_address: companySettings.address || '',
        client_name: client ? client.name : '',
        client_email: client ? client.email : '',
        client_phone: client ? client.phone : '',
        client_address: client ? client.address : '',
        tax_rate: Number(companySettings.default_tax_rate) || 0,
        notes: companySettings.invoice_notes || '',
        terms: companySettings.default_terms || '',
        items: [
            {
                description: '',
                quantity: 1,
                unit_price: 0,
            },
        ],
    };

    return (
        <>
            <Head title="Create Invoice" />
            <AppLayout title="New Invoice">
                <InvoiceForm
                    method="post"
                    action={route('invoices.store')}
                    defaultValues={defaultValues}
                    submitLabel="Create Invoice"
                    isEdit={false}
                />
            </AppLayout>
        </>
    );
}
