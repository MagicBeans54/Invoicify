import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Upload } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        tax_id: settings.tax_id || '',
        default_tax_rate: settings.default_tax_rate || 0,
        invoice_notes: settings.invoice_notes || '',
    });

    const [logoPreview, setLogoPreview] = useState(
        settings.logo_path ? `/storage/${settings.logo_path}` : null
    );
    const [logoFile, setLogoFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = () => {
        if (!logoFile) return;

        const formData = new FormData();
        formData.append('logo', logoFile);

        post(route('settings.uploadLogo'), formData, {
            onSuccess: () => {
                setLogoFile(null);
            },
        });
    };

    return (
        <>
            <Head title="Company Settings" />
            <AppLayout title="Settings">
                <div className="mx-auto max-w-3xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Company Logo</CardTitle>
                            <CardDescription>
                                Shown on your invoices. PNG or JPG, square images work best.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/50">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Company logo"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-xs text-muted-foreground">No logo</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <label htmlFor="logo" className="cursor-pointer">
                                        Choose file
                                    </label>
                                </Button>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleLogoChange}
                                />
                                <Button
                                    size="sm"
                                    onClick={handleLogoUpload}
                                    disabled={!logoFile || processing}
                                >
                                    <Upload />
                                    {processing ? 'Uploading...' : 'Upload'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

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
                                        <Textarea
                                            id="address"
                                            rows={3}
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
                                        <Textarea
                                            id="invoice_notes"
                                            rows={3}
                                            placeholder="Notes that will appear on all invoices by default"
                                            value={data.invoice_notes}
                                            onChange={(e) =>
                                                setData('invoice_notes', e.target.value)
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="flex justify-end sm:col-span-2">
                                    <Button type="submit" size="sm" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
