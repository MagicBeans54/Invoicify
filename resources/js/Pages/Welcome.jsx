import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Head title="Welcome to Invoicify" />
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Welcome to Invoicify</CardTitle>
                    <CardDescription>
                        Professional invoice generation system built with Laravel, Inertia.js, and React.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button asChild className="w-full">
                        <Link href={route('login')}>Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={route('invoices.index')}>View Invoices</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={route('invoices.create')}>Create New Invoice</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={route('settings.index')}>Company Settings</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}