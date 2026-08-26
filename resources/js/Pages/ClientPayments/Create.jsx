import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ClientLayout from '@/components/ClientLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function ClientPaymentCreate({ invoice, invoices }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: invoice?.id || '',
        amount: invoice?.total || '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        reference_number: '',
        receipt_file: null,
        client_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'receipt_file' && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
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
                <div className="mb-4">
                    <Button asChild variant="ghost">
                        <Link href={route('client.payments.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="invoice_id">Invoice</Label>
                            <Select
                                value={data.invoice_id}
                                onValueChange={(value) => setData('invoice_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {invoices.map((inv) => (
                                        <SelectItem key={inv.id} value={inv.id.toString()}>
                                            {inv.invoice_number} - ${parseFloat(inv.total).toFixed(2)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.invoice_id && (
                                <p className="text-sm text-destructive">{errors.invoice_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <p className="text-sm text-destructive">{errors.amount}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_date">Payment Date</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                            />
                            {errors.payment_date && (
                                <p className="text-sm text-destructive">{errors.payment_date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Select
                                value={data.payment_method}
                                onValueChange={(value) => setData('payment_method', value)}
                            >
                                <SelectTrigger>
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
                            {errors.payment_method && (
                                <p className="text-sm text-destructive">{errors.payment_method}</p>
                            )}
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
                            {errors.reference_number && (
                                <p className="text-sm text-destructive">{errors.reference_number}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="receipt_file">Receipt/Proof of Payment (Optional)</Label>
                            <Input
                                id="receipt_file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-muted-foreground">
                                Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
                            </p>
                            {errors.receipt_file && (
                                <p className="text-sm text-destructive">{errors.receipt_file}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_notes">Notes (Optional)</Label>
                            <Textarea
                                id="client_notes"
                                value={data.client_notes}
                                onChange={(e) => setData('client_notes', e.target.value)}
                                placeholder="Any additional information about this payment"
                                rows={3}
                            />
                            {errors.client_notes && (
                                <p className="text-sm text-destructive">{errors.client_notes}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button asChild variant="outline" type="button">
                                <Link href={route('client.payments.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Payment'}
                            </Button>
                        </div>
                    </form>
                </div>
            </ClientLayout>
        </>
    );
}