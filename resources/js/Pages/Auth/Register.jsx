import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { TechstackMark } from '@/components/TechstackLogo';
import { Eye, EyeOff } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button';
import { PasswordStrengthInput } from '@/components/ui/password-strength';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

export default function RegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const reduce = useReducedMotion();
    const passwordMismatch = data.password_confirmation.length > 0 && data.password_confirmation !== data.password;

    function handleSubmit(e) {
        e.preventDefault();
        post(route('register.store'), {
            ...data,
            role: 'client', // Default to client role
        });
    }

    return (
        <AuthLayout title="Register">
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
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>Access your invoices and payments</CardDescription>
                    <p className="pt-1 text-xs text-muted-foreground">You&apos;re creating a client account. Need an admin account? Contact your workspace owner.</p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name <span aria-hidden="true" className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jane Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                                className="h-10"
                            />
                            {errors.name && <p id="name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email <span aria-hidden="true" className="text-destructive">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                className="h-10"
                            />
                            {errors.email && <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password <span aria-hidden="true" className="text-destructive">*</span></Label>
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
                            {errors.password && <p id="password-error" role="alert" className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm password <span aria-hidden="true" className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    placeholder="Repeat your password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    aria-invalid={!!errors.password_confirmation || passwordMismatch}
                                    aria-describedby={errors.password_confirmation || passwordMismatch ? 'password-confirmation-error' : undefined}
                                    className="h-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                                    className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
                                    aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                                    aria-pressed={showPasswordConfirmation}
                                >
                                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p id="password-confirmation-error" role="alert" className="text-sm text-destructive">{errors.password_confirmation}</p>}
                            {!errors.password_confirmation && passwordMismatch && <p id="password-confirmation-error" role="alert" className="text-sm text-destructive">Passwords don&apos;t match yet — keep typing.</p>}
                        </div>
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Create account
                        </LoadingButton>
                    </form>
                </CardContent>
                <CardContent className="pt-0 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-primary hover:underline">
                        Login
                    </Link>
                </CardContent>
            </Card>
            </motion.div>
        </AuthLayout>
    );
}