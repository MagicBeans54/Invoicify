import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import InvoiceForm from '@/components/InvoiceForm';

export default function Create({ companySettings }) {
    const page = usePage();
    const clientData = page.props.client || null;

    const { data, setData, post, processing, errors } = useForm({
        invoice_number: `INV-000-${new Date().toISOString().split('T')[0]}`,
        contract_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        payment_terms: '',
        company_name: companySettings.company_name || 'Techstacks',
        company_email: companySettings.email || '',
        company_phone: companySettings.phone || '',
        company_address: companySettings.address || '',
        client_name: clientData ? clientData.name : '',
        client_email: clientData ? clientData.email : '',
        client_phone: clientData ? clientData.phone : '',
        client_address: clientData ? clientData.address : '',
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
