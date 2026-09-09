import React from 'react';
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
import { StatusBadge } from '@/components/ui/status-badge';
import { InvoicifyMark } from '@/components/InvoicifyLogo';
import { formatInvoiceDate, formatPeso } from '@/lib/invoices';

function AddressBlock({ name, email, phone, address }) {
    return (
        <div className="text-sm">
            <p className="font-medium">{name}</p>
            {email && <p className="text-muted-foreground">{email}</p>}
            {phone && <p className="text-muted-foreground">{phone}</p>}
            {address && (
                <p className="whitespace-pre-line text-muted-foreground">{address}</p>
            )}
        </div>
    );
}

/**
 * Shared invoice paper used by admin + client Show pages: a financial
 * document (brand rule, logo + number hero, status, ledger table, ruled
 * totals) instead of an anonymous admin card — same data, invoicing voice.
 */
export default function InvoiceDocument({ invoice }) {
    return (
        <Card className="overflow-hidden">
            <div
                aria-hidden="true"
                className="h-1.5 bg-gradient-to-r from-primary via-primary-ink to-primary"
            />
            <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="flex items-center gap-3">
                    {invoice.company_logo ? (
                        <img
                            src={`/storage/${invoice.company_logo}`}
                            alt={`${invoice.company_name || 'Company'} logo`}
                            className="h-10 w-10 rounded-lg object-contain"
                        />
                    ) : (
                        <InvoicifyMark className="size-10" />
                    )}
                    <div>
                        <p className="font-display text-2xl font-bold tracking-tight tabular-nums">
                            {invoice.invoice_number}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Issued {formatInvoiceDate(invoice.invoice_date)}
                            {' → '}
                            due {formatInvoiceDate(invoice.due_date)}
                        </p>
                    </div>
                </div>
                <StatusBadge status={invoice.status} />
            </CardContent>

            <Separator />

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
                        Bill to
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

            <CardContent className="flex flex-wrap gap-x-12 gap-y-6 p-6">
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
                        <p className="text-sm font-medium tabular-nums">{invoice.contract_number}</p>
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
                                    {formatPeso(item.unit_price)}
                                </TableCell>
                                <TableCell className="text-right font-medium tabular-nums">
                                    {formatPeso(item.total)}
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
                        <span className="tabular-nums">{formatPeso(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Tax ({invoice.tax_rate}%)
                        </span>
                        <span className="tabular-nums">
                            {formatPeso(invoice.tax_amount)}
                        </span>
                    </div>
                    <div
                        aria-hidden="true"
                        className="h-0.5 rounded-full bg-primary-ink/70"
                    />
                    <div className="flex items-baseline justify-between gap-4">
                        <span className="font-semibold">Total due</span>
                        <span className="font-display text-2xl font-bold tracking-tight tabular-nums">
                            {formatPeso(invoice.total)}
                        </span>
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
    );
}
