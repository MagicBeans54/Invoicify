import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Index({ clients }) {
    return (
        <>
            <Head title="Clients" />
            <AppLayout title="Clients">
                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <p className="text-sm font-medium">No clients yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Clients will appear here when they register for accounts.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Invoices</TableHead>
                                    <TableHead className="text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">
                                            {client.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {client.email}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {client.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {client.invoices_count || 0} invoices
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="-mr-2"
                                            >
                                                <Link href={route('clients.show', client.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
