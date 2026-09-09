import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { InvoicifyMark } from '@/components/InvoicifyLogo';
import { LoadingButton } from '@/components/ui/loading-button';
import { PasswordStrengthInput } from '@/components/ui/password-strength';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

export default function RegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
    });
    const reduce = useReducedMotion();

    function handleSubmit(e) {
        e.preventDefault();
        post(route('register.store'));
    }

    return (
        <AuthLayout title="Create your account">
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mb-6 flex flex-col items-center gap-1.5 lg:hidden"
            >
                <div className="flex items-center gap-2.5">
                    <InvoicifyMark className="size-9" />
                    <span className="font-display text-lg font-semibold tracking-tight text-primary-ink dark:text-primary">Invoicify</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Professional invoicing — live totals &amp; PDF delivery
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
            >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>Start invoicing in minutes — live totals and PDF delivery included</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <p className="text-xs text-muted-foreground">
                            All fields required unless marked optional.
                        </p>
                        <fieldset className="space-y-4">
                            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Account
                            </legend>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="Jane Doe"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    className="h-10"
                                />
                                {errors.name && (
                                    <p id="name-error" role="alert" className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className="h-10"
                                />
                                {errors.email && (
                                    <p id="email-error" role="alert" className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </fieldset>
                        <fieldset className="space-y-4">
                            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Security
                            </legend>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordStrengthInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onValueChange={(value) => setData('password', value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    rules={[
                                        { label: 'At least 8 characters (required)', test: (value) => value.length >= 8 },
                                        { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
                                        { label: 'One number', test: (value) => /[0-9]/.test(value) },
                                    ]}
                                />
                                {errors.password && (
                                    <p id="password-error" role="alert" className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <PasswordStrengthInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onValueChange={(value) => setData('password_confirmation', value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    showMeter={false}
                                    showChecklist={false}
                                    aria-invalid={Boolean(errors.password_confirmation)}
                                    aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                                />
                                {errors.password_confirmation && (
                                    <p id="password-confirmation-error" role="alert" className="text-sm text-destructive">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </fieldset>
                        <details className="group rounded-lg border border-input px-3 py-2.5">
                            <summary className="cursor-pointer text-sm font-medium text-foreground">
                                Billing details <span className="font-normal text-muted-foreground">(optional — add later)</span>
                            </summary>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Used to prefill your invoices. You can skip this and add it when creating your first invoice.
                            </p>
                            <div className="mt-3 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone <span className="font-normal text-muted-foreground">(optional)</span></Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+1 234 567 890"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        aria-invalid={Boolean(errors.phone)}
                                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                                        className="h-10"
                                    />
                                    {errors.phone && (
                                        <p id="phone-error" role="alert" className="text-sm text-destructive">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address <span className="font-normal text-muted-foreground">(optional)</span></Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        autoComplete="street-address"
                                        placeholder="123 Main St, City, Country"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        aria-invalid={Boolean(errors.address)}
                                        aria-describedby={errors.address ? 'address-error' : undefined}
                                        className="h-10"
                                    />
                                    {errors.address && (
                                        <p id="address-error" role="alert" className="text-sm text-destructive">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </details>
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Create account
                        </LoadingButton>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            By creating an account you agree to our Terms and Privacy Policy.
                        </p>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-center text-sm text-muted-foreground">
                    <p>Already have an account?{' '}
                        <Link href={route('login')} className="text-primary-ink hover:underline dark:text-primary">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            </motion.div>
        </AuthLayout>
    );
}
