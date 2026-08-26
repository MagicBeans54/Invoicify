import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ClientLayout({ title, children, actions }) {
    const { flash } = usePage().props;
    const flashMessage = flash?.success || flash?.error;

    const links = [
        { label: 'My Invoices', href: route('client.dashboard') },
        { label: 'My Payments', href: route('client.payments.index') },
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        <Link
                            href={route('client.dashboard')}
                            className="text-sm font-semibold tracking-tight"
                        >
                            Invoicify Client Portal
                        </Link>
                        <nav className="flex items-center gap-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.post(route('logout'))}
                    >
                        Log out
                    </Button>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-8">
                {flashMessage && (
                    <div
                        className={cn(
                            'mb-4 rounded-lg p-4 text-sm',
                            flash?.error
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-green-50 text-green-800'
                        )}
                    >
                        {flashMessage}
                    </div>
                )}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
                {children}
            </main>
        </div>
    );
}
