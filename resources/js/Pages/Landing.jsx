import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Landing() {
    return (
        <>
            <Head title="Invoicify" />
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold">Invoicify</h1>
                        <p className="text-lg text-muted-foreground">
                            Professional invoice management for businesses and clients
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Admin Portal</CardTitle>
                                <CardDescription>
                                    For administrators to manage invoices, settings, and company information
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Create and manage invoices</li>
                                        <li>• Configure company settings</li>
                                        <li>• Track all invoice statuses</li>
                                        <li>• Send invoices to clients</li>
                                    </ul>
                                    <Button asChild className="w-full">
                                        <Link href={route('login.page')}>
                                            Admin Login
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Client Portal</CardTitle>
                                <CardDescription>
                                    For clients to view their invoices and download PDFs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• View your invoices</li>
                                        <li>• Download invoice PDFs</li>
                                        <li>• Track payment status</li>
                                        <li>• Manage your profile</li>
                                    </ul>
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href={route('client.login')}>
                                            Client Login
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
