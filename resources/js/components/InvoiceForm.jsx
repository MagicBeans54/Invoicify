import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function Field({ label, id, error, children }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export default function InvoiceForm({ data, setData, errors, processing, onSubmit, submitLabel }) {
    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const subtotal = data.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
    );
    const tax = subtotal * (data.tax_rate / 100);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Card>
                <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Field
                        label="Invoice Number"
                        id="invoice_number"
                        error={errors.invoice_number}
                    >
                        <Input
                            id="invoice_number"
                            value={data.invoice_number}
                            onChange={(e) => setData('invoice_number', e.target.value)}
                        />
                    </Field>
                    <Field label="Invoice Date" id="invoice_date" error={errors.invoice_date}>
                        <Input
                            id="invoice_date"
                            type="date"
                            value={data.invoice_date}
                            onChange={(e) => setData('invoice_date', e.target.value)}
                        />
                    </Field>
                    <Field label="Due Date" id="due_date" error={errors.due_date}>
                        <Input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                        />
                    </Field>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-destructive">{errors.status}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardContent className="space-y-4 p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            From
                        </p>
                        <Field label="Company Name" id="company_name" error={errors.company_name}>
                            <Input
                                id="company_name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                            />
                        </Field>
                        <Field label="Email" id="company_email" error={errors.company_email}>
                            <Input
                                id="company_email"
                                type="email"
                                value={data.company_email}
                                onChange={(e) => setData('company_email', e.target.value)}
                            />
                        </Field>
                        <Field label="Phone" id="company_phone" error={errors.company_phone}>
                            <Input
                                id="company_phone"
                                value={data.company_phone}
                                onChange={(e) => setData('company_phone', e.target.value)}
                            />
                        </Field>
                        <Field label="Address" id="company_address" error={errors.company_address}>
                            <Textarea
                                id="company_address"
                                rows={2}
                                value={data.company_address}
                                onChange={(e) => setData('company_address', e.target.value)}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            To
                        </p>
                        <Field label="Client Name" id="client_name" error={errors.client_name}>
                            <Input
                                id="client_name"
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                            />
                        </Field>
                        <Field label="Email" id="client_email" error={errors.client_email}>
                            <Input
                                id="client_email"
                                type="email"
                                value={data.client_email}
                                onChange={(e) => setData('client_email', e.target.value)}
                            />
                        </Field>
                        <Field label="Phone" id="client_phone" error={errors.client_phone}>
                            <Input
                                id="client_phone"
                                value={data.client_phone}
                                onChange={(e) => setData('client_phone', e.target.value)}
                            />
                        </Field>
                        <Field label="Address" id="client_address" error={errors.client_address}>
                            <Textarea
                                id="client_address"
                                rows={2}
                                value={data.client_address}
                                onChange={(e) => setData('client_address', e.target.value)}
                            />
                        </Field>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Items
                    </p>
                    <div className="space-y-3">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-1 space-y-1.5">
                                    <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) =>
                                            updateItem(index, 'description', e.target.value)
                                        }
                                    />
                                    {errors[`items.${index}.description`] && (
                                        <p className="text-sm text-destructive">
                                            {errors[`items.${index}.description`]}
                                        </p>
                                    )}
                                </div>
                                <div className="w-24 space-y-1.5">
                                    <Input
                                        type="number"
                                        min="1"
                                        aria-label="Quantity"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'quantity',
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                    />
                                    {errors[`items.${index}.quantity`] && (
                                        <p className="text-sm text-destructive">
                                            {errors[`items.${index}.quantity`]}
                                        </p>
                                    )}
                                </div>
                                <div className="w-32 space-y-1.5">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        aria-label="Unit price"
                                        value={item.unit_price}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'unit_price',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                    {errors[`items.${index}.unit_price`] && (
                                        <p className="text-sm text-destructive">
                                            {errors[`items.${index}.unit_price`]}
                                        </p>
                                    )}
                                </div>
                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-4">
                        <Plus />
                        Add Item
                    </Button>

                    <Separator className="my-6" />

                    <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Tax (%)</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="h-7 w-20 text-right tabular-nums"
                                value={data.tax_rate}
                                onChange={(e) =>
                                    setData('tax_rate', parseFloat(e.target.value) || 0)
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="tabular-nums">
                                ${(subtotal + tax).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <Field label="Notes" id="notes" error={errors.notes}>
                        <Textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </Field>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={route('invoices.index')}>Cancel</Link>
                </Button>
                <Button type="submit" size="sm" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
