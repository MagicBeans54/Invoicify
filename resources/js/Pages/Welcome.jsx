import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head title="Welcome to Invoicify" />
            
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Invoicify
                </h1>
                <p className="text-gray-600 mb-6">
                    Professional invoice generation system built with Laravel, Inertia.js, and React.
                </p>
                
                <div className="space-y-3 mb-6">
                     <Link
                        href={route('login')}
                        className="block w-full text-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        Login
                    </Link>
                    <Link
                        href={route('invoices.index')}
                        className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        View Invoices
                    </Link>
                    <Link
                        href={route('invoices.create')}
                        className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        Create New Invoice
                    </Link>
                    <Link
                        href={route('settings.index')}
                        className="block w-full text-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        Company Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
