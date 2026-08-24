import React from 'react';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppLayout({ title, children, actions }) {
    const links = [
        { label: 'Invoices', href: route('invoices.index') },
        { label: 'Settings', href: route('settings.index') },
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        <Link
                            href={route('invoices.index')}
                            className="text-sm font-semibold tracking-tight"
                        >
                            Invoicify
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
                {(title || actions) && (
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                        {actions}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
