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
 * Shared invoice document used by admin + client Show pages so the money
 * story (parties → schedule → line items → display-size Total) renders
 * identically everywhere instead of two 90%-same copies drifting apart.
 */
export default function InvoiceDocument({ invoice }) {
    return (
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

            <CardContent className="flex flex-wrap gap-x-12 gap-y-6 p-6">
                <div className="space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Issued
                    </p>
                    <p className="text-sm font-medium">{formatInvoiceDate(invoice.invoice_date)}</p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Due
                    </p>
                    <p className="text-sm font-medium">{formatInvoiceDate(invoice.due_date)}</p>
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
                    <Separator />
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
