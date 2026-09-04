import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Download, Plus } from 'lucide-react';
import ClientLayout from '@/components/ClientLayout';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ui/share-button';
import { StatusBadge } from '@/components/ui/status-badge';
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

export default function ClientShow({ invoice }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `₱${parseFloat(amount).toFixed(2)}`;
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
                title={invoice.invoice_number}
                subtitle={
                    invoice.contract_number
                        ? `Contract: ${invoice.contract_number}`
                        : undefined
                }
                actions={
                    <StatusBadge status={invoice.status} />
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
                        {invoice.payment_terms && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Payment Terms
                                </p>
                                <p className="text-sm font-medium">{invoice.payment_terms}</p>
                            </div>
                        )}
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
                    {invoice.status !== 'paid' && (
                        <Button asChild variant="default" size="sm">
                            <Link href={route('client.payments.create', { invoice_id: invoice.id })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Make Payment
                            </Link>
                        </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                        <a href={route('client.invoices.pdf', invoice.id)}>
                            <Download />
                            Download PDF
                        </a>
                    </Button>
                    <ShareButton
                        size="sm"
                        direction="left"
                        label={`Share ${invoice.invoice_number}`}
                        copyValue={`${window.location.origin}${route('client.invoices.pdf', invoice.id)}`}
                        actions={[
                            {
                                icon: <Download size={13} />,
                                label: 'Download PDF',
                                onSelect: () =>
                                    window.open(route('client.invoices.pdf', invoice.id), '_blank'),
                            },
                        ]}
                    />
                </div>
            </ClientLayout>
        </>
    );
}
