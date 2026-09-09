import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ClientLayout from '@/components/ClientLayout';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatPeso } from '@/lib/invoices';

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p role="alert" className="text-sm text-destructive">
            {message}
        </p>
    );
}

export default function ClientPaymentCreate({ invoice, invoices }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: invoice?.id ? String(invoice.id) : '',
        amount: invoice?.remaining_balance ?? invoice?.total ?? '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        reference_number: '',
        receipt_file: null,
        client_notes: '',
    });

    const selectedInvoice =
        (invoices || []).find((inv) => String(inv.id) === String(data.invoice_id)) ||
        invoice ||
        null;

    const total = Number(selectedInvoice?.total) || 0;
    const paid = Number(selectedInvoice?.paid_amount) || 0;
    const due = Number(selectedInvoice?.remaining_balance ?? total) || 0;
    const amount = Number(data.amount) || 0;
    const overBalance = selectedInvoice && amount > due;
    const isPartial = selectedInvoice && amount > 0 && amount < due;
    const remainingAfter = selectedInvoice ? Math.max(0, due - amount) : 0;

    const applyFullBalance = () => {
        if (selectedInvoice) setData('amount', due.toFixed(2));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key] ?? '');
        });
        post(route('client.payments.store'), formData);
    };

    const handleFileChange = (e) => {
        setData('receipt_file', e.target.files[0]);
    };

    return (
        <>
            <Head title="Submit Payment" />
            <ClientLayout title="Submit Payment">
                <div className="max-w-2xl space-y-6">
                    {selectedInvoice && (
                        <Card>
                            <CardContent className="space-y-2 p-5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Invoice</span>
                                    <Link
                                        href={route('client.invoices.show', selectedInvoice.id)}
                                        className="font-medium text-primary-ink hover:underline dark:text-primary"
                                    >
                                        {selectedInvoice.invoice_number}
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Invoice total</span>
                                    <span className="tabular-nums">{formatPeso(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Already paid</span>
                                    <span className="tabular-nums">{formatPeso(paid)}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-semibold">Balance due</span>
                                    <span className="flex items-center gap-2">
                                        <span className="font-display text-xl font-bold tracking-tight tabular-nums">
                                            {formatPeso(due)}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={applyFullBalance}
                                        >
                                            Pay full balance
                                        </Button>
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="invoice_id">Invoice</Label>
                            <Select
                                value={data.invoice_id}
                                onValueChange={(value) => {
                                    setData('invoice_id', value);
                                    const next = (invoices || []).find(
                                        (inv) => String(inv.id) === String(value)
                                    );
                                    if (next) {
                                        setData(
                                            'amount',
                                            Number(next.remaining_balance ?? next.total).toFixed(2)
                                        );
                                    }
                                }}
                            >
                                <SelectTrigger id="invoice_id">
                                    <SelectValue placeholder="Select an invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(invoices || []).map((inv) => (
                                        <SelectItem key={inv.id} value={inv.id.toString()}>
                                            {inv.invoice_number} - {formatPeso(inv.total)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError message={errors.invoice_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={selectedInvoice ? due.toFixed(2) : undefined}
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0.00"
                                aria-invalid={Boolean(errors.amount) || Boolean(overBalance)}
                                aria-describedby={
                                    overBalance
                                        ? 'amount-balance-warning'
                                        : isPartial
                                          ? 'amount-partial-hint'
                                          : undefined
                                }
                                className="tabular-nums"
                            />
                            <FieldError message={errors.amount} />
                            {selectedInvoice && !errors.amount && overBalance && (
                                <p
                                    id="amount-balance-warning"
                                    role="alert"
                                    className="text-sm font-medium text-destructive"
                                >
                                    This exceeds the {formatPeso(due)} balance due. The
                                    server caps payments at the remaining balance.
                                </p>
                            )}
                            {selectedInvoice && !errors.amount && !overBalance && isPartial && (
                                <p id="amount-partial-hint" className="text-sm text-muted-foreground">
                                    Partial payment — {formatPeso(remainingAfter)} will
                                    remain due.
                                </p>
                            )}
                            {selectedInvoice && !errors.amount && !overBalance && !isPartial && amount > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Full balance — nothing will remain due.
                                </p>
                            )}
                        </div>

                        {selectedInvoice && amount > 0 && (
                            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                <span className="text-muted-foreground">Remaining after this payment</span>
                                <span className="font-medium tabular-nums" aria-live="polite">
                                    {formatPeso(remainingAfter)}
                                </span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="payment_date">Payment Date</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                            />
                            <FieldError message={errors.payment_date} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Select
                                value={data.payment_method}
                                onValueChange={(value) => setData('payment_method', value)}
                            >
                                <SelectTrigger id="payment_method">
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="check">Check</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError message={errors.payment_method} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reference_number">Reference Number (Optional)</Label>
                            <Input
                                id="reference_number"
                                type="text"
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                placeholder="Transaction ID, check number, etc."
                            />
                            <FieldError message={errors.reference_number} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="receipt_file">Receipt/Proof of Payment (Optional)</Label>
                            <Input
                                id="receipt_file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                aria-describedby="receipt_file-hint"
                            />
                            <p id="receipt_file-hint" className="text-xs text-muted-foreground">
                                Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
                            </p>
                            <FieldError message={errors.receipt_file} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_notes">Notes (Optional)</Label>
                            <AutosizeTextarea
                                id="client_notes"
                                value={data.client_notes}
                                onChange={(e) => setData('client_notes', e.target.value)}
                                placeholder="Any additional information about this payment"
                                minHeight={60}
                                maxHeight={240}
                            />
                            <FieldError message={errors.client_notes} />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button asChild variant="outline" type="button">
                                <Link href={route('client.payments.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton type="submit" loading={processing}>
                                Submit Payment
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </ClientLayout>
        </>
    );
}
