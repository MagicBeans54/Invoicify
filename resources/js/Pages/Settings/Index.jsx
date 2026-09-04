import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';

function Field({ label, id, error, children }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export default function Index({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: settings.company_name || 'Techstacks',
        logo: null,
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        tax_id: settings.tax_id || '',
        default_tax_rate: settings.default_tax_rate || 0,
        invoice_notes: settings.invoice_notes || '',
        bank_account_name: settings.bank_account_name || '',
        bank_name: settings.bank_name || '',
        bank_account_number: settings.bank_account_number || '',
        bank_account_type: settings.bank_account_type || '',
        bank_address: settings.bank_address || '',
        default_terms: settings.default_terms || '',
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Company Settings" />
            <AppLayout title="Settings">
                <div className="mx-auto max-w-3xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Company Information</CardTitle>
                                <CardDescription>
                                    These details appear in the "From" section of your invoices.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Company Name"
                                    id="company_name"
                                    error={errors.company_name}
                                >
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                    />
                                </Field>
                                <Field label="Logo" id="logo" error={errors.logo}>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                        onChange={(e) => setData('logo', e.target.files[0])}
                                    />
                                </Field>
                                <Field label="Email" id="email" error={errors.email}>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </Field>
                                <Field label="Phone" id="phone" error={errors.phone}>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </Field>
                                <Field label="Tax ID" id="tax_id" error={errors.tax_id}>
                                    <Input
                                        id="tax_id"
                                        value={data.tax_id}
                                        onChange={(e) => setData('tax_id', e.target.value)}
                                    />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field label="Address" id="address" error={errors.address}>
                                        <AutosizeTextarea
                                            id="address"
                                            minHeight={60}
                                            maxHeight={200}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-base">Invoice Defaults</CardTitle>
                                <CardDescription>
                                    Applied to new invoices automatically.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Default Tax Rate (%)"
                                    id="default_tax_rate"
                                    error={errors.default_tax_rate}
                                >
                                    <Input
                                        id="default_tax_rate"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.default_tax_rate}
                                        onChange={(e) =>
                                            setData(
                                                'default_tax_rate',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Default Invoice Notes"
                                        id="invoice_notes"
                                        error={errors.invoice_notes}
                                    >
                                        <AutosizeTextarea
                                            id="invoice_notes"
                                            minHeight={60}
                                            maxHeight={200}
                                            placeholder="Notes that will appear on all invoices by default"
                                            value={data.invoice_notes}
                                            onChange={(e) =>
                                                setData('invoice_notes', e.target.value)
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Default Terms"
                                        id="default_terms"
                                        error={errors.default_terms}
                                    >
                                        <AutosizeTextarea
                                            id="default_terms"
                                            minHeight={60}
                                            maxHeight={200}
                                            placeholder="Payment terms that will appear on all invoices by default"
                                            value={data.default_terms}
                                            onChange={(e) =>
                                                setData('default_terms', e.target.value)
                                            }
                                        />
                                    </Field>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-base">Bank Details</CardTitle>
                                <CardDescription>
                                    Bank information shown on invoices for payments.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Bank Account Name"
                                    id="bank_account_name"
                                    error={errors.bank_account_name}
                                >
                                    <Input
                                        id="bank_account_name"
                                        value={data.bank_account_name}
                                        onChange={(e) => setData('bank_account_name', e.target.value)}
                                    />
                                </Field>
                                <Field label="Bank Name" id="bank_name" error={errors.bank_name}>
                                    <Input
                                        id="bank_name"
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                    />
                                </Field>
                                <Field
                                    label="Bank Account Number"
                                    id="bank_account_number"
                                    error={errors.bank_account_number}
                                >
                                    <Input
                                        id="bank_account_number"
                                        value={data.bank_account_number}
                                        onChange={(e) => setData('bank_account_number', e.target.value)}
                                    />
                                </Field>
                                <Field
                                    label="Bank Account Type"
                                    id="bank_account_type"
                                    error={errors.bank_account_type}
                                >
                                    <Input
                                        id="bank_account_type"
                                        value={data.bank_account_type}
                                        onChange={(e) => setData('bank_account_type', e.target.value)}
                                    />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field label="Bank Address" id="bank_address" error={errors.bank_address}>
                                        <AutosizeTextarea
                                            id="bank_address"
                                            minHeight={60}
                                            maxHeight={200}
                                            value={data.bank_address}
                                            onChange={(e) => setData('bank_address', e.target.value)}
                                        />
                                    </Field>
                                </div>
                                <div className="flex justify-end sm:col-span-2">
                                    <LoadingButton type="submit" size="sm" loading={processing}>
                                        Save Settings
                                    </LoadingButton>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
