import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { route } from 'ziggy-js';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
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
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { SwipeToDelete } from '@/components/ui/swipe-to-delete';
import { UndoPill } from '@/components/ui/undo-pill';

function parseIsoDate(value) {
    if (!value || typeof value !== 'string') return undefined;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
}

function toIsoDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

// Mirrors the server-side validation in app/Http/Controllers/InvoiceController.php
const invoiceSchema = z.object({
    invoice_number: z.string().optional(),
    contract_number: z.string().optional(),
    invoice_date: z.string().min(1, 'Invoice date is required'),
    due_date: z.string().min(1, 'Due date is required'),
    status: z.enum(['draft', 'sent', 'paid', 'overdue']),
    payment_terms: z.string().optional(),
    company_name: z.string().min(1, 'Company name is required'),
    company_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    company_phone: z.string().optional(),
    company_address: z.string().optional(),
    client_name: z.string().min(1, 'Client name is required'),
    client_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    client_phone: z.string().optional(),
    client_address: z.string().optional(),
    tax_rate: z.coerce.number().min(0, 'Tax cannot be negative'),
    notes: z.string().optional(),
    terms: z.string().optional(),
    items: z
        .array(
            z.object({
                description: z.string().min(1, 'Description is required'),
                quantity: z.coerce
                    .number()
                    .int('Quantity must be a whole number')
                    .min(1, 'Quantity must be at least 1'),
                unit_price: z.coerce.number().min(0, 'Unit price cannot be negative'),
            })
        )
        .min(1, 'Add at least one line item'),
});

function Field({ label, id, error, children }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
export default function InvoiceForm({
    method = 'post',
    action,
    defaultValues,
    submitLabel,
    isEdit = false,
}) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues,
        mode: 'onTouched',
    });

    const [processing, setProcessing] = useState(false);
    const [lastRemoved, setLastRemoved] = useState(null);
    const [removalSeq, setRemovalSeq] = useState(0);

    const { fields, append, remove, insert } = useFieldArray({ control, name: 'items' });

    const items = watch('items') || [];
    const taxRate = Number(watch('tax_rate')) || 0;
    const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
        0
    );
    const tax = subtotal * (taxRate / 100);

    const onValidSubmit = (values) => {
        setProcessing(true);
        const options = {
            onError: (serverErrors) => {
                Object.entries(serverErrors).forEach(([key, message]) => {
                    setError(key, { message });
                });
            },
            onFinish: () => setProcessing(false),
        };

        if (method === 'put') {
            router.put(action, values, options);
        } else {
            router.post(action, values, options);
        }
    };

    const onSubmit = handleSubmit(onValidSubmit);

    const addItem = () => append({ description: '', quantity: 1, unit_price: 0 });
    const removeItem = (index) => {
        if (fields.length <= 1) return;
        const snapshot = getValues(`items.${index}`);
        remove(index);
        setLastRemoved({ item: { ...snapshot }, index });
        setRemovalSeq((n) => n + 1);
    };
    const undoRemoveItem = () => {
        if (!lastRemoved) return;
        insert(lastRemoved.index, lastRemoved.item);
        setLastRemoved(null);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <Card>
                <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Field
                        label="Invoice Number"
                        id="invoice_number"
                        error={errors.invoice_number?.message}
                    >
                        <Input
                            id="invoice_number"
                            {...register('invoice_number')}
                            disabled={!isEdit}
                            placeholder={!isEdit ? 'Auto-generated on save' : ''}
                            className={!isEdit ? 'bg-muted' : ''}
                        />
                    </Field>

                    <Field
                        label="Contract Number"
                        id="contract_number"
                        error={errors.contract_number?.message}
                    >
                        <Input
                            id="contract_number"
                            {...register('contract_number')}
                            placeholder="Optional"
                        />
                    </Field>

                    <Field
                        label="Invoice Date"
                        id="invoice_date"
                        error={errors.invoice_date?.message}
                    >
                        <Controller
                            control={control}
                            name="invoice_date"
                            render={({ field }) => (
                                <DateTimePicker
                                    granularity="day"
                                    placeholder="Pick invoice date"
                                    value={parseIsoDate(field.value)}
                                    onChange={(date) => field.onChange(toIsoDate(date))}
                                />
                            )}
                        />
                    </Field>

                    <Field
                        label="Due Date"
                        id="due_date"
                        error={errors.due_date?.message}
                    >
                        <Controller
                            control={control}
                            name="due_date"
                            render={({ field }) => (
                                <DateTimePicker
                                    granularity="day"
                                    placeholder="Pick due date"
                                    value={parseIsoDate(field.value)}
                                    onChange={(date) => field.onChange(toIsoDate(date))}
                                />
                            )}
                        />
                    </Field>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
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
                            )}
                        />
                        {errors.status?.message && (
                            <p className="text-sm text-destructive">{errors.status.message}</p>
                        )}
                    </div>

                    <Field
                        label="Payment Terms"
                        id="payment_terms"
                        error={errors.payment_terms?.message}
                    >
                        <Input
                            id="payment_terms"
                            {...register('payment_terms')}
                            placeholder="e.g., Net 30, Due on receipt"
                        />
                    </Field>
                </CardContent>
            </Card>
<div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardContent className="space-y-4 p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            From
                        </p>
                        <Field
                            label="Company Name"
                            id="company_name"
                            error={errors.company_name?.message}
                        >
                            <Input id="company_name" {...register('company_name')} />
                        </Field>
                        <Field
                            label="Email"
                            id="company_email"
                            error={errors.company_email?.message}
                        >
                            <Input
                                id="company_email"
                                type="email"
                                {...register('company_email')}
                            />
                        </Field>
                        <Field
                            label="Phone"
                            id="company_phone"
                            error={errors.company_phone?.message}
                        >
                            <Input id="company_phone" {...register('company_phone')} />
                        </Field>
                        <Field
                            label="Address"
                            id="company_address"
                            error={errors.company_address?.message}
                        >
                            <Controller
                                control={control}
                                name="company_address"
                                render={({ field: { ref, ...field } }) => (
                                    <AutosizeTextarea
                                        id="company_address"
                                        minHeight={40}
                                        maxHeight={160}
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            To
                        </p>
                        <Field
                            label="Client Name"
                            id="client_name"
                            error={errors.client_name?.message}
                        >
                            <Input id="client_name" {...register('client_name')} />
                        </Field>
                        <Field
                            label="Email"
                            id="client_email"
                            error={errors.client_email?.message}
                        >
                            <Input id="client_email" type="email" {...register('client_email')} />
                        </Field>
                        <Field
                            label="Phone"
                            id="client_phone"
                            error={errors.client_phone?.message}
                        >
                            <Input id="client_phone" {...register('client_phone')} />
                        </Field>
                        <Field
                            label="Address"
                            id="client_address"
                            error={errors.client_address?.message}
                        >
                            <Controller
                                control={control}
                                name="client_address"
                                render={({ field: { ref, ...field } }) => (
                                    <AutosizeTextarea
                                        id="client_address"
                                        minHeight={40}
                                        maxHeight={160}
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
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
                        {fields.map((field, index) => (
                            <SwipeToDelete
                                key={field.id}
                                label={`Line item ${index + 1}`}
                                disabled={fields.length <= 1}
                                showButtonOnHover={false}
                                onDelete={() => removeItem(index)}
                            >
                            <div className="flex flex-wrap items-start gap-3 p-2.5">
                                <div className="min-w-full flex-1 space-y-1.5 sm:min-w-0">
                                    <Input
                                        placeholder="Description"
                                        {...register(`items.${index}.description`)}
                                    />
                                    {errors.items?.[index]?.description?.message && (
                                        <p className="text-sm text-destructive">
                                            {errors.items[index].description.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-28 space-y-1.5">
                                    <Controller
                                        control={control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <QuantityStepper
                                                size="sm"
                                                min={1}
                                                max={9999}
                                                value={Number(field.value) || 1}
                                                onValueChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.quantity?.message && (
                                        <p className="text-sm text-destructive">
                                            {errors.items[index].quantity.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1.5 sm:w-32 sm:flex-none">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        aria-label="Unit price"
                                        {...register(`items.${index}.unit_price`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.items?.[index]?.unit_price?.message && (
                                        <p className="text-sm text-destructive">
                                            {errors.items[index].unit_price.message}
                                        </p>
                                    )}
                                </div>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Remove line item ${index + 1}`}
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                )}
                            </div>
                            </SwipeToDelete>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="mt-4"
                    >
                        <Plus />
                        Add Item
                    </Button>

                    <Separator className="my-6" />

                    <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="tabular-nums">₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Tax (%)</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="h-7 w-20 text-right tabular-nums"
                                {...register('tax_rate', { valueAsNumber: true })}
                            />
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="tabular-nums">₱{(subtotal + tax).toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <Field label="Notes" id="notes" error={errors.notes?.message}>
                        <Controller
                            control={control}
                            name="notes"
                            render={({ field: { ref, ...field } }) => (
                                <AutosizeTextarea
                                    id="notes"
                                    minHeight={60}
                                    maxHeight={240}
                                    placeholder="Notes for the client"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <Field label="Terms" id="terms" error={errors.terms?.message}>
                        <Controller
                            control={control}
                            name="terms"
                            render={({ field: { ref, ...field } }) => (
                                <AutosizeTextarea
                                    id="terms"
                                    minHeight={60}
                                    maxHeight={240}
                                    placeholder="Payment terms and conditions for this invoice"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={route('invoices.index')}>Cancel</Link>
                </Button>
                <LoadingButton type="submit" size="sm" loading={processing}>
                    {submitLabel}
                </LoadingButton>
            </div>

            <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-max max-w-[calc(100vw-3rem)] -translate-x-1/2">
                <UndoPill
                    key={removalSeq}
                    open={!!lastRemoved}
                    label="Line item removed"
                    duration={6}
                    onUndo={undoRemoveItem}
                    onExpire={() => setLastRemoved(null)}
                />
            </div>
        </form>
    );
}