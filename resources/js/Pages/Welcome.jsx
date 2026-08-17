import React from 'react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Invoicify
                </h1>
                <p className="text-gray-600 mb-6">
                    Laravel + Inertia.js + React is now set up and ready to go!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800 text-sm">
                        ✓ Laravel installed
                        ✓ Inertia.js configured
                        ✓ React + Vite ready
                    </p>
                </div>
            </div>
        </div>
    );
}
