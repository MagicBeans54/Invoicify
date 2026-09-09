import React from 'react';
import { toast } from 'sonner';
import { Link2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { copyText } from '@/lib/clipboard';

/**
 * Minimal share menu: copy-link plus caller-provided actions, built on the
 * system DropdownMenu + Button instead of a bespoke popover.
 */
export function ShareMenu({ label, copyValue, actions = [], align = 'end' }) {
    const handleCopy = async () => {
        const ok = await copyText(copyValue);
        if (ok) toast.success('Link copied');
        else toast.error('Could not copy the link');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={label || 'Share'}
                >
                    <Share2 />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="min-w-48">
                <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                    <Link2 />
                    Copy link
                </DropdownMenuItem>
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.label}
                        onClick={action.onSelect}
                        className="cursor-pointer"
                    >
                        {action.icon}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ShareMenu;
