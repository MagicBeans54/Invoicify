import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { TechstackMark } from '@/components/TechstackLogo';
import { Eye, EyeOff } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <AuthLayout title="Login">
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
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Welcome back to Invoicify</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Login
                        </LoadingButton>
                    </form>
                </CardContent>
                <CardContent className="pt-0 text-center text-sm text-muted-foreground">
                    <p>Don't have an account?{' '}
                        <Link href={route('register')} className="text-primary hover:underline">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
            </motion.div>
        </AuthLayout>
    );
}