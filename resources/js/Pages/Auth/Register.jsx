import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useReducedMotion } from 'framer-motion';
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
        phone: '',
        address: '',
    });
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const reduce = useReducedMotion();

    function handleSubmit(e) {
        e.preventDefault();
        post(route('register.store'), {
            ...data,
            role: 'client', // Default to client role
        });
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mb-6 flex items-center gap-2.5"
            >
                <TechstackMark className="size-9" />
                <span className="text-lg font-semibold tracking-tight text-primary">Invoicify</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Registration</CardTitle>
                    <CardDescription>Create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jane Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
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
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                    aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                                >
                                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="+1 234 567 890"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address (Optional)</Label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="123 Main St, City, Country"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                        </div>
                        <LoadingButton type="submit" className="w-full" loading={processing}>
                            Register
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
        </div>
    );
}