import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { TechstackMark } from '@/components/TechstackLogo';
import { PasswordVisibilityToggle } from '@/components/ui/password-visibility-toggle';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const reduce = useReducedMotion();

    function handleSubmit(e) {
        e.preventDefault();
        post(route('login.post'));
    }

    return (
        <AuthLayout title="Log in">
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mb-6 flex flex-col items-center gap-1.5 lg:hidden"
            >
                <div className="flex items-center gap-2.5">
                    <TechstackMark className="size-9" />
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
                    <CardTitle className="text-2xl">Log in</CardTitle>
                    <CardDescription>Welcome back — access invoices, track totals, download PDFs</CardDescription>
                </CardHeader>
                <CardContent>
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {/* No password-reset route exists yet — show non-navigating help instead of a broken link */}
                                <span
                                    className="text-xs text-muted-foreground"
                                    title="Contact your administrator to reset your password"
                                >
                                    Forgot password?
                                </span>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    className="h-10 pr-10"
                                />
                                <PasswordVisibilityToggle
                                    visible={showPassword}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                />
                            </div>
                            {errors.password && (
                                <p id="password-error" role="alert" className="text-sm text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Log in
                        </LoadingButton>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-center text-sm text-muted-foreground">
                    <p>Don&apos;t have an account?{' '}
                        <Link href={route('register')} className="text-primary-ink hover:underline dark:text-primary">
                            Create account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            </motion.div>
        </AuthLayout>
    );
}
