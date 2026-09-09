import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { InvoicifyMark } from '@/components/InvoicifyLogo';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const reduce = useReducedMotion();

    function handleSubmit(e) {
        e.preventDefault();
        post(route('password.email'));
    }

    return (
        <AuthLayout title="Forgot password">
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
                    <CardTitle className="text-2xl">Reset your password</CardTitle>
                    <CardDescription>Enter your account email and we&apos;ll send a reset link</CardDescription>
                </CardHeader>
                <CardContent>
                    {status && (
                        <p role="status" className="mb-4 rounded-lg bg-success/10 px-3 py-2.5 text-sm text-success">
                            {status}
                        </p>
                    )}
                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Send reset link
                        </LoadingButton>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-center text-sm text-muted-foreground">
                    <p>Remembered it?{' '}
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
