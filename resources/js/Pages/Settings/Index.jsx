import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

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

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 py-8' },
        React.createElement(Head, { title: 'Company Settings' }),
        React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
            React.createElement('div', { className: 'mb-6' },
                React.createElement(Link, {
                    href: route('invoices.index'),
                    className: 'text-indigo-600 hover:text-indigo-800'
                }, '← Back to Invoices')
            ),
            React.createElement('div', { className: 'bg-white shadow-lg rounded-lg overflow-hidden' },
                React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200' },
                    React.createElement('h1', { className: 'text-2xl font-bold text-gray-800' }, 'Company Settings')
                ),
                // Logo Upload Section
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Company Logo'),
                    React.createElement('div', { className: 'flex items-start space-x-6' },
                        React.createElement('div', { className: 'flex-shrink-0' },
                            logoPreview 
                                ? React.createElement('img', {
                                    src: logoPreview,
                                    alt: 'Company Logo',
                                    className: 'h-32 w-32 object-contain bg-gray-100 rounded-lg border'
                                })
                                : React.createElement('div', { className: 'h-32 w-32 bg-gray-100 rounded-lg border flex items-center justify-center' },
                                    React.createElement('span', { className: 'text-gray-400 text-sm' }, 'No logo')
                                )
                        ),
                        React.createElement('div', { className: 'flex-1' },
                            React.createElement('input', {
                                type: 'file',
                                accept: 'image/*',
                                onChange: handleLogoChange,
                                className: 'mb-2'
                            }),
                            React.createElement('button', {
                                onClick: handleLogoUpload,
                                disabled: !logoFile || processing,
                                className: 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50'
                            }, processing ? 'Uploading...' : 'Upload Logo')
                        )
                    )
                ),
                // Company Information Form
                React.createElement('form', { onSubmit: handleSubmit, className: 'p-6' },
                    React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Company Information'),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Company Name'),
                            React.createElement('input', {
                                type: 'text',
                                value: data.company_name,
                                onChange: (e) => setData('company_name', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.company_name && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.company_name)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Email'),
                            React.createElement('input', {
                                type: 'email',
                                value: data.email,
                                onChange: (e) => setData('email', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.email && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.email)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Phone'),
                            React.createElement('input', {
                                type: 'text',
                                value: data.phone,
                                onChange: (e) => setData('phone', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.phone && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.phone)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Tax ID'),
                            React.createElement('input', {
                                type: 'text',
                                value: data.tax_id,
                                onChange: (e) => setData('tax_id', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.tax_id && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.tax_id)
                        ),
                        React.createElement('div', { className: 'md:col-span-2' },
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Address'),
                            React.createElement('textarea', {
                                value: data.address,
                                onChange: (e) => setData('address', e.target.value),
                                rows: '3',
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.address && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.address)
                        )
                    ),
                    // Invoice Defaults
                    React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Invoice Defaults'),
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Default Tax Rate (%)'),
                            React.createElement('input', {
                                type: 'number',
                                min: '0',
                                step: '0.01',
                                value: data.default_tax_rate,
                                onChange: (e) => setData('default_tax_rate', parseFloat(e.target.value) || 0),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.default_tax_rate && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.default_tax_rate)
                        )
                    ),
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Default Invoice Notes'),
                        React.createElement('textarea', {
                            value: data.invoice_notes,
                            onChange: (e) => setData('invoice_notes', e.target.value),
                            rows: '3',
                            placeholder: 'Notes that will appear on all invoices by default',
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        }),
                        errors.invoice_notes && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.invoice_notes)
                    ),
                    // Submit Button
                    React.createElement('div', { className: 'flex justify-end' },
                        React.createElement('button', {
                            type: 'submit',
                            disabled: processing,
                            className: 'px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50'
                        }, processing ? 'Saving...' : 'Save Settings')
                    )
                )
            )
        )
    );
}