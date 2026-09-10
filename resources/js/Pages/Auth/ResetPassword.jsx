import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TechstackMark } from '@/components/TechstackLogo';
import { LoadingButton } from '@/components/ui/loading-button';
import { PasswordStrengthInput } from '@/components/ui/password-strength';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword({ token, email: initialEmail = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: initialEmail,
        password: '',
        password_confirmation: '',
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const reduce = useReducedMotion();
    const mismatch =
        data.password_confirmation.length > 0 && data.password_confirmation !== data.password;
    const tokenFailed =
        !!errors.email && /token|expired|invalid/i.test(errors.email);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('password.update'));
    }

    return (
        <AuthLayout title="Choose a new password">
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mb-6 flex items-center justify-center gap-2.5 lg:hidden"
            >
                <TechstackMark className="size-9" />
                <span className="text-lg font-semibold tracking-tight text-primary">Invoicify</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
            >
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Choose a new password</CardTitle>
                        <CardDescription>
                            Almost done — pick a strong password to get back to your invoices
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tokenFailed && (
                            <div
                                role="alert"
                                className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                            >
                                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                <p>
                                    {errors.email}{' '}
                                    <Link
                                        href={route('password.request')}
                                        className="font-medium underline underline-offset-2"
                                    >
                                        Request a fresh link
                                    </Link>
                                </p>
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span aria-hidden="true" className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email && !tokenFailed ? 'email-error' : undefined}
                                    className="h-10"
                                />
                                {errors.email && !tokenFailed && (
                                    <p id="email-error" role="alert" className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    New password <span aria-hidden="true" className="text-destructive">*</span>
                                </Label>
                                <PasswordStrengthInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onValueChange={(value) => setData('password', value)}
                                    placeholder="Choose a password (8+ characters)"
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
                                <Label htmlFor="password_confirmation">
                                    Confirm new password{' '}
                                    <span aria-hidden="true" className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmation ? 'text' : 'password'}
                                        placeholder="Repeat your new password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password_confirmation || mismatch}
                                        aria-describedby={
                                            errors.password_confirmation || mismatch
                                                ? 'password-confirmation-error'
                                                : undefined
                                        }
                                        className="h-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmation((prev) => !prev)}
                                        className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
                                        aria-label={showConfirmation ? 'Hide password' : 'Show password'}
                                        aria-pressed={showConfirmation}
                                    >
                                        {showConfirmation ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p
                                        id="password-confirmation-error"
                                        role="alert"
                                        className="text-sm text-destructive"
                                    >
                                        {errors.password_confirmation}
                                    </p>
                                )}
                                {!errors.password_confirmation && mismatch && (
                                    <p
                                        id="password-confirmation-error"
                                        role="alert"
                                        className="text-sm text-destructive"
                                    >
                                        Passwords don&apos;t match yet — keep typing.
                                    </p>
                                )}
                            </div>
                            <LoadingButton type="submit" className="w-full" loading={processing}>
                                Reset password
                            </LoadingButton>
                        </form>
                    </CardContent>
                    <CardContent className="pt-0 text-center text-sm text-muted-foreground">
                        <p>
                            Link expired?{' '}
                            <Link href={route('password.request')} className="text-primary hover:underline">
                                Request a new one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </AuthLayout>
    );
}
