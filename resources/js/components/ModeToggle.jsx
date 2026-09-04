import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const THEME_KEY = 'invoicify-theme';
export const THEME_EVENT = 'invoicify:theme';

export function getTheme() {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        // Private browsing etc. — theme just won't persist.
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

/**
 * Navbar light/dark toggle. Reads the `dark` class on <html> (see the
 * pre-paint script in app.blade.php, default dark) and broadcasts changes so
 * other theme-aware UI (e.g. the sonner Toaster) can follow.
 */
export default function ModeToggle() {
    const [theme, setThemeState] = useState(getTheme);

    useEffect(() => {
        const onChange = (e) => setThemeState(e.detail);
        window.addEventListener(THEME_EVENT, onChange);
        return () => window.removeEventListener(THEME_EVENT, onChange);
    }, []);

    const next = theme === 'dark' ? 'light' : 'dark';

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} mode`}
            title={`Switch to ${next} mode`}
        >
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
