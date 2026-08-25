import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import InvoiceForm from '@/components/InvoiceForm';

export default function Create({ companySettings }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: `INV-${Date.now()}`,
        contract_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        company_name: companySettings.company_name || 'Techstacks',
        company_email: companySettings.email || '',
        company_phone: companySettings.phone || '',
        company_address: companySettings.address || '',
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        tax_rate: companySettings.default_tax_rate || 0,
        notes: companySettings.invoice_notes || '',
        terms: companySettings.default_terms || '',
        items: [
            {
                description: '',
                quantity: 1,
                unit_price: 0,
            },
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <>
            <Head title="Create Invoice" />
            <AppLayout title="New Invoice">
                <InvoiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Create Invoice"
                />
            </AppLayout>
        </>
    );
}
