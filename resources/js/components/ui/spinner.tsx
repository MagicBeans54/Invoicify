import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Spectrum UI — Spinner (vendored).
 *
 * Source: https://github.com/arihantcodes/spectrum-ui
 * File: app/registry/spectrumui/spinner-dependencies.tsx (Apache-2.0)
 */

const spinnerVariants = cva('flex-col items-center justify-center', {
    variants: {
        show: {
            true: 'flex',
            false: 'hidden',
        },
    },
    defaultVariants: {
        show: true,
    },
});

const loaderVariants = cva('animate-spin text-primary', {
    variants: {
        size: {
            small: 'size-6',
            medium: 'size-8',
            large: 'size-12',
        },
    },
    defaultVariants: {
        size: 'medium',
    },
});

export interface SpinnerProps
    extends VariantProps<typeof spinnerVariants>,
        VariantProps<typeof loaderVariants> {
    className?: string;
    children?: React.ReactNode;
}

export function Spinner({ size, show, children, className }: SpinnerProps) {
    return (
        <span className={spinnerVariants({ show })}>
            <Loader2 className={cn(loaderVariants({ size }), className)} />
            {children}
        </span>
    );
}

export default Spinner;
