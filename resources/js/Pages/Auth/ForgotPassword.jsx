import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TechstackMark } from '@/components/TechstackLogo';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
    const { props } = usePage();
    const status = props.status ?? props.flash?.status;
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
                        <CardTitle className="text-2xl">Reset your password</CardTitle>
                        <CardDescription>
                            Enter your account email and we&apos;ll send you a reset link
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div
                                role="status"
                                className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-300"
                            >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                <p>{status}</p>
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
                                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                                Send reset link
                            </LoadingButton>
                            <p className="text-center text-xs leading-relaxed text-muted-foreground">
                                Links expire after 60 minutes. Didn&apos;t arrive? Check spam,
                                then try again — resends are rate-limited to once a minute.
                            </p>
                        </form>
                    </CardContent>
                    <CardContent className="pt-0 text-center text-sm text-muted-foreground">
                        <p>
                            Remembered it?{' '}
                            <Link href={route('login')} className="text-primary hover:underline">
                                Back to log in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </AuthLayout>
    );
}
