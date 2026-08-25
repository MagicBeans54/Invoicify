import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ArrowLeft, Download } from 'lucide-react';
import ClientLayout from '@/components/ClientLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const badgeVariant = {
    paid: 'default',
    sent: 'secondary',
    overdue: 'destructive',
    draft: 'outline',
};

export default function ClientShow({ invoice }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const AddressBlock = ({ name, email, phone, address }) => (
        <div className="text-sm">
            <p className="font-medium">{name}</p>
            {email && <p className="text-muted-foreground">{email}</p>}
            {phone && <p className="text-muted-foreground">{phone}</p>}
            {address && (
                <p className="whitespace-pre-line text-muted-foreground">{address}</p>
            )}
        </div>
    );

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <ClientLayout
                title={
                    <span className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon-sm" className="-ml-2">
                            <Link href={route('client.dashboard')}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <div className="flex flex-col">
                            <span>{invoice.invoice_number}</span>
                            {invoice.contract_number && (
                                <span className="text-xs text-muted-foreground">Contract: {invoice.contract_number}</span>
                            )}
                        </div>
                    </span>
                }
                actions={
                    <Badge variant={badgeVariant[invoice.status] ?? 'outline'}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                }
            >
                <Card>
                    <CardContent className="grid gap-8 p-6 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                From
                            </p>
                            <AddressBlock
                                name={invoice.company_name}
                                email={invoice.company_email}
                                phone={invoice.company_phone}
                                address={invoice.company_address}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                To
                            </p>
                            <AddressBlock
                                name={invoice.client_name}
                                email={invoice.client_email}
                                phone={invoice.client_phone}
                                address={invoice.client_address}
                            />
                        </div>
                    </CardContent>

                    <Separator />

                    <CardContent className="flex gap-12 p-6">
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Issued
                            </p>
                            <p className="text-sm font-medium">{formatDate(invoice.invoice_date)}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Due
                            </p>
                            <p className="text-sm font-medium">{formatDate(invoice.due_date)}</p>
                        </div>
                        {invoice.contract_number && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Contract
                                </p>
                                <p className="text-sm font-medium">{invoice.contract_number}</p>
                            </div>
                        )}
                    </CardContent>

                    <Separator />

                    <CardContent className="p-6 pb-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-24 text-right">Qty</TableHead>
                                    <TableHead className="w-32 text-right">Unit Price</TableHead>
                                    <TableHead className="w-32 text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatCurrency(item.unit_price)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatCurrency(item.total)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>

                    <CardContent className="flex justify-end p-6">
                        <div className="w-full max-w-xs space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="tabular-nums">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Tax ({invoice.tax_rate}%)
                                </span>
                                <span className="tabular-nums">
                                    {formatCurrency(invoice.tax_amount)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span className="tabular-nums">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </CardContent>

                    {invoice.notes && (
                        <>
                            <Separator />
                            <CardContent className="p-6">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Notes
                                </p>
                                <p className="mt-1.5 whitespace-pre-line text-sm">
                                    {invoice.notes}
                                </p>
                            </CardContent>
                        </>
                    )}

                    {invoice.terms && (
                        <>
                            <Separator />
                            <CardContent className="p-6">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Terms
                                </p>
                                <p className="mt-1.5 whitespace-pre-line text-sm">
                                    {invoice.terms}
                                </p>
                            </CardContent>
                        </>
                    )}
                </Card>

                <div className="mt-6 flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                        <a href={route('client.invoices.pdf', invoice.id)}>
                            <Download />
                            Download PDF
                        </a>
                    </Button>
                </div>
            </ClientLayout>
        </>
    );
}
