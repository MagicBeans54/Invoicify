import * as React from 'react';
import { Slot } from 'radix-ui';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';
import type { VariantProps } from 'class-variance-authority';

export interface LoadingButtonProps
    extends React.ComponentProps<'button'>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

function LoadingButton({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
}: LoadingButtonProps) {
    const isDisabled = disabled || loading;
    const spinner = loading && (
        <Loader2 className={cn('size-4 animate-spin', children && 'mr-2')} aria-hidden="true" />
    );

    if (asChild) {
        return (
            <Slot.Root
                data-slot="button"
                data-variant={variant}
                data-size={size}
                className={cn(buttonVariants({ variant, size, className }))}
                aria-disabled={isDisabled}
                {...props}
            >
                <>
                    {React.Children.map(
                        children as React.ReactElement<{
                            className?: string;
                            children?: React.ReactNode;
                        }>,
                        (child: React.ReactElement<{ className?: string; children?: React.ReactNode }>) => {
                            if (!React.isValidElement(child)) return child;
                            return React.cloneElement(child, {
                                children: (
                                    <>
                                        {spinner}
                                        {child.props.children}
                                    </>
                                ),
                            });
                        }
                    )}
                </>
            </Slot.Root>
        );
    }

    return (
        <button
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={isDisabled}
            {...props}
        >
            {spinner}
            {children}
        </button>
    );
}

export { LoadingButton };
export default LoadingButton;
