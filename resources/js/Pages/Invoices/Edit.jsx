import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Edit({ invoice, companySettings }) {
    const { data, setData, put, processing, errors } = useForm({
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        status: invoice.status,
        company_name: invoice.company_name,
        company_email: invoice.company_email || '',
        company_phone: invoice.company_phone || '',
        company_address: invoice.company_address || '',
        client_name: invoice.client_name,
        client_email: invoice.client_email || '',
        client_phone: invoice.client_phone || '',
        client_address: invoice.client_address || '',
        tax_rate: invoice.tax_rate,
        notes: invoice.notes || '',
        items: invoice.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
        })),
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * (data.tax_rate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id));
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 py-8' },
        React.createElement(Head, { title: 'Edit Invoice ' + invoice.invoice_number }),
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
            React.createElement('div', { className: 'mb-6' },
                React.createElement(Link, {
                    href: route('invoices.index'),
                    className: 'text-indigo-600 hover:text-indigo-800'
                }, '← Back to Invoices')
            ),
            React.createElement('div', { className: 'bg-white shadow-lg rounded-lg overflow-hidden' },
                React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200' },
                    React.createElement('h1', { className: 'text-2xl font-bold text-gray-800' }, 'Edit Invoice ' + invoice.invoice_number)
                ),
                React.createElement('form', { onSubmit: handleSubmit, className: 'p-6' },
                    // Invoice Details
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Invoice Number'),
                            React.createElement('input', {
                                type: 'text',
                                value: data.invoice_number,
                                onChange: (e) => setData('invoice_number', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.invoice_number && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.invoice_number)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Invoice Date'),
                            React.createElement('input', {
                                type: 'date',
                                value: data.invoice_date,
                                onChange: (e) => setData('invoice_date', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.invoice_date && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.invoice_date)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Due Date'),
                            React.createElement('input', {
                                type: 'date',
                                value: data.due_date,
                                onChange: (e) => setData('due_date', e.target.value),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.due_date && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.due_date)
                        )
                    ),
                    // Status
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Status'),
                        React.createElement('select', {
                            value: data.status,
                            onChange: (e) => setData('status', e.target.value),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        },
                            React.createElement('option', { value: 'draft' }, 'Draft'),
                            React.createElement('option', { value: 'sent' }, 'Sent'),
                            React.createElement('option', { value: 'paid' }, 'Paid'),
                            React.createElement('option', { value: 'overdue' }, 'Overdue')
                        ),
                        errors.status && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.status)
                    ),
                    // Company Information
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Company Information'),
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
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
                                    value: data.company_email,
                                    onChange: (e) => setData('company_email', e.target.value),
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.company_email && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.company_email)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Phone'),
                                React.createElement('input', {
                                    type: 'text',
                                    value: data.company_phone,
                                    onChange: (e) => setData('company_phone', e.target.value),
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.company_phone && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.company_phone)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Address'),
                                React.createElement('textarea', {
                                    value: data.company_address,
                                    onChange: (e) => setData('company_address', e.target.value),
                                    rows: '2',
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.company_address && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.company_address)
                            )
                        )
                    ),
                    // Client Information
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Client Information'),
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Client Name'),
                                React.createElement('input', {
                                    type: 'text',
                                    value: data.client_name,
                                    onChange: (e) => setData('client_name', e.target.value),
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.client_name && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.client_name)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Email'),
                                React.createElement('input', {
                                    type: 'email',
                                    value: data.client_email,
                                    onChange: (e) => setData('client_email', e.target.value),
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.client_email && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.client_email)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Phone'),
                                React.createElement('input', {
                                    type: 'text',
                                    value: data.client_phone,
                                    onChange: (e) => setData('client_phone', e.target.value),
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.client_phone && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.client_phone)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Address'),
                                React.createElement('textarea', {
                                    value: data.client_address,
                                    onChange: (e) => setData('client_address', e.target.value),
                                    rows: '2',
                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }),
                                errors.client_address && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.client_address)
                            )
                        )
                    ),
                    // Invoice Items
                    React.createElement('div', { className: 'mb-6' },
                        React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Invoice Items'),
                        React.createElement('div', { className: 'space-y-4' },
                            data.items.map((item, index) => 
                                React.createElement('div', { key: index, className: 'grid grid-cols-1 md:grid-cols-4 gap-4 items-start p-4 bg-gray-50 rounded-lg' },
                                    React.createElement('div', { className: 'md:col-span-2' },
                                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Description'),
                                        React.createElement('input', {
                                            type: 'text',
                                            value: item.description,
                                            onChange: (e) => updateItem(index, 'description', e.target.value),
                                            className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        }),
                                        errors[`items.${index}.description`] && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors[`items.${index}.description`])
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Quantity'),
                                        React.createElement('input', {
                                            type: 'number',
                                            min: '1',
                                            value: item.quantity,
                                            onChange: (e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1),
                                            className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        }),
                                        errors[`items.${index}.quantity`] && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors[`items.${index}.quantity`])
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Unit Price'),
                                        React.createElement('input', {
                                            type: 'number',
                                            min: '0',
                                            step: '0.01',
                                            value: item.unit_price,
                                            onChange: (e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0),
                                            className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        }),
                                        errors[`items.${index}.unit_price`] && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors[`items.${index}.unit_price`])
                                    ),
                                    data.items.length > 1 && React.createElement('button', {
                                        type: 'button',
                                        onClick: () => removeItem(index),
                                        className: 'text-red-600 hover:text-red-800 text-sm'
                                    }, 'Remove')
                                )
                            )
                        ),
                        React.createElement('button', {
                            type: 'button',
                            onClick: addItem,
                            className: 'mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'
                        }, '+ Add Item')
                    ),
                    // Tax and Notes
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Tax Rate (%)'),
                            React.createElement('input', {
                                type: 'number',
                                min: '0',
                                step: '0.01',
                                value: data.tax_rate,
                                onChange: (e) => setData('tax_rate', parseFloat(e.target.value) || 0),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.tax_rate && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.tax_rate)
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Notes'),
                            React.createElement('textarea', {
                                value: data.notes,
                                onChange: (e) => setData('notes', e.target.value),
                                rows: '2',
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }),
                            errors.notes && React.createElement('p', { className: 'text-red-500 text-sm mt-1' }, errors.notes)
                        )
                    ),
                    // Totals
                    React.createElement('div', { className: 'bg-gray-50 p-6 rounded-lg mb-6' },
                        React.createElement('div', { className: 'flex justify-between mb-2' },
                            React.createElement('span', { className: 'text-gray-600' }, 'Subtotal:'),
                            React.createElement('span', { className: 'font-semibold' }, '$' + calculateSubtotal().toFixed(2))
                        ),
                        React.createElement('div', { className: 'flex justify-between mb-2' },
                            React.createElement('span', { className: 'text-gray-600' }, 'Tax (' + data.tax_rate + '%):'),
                            React.createElement('span', { className: 'font-semibold' }, '$' + calculateTax().toFixed(2))
                        ),
                        React.createElement('div', { className: 'flex justify-between text-lg font-bold border-t pt-2' },
                            React.createElement('span', null, 'Total:'),
                            React.createElement('span', null, '$' + calculateTotal().toFixed(2))
                        )
                    ),
                    // Submit Button
                    React.createElement('div', { className: 'flex justify-end space-x-4' },
                        React.createElement(Link, {
                            href: route('invoices.show', invoice.id),
                            className: 'px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition'
                        }, 'Cancel'),
                        React.createElement('button', {
                            type: 'submit',
                            disabled: processing,
                            className: 'px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50'
                        }, processing ? 'Updating...' : 'Update Invoice')
                    )
                )
            )
        )
    );
}