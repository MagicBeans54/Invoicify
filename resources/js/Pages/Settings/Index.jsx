import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

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

    const [logoPreview, setLogoPreview] = useState(settings.logo_path ? `/storage/${settings.logo_path}` : null);
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

    const handleLogoUpload = (e) => {
        e.preventDefault();
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
        <div className="min-h-screen bg-gray-100 py-8">
            <Head title="Company Settings" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href={route('invoices.index')} className="text-indigo-600 hover:text-indigo-800">
                        ← Back to Invoices
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>
                    </div>

                    {/* Logo Upload Section */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Logo</h2>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Company Logo"
                                        className="h-32 w-32 object-contain bg-gray-100 rounded-lg border"
                                    />
                                ) : (
                                    <div className="h-32 w-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No logo</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="mb-2"
                                />
                                <button
                                    onClick={handleLogoUpload}
                                    disabled={!logoFile || processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Upload Logo'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Company Information Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tax ID
                                </label>
                                <input
                                    type="text"
                                    value={data.tax_id}
                                    onChange={(e) => setData('tax_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.tax_id && <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Invoice Defaults */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Invoice Defaults</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.default_tax_rate}
                                    onChange={(e) => setData('default_tax_rate', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.default_tax_rate && <p className="text-red-500 text-sm mt-1">{errors.default_tax_rate}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Invoice Notes
                            </label>
                            <textarea
                                value={data.invoice_notes}
                                onChange={(e) => setData('invoice_notes', e.target.value)}
                                rows="3"
                                placeholder="Notes that will appear on all invoices by default"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.invoice_notes && <p className="text-red-500 text-sm mt-1">{errors.invoice_notes}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}