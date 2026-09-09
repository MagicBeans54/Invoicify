import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PasswordVisibilityToggle({ visible, onClick, disabled, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className={cn(
                'absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 touch-manipulation select-none items-center justify-center rounded-md text-muted-foreground transition-colors',
                'hover:bg-muted hover:text-foreground active:bg-muted/70',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                className
            )}
        >
            {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
            )}
        </button>
    );
}

export default PasswordVisibilityToggle;
