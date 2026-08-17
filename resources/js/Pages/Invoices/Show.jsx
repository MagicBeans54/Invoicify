import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Show({ invoice }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <Head title={`Invoice ${invoice.invoice_number}`} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href={route('invoices.index')} className="text-indigo-600 hover:text-indigo-800">
                        ← Back to Invoices
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Invoice Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
                                <p className="text-gray-600 mt-1">{invoice.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Company and Client Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">From</h2>
                                <div className="text-gray-700">
                                    <p className="font-semibold">{invoice.company_name}</p>
                                    {invoice.company_email && <p className="text-sm">{invoice.company_email}</p>}
                                    {invoice.company_phone && <p className="text-sm">{invoice.company_phone}</p>}
                                    {invoice.company_address && <p className="text-sm whitespace-pre-line">{invoice.company_address}</p>}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">To</h2>
                                <div className="text-gray-700">
                                    <p className="font-semibold">{invoice.client_name}</p>
                                    {invoice.client_email && <p className="text-sm">{invoice.client_email}</p>}
                                    {invoice.client_phone && <p className="text-sm">{invoice.client_phone}</p>}
                                    {invoice.client_address && <p className="text-sm whitespace-pre-line">{invoice.client_address}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Invoice Date</p>
                                <p className="font-semibold">{formatDate(invoice.invoice_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="font-semibold">{formatDate(invoice.due_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Items</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-500">Quantity</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-500">Unit Price</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-500">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-3 text-sm text-gray-900">{item.description}</td>
                                        <td className="py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                                        <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unit_price)}</td>
                                        <td className="py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-end">
                            <div className="w-64">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                                    <span className="font-semibold">{formatCurrency(invoice.tax_amount)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total:</span>
                                    <span>{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Notes</h2>
                            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-6 flex justify-end space-x-4">
                        <a
                            href={route('invoices.pdf', invoice.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Download PDF
                        </a>
                        <Link
                            href={route('invoices.edit', invoice.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Edit Invoice
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}