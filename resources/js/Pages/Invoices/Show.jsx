import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Show({ invoice }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 py-8' },
        React.createElement(Head, { title: 'Invoice ' + invoice.invoice_number }),
        React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
            React.createElement('div', { className: 'mb-6' },
                React.createElement(Link, {
                    href: route('invoices.index'),
                    className: 'text-indigo-600 hover:text-indigo-800'
                }, '← Back to Invoices')
            ),
            React.createElement('div', { className: 'bg-white shadow-lg rounded-lg overflow-hidden' },
                // Invoice Header
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('div', { className: 'flex justify-between items-start' },
                        React.createElement('div', null,
                            React.createElement('h1', { className: 'text-2xl font-bold text-gray-800' }, 'Invoice'),
                            React.createElement('p', { className: 'text-gray-600 mt-1' }, invoice.invoice_number)
                        ),
                        React.createElement('div', { className: 'text-right' },
                            React.createElement('span', {
                                className: 'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ' +
                                (invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800')
                            }, invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1))
                        )
                    )
                ),
                // Company and Client Info
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
                        React.createElement('div', null,
                            React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'From'),
                            React.createElement('div', { className: 'text-gray-700' },
                                React.createElement('p', { className: 'font-semibold' }, invoice.company_name),
                                invoice.company_email && React.createElement('p', { className: 'text-sm' }, invoice.company_email),
                                invoice.company_phone && React.createElement('p', { className: 'text-sm' }, invoice.company_phone),
                                invoice.company_address && React.createElement('p', { className: 'text-sm whitespace-pre-line' }, invoice.company_address)
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'To'),
                            React.createElement('div', { className: 'text-gray-700' },
                                React.createElement('p', { className: 'font-semibold' }, invoice.client_name),
                                invoice.client_email && React.createElement('p', { className: 'text-sm' }, invoice.client_email),
                                invoice.client_phone && React.createElement('p', { className: 'text-sm' }, invoice.client_phone),
                                invoice.client_address && React.createElement('p', { className: 'text-sm whitespace-pre-line' }, invoice.client_address)
                            )
                        )
                    )
                ),
                // Invoice Details
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                        React.createElement('div', null,
                            React.createElement('p', { className: 'text-sm text-gray-500' }, 'Invoice Date'),
                            React.createElement('p', { className: 'font-semibold' }, formatDate(invoice.invoice_date))
                        ),
                        React.createElement('div', null,
                            React.createElement('p', { className: 'text-sm text-gray-500' }, 'Due Date'),
                            React.createElement('p', { className: 'font-semibold' }, formatDate(invoice.due_date))
                        )
                    )
                ),
                // Invoice Items
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Items'),
                    React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                React.createElement('th', { className: 'text-left py-2 text-sm font-medium text-gray-500' }, 'Description'),
                                React.createElement('th', { className: 'text-right py-2 text-sm font-medium text-gray-500' }, 'Quantity'),
                                React.createElement('th', { className: 'text-right py-2 text-sm font-medium text-gray-500' }, 'Unit Price'),
                                React.createElement('th', { className: 'text-right py-2 text-sm font-medium text-gray-500' }, 'Total')
                            )
                        ),
                        React.createElement('tbody', { className: 'divide-y divide-gray-200' },
                            invoice.items.map((item, index) => 
                                React.createElement('tr', { key: index },
                                    React.createElement('td', { className: 'py-3 text-sm text-gray-900' }, item.description),
                                    React.createElement('td', { className: 'py-3 text-sm text-gray-900 text-right' }, item.quantity),
                                    React.createElement('td', { className: 'py-3 text-sm text-gray-900 text-right' }, formatCurrency(item.unit_price)),
                                    React.createElement('td', { className: 'py-3 text-sm text-gray-900 text-right font-medium' }, formatCurrency(item.total))
                                )
                            )
                        )
                    )
                ),
                // Totals
                React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('div', { className: 'flex justify-end' },
                        React.createElement('div', { className: 'w-64' },
                            React.createElement('div', { className: 'flex justify-between mb-2' },
                                React.createElement('span', { className: 'text-gray-600' }, 'Subtotal:'),
                                React.createElement('span', { className: 'font-semibold' }, formatCurrency(invoice.subtotal))
                            ),
                            React.createElement('div', { className: 'flex justify-between mb-2' },
                                React.createElement('span', { className: 'text-gray-600' }, 'Tax (' + invoice.tax_rate + '%):'),
                                React.createElement('span', { className: 'font-semibold' }, formatCurrency(invoice.tax_amount))
                            ),
                            React.createElement('div', { className: 'flex justify-between text-lg font-bold border-t pt-2' },
                                React.createElement('span', null, 'Total:'),
                                React.createElement('span', null, formatCurrency(invoice.total))
                            )
                        )
                    )
                ),
                // Notes
                invoice.notes && React.createElement('div', { className: 'p-6 border-b border-gray-200' },
                    React.createElement('h2', { className: 'text-lg font-semibold text-gray-800 mb-2' }, 'Notes'),
                    React.createElement('p', { className: 'text-gray-700 whitespace-pre-line' }, invoice.notes)
                ),
                // Actions
                React.createElement('div', { className: 'p-6 flex justify-end space-x-4' },
                    React.createElement('a', {
                        href: route('invoices.pdf', invoice.id),
                        className: 'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition'
                    }, 'Download PDF'),
                    React.createElement(Link, {
                        href: route('invoices.edit', invoice.id),
                        className: 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'
                    }, 'Edit Invoice')
                )
            )
        )
    );
}