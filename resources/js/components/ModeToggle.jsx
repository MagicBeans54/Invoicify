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
    document.body.classList.add('theme-anim');
    window.clearTimeout(window.__themeAnimTimer);
    window.__themeAnimTimer = window.setTimeout(() => {
        document.body.classList.remove('theme-anim');
    }, 400);
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export default function ModeToggle() {
    const [theme, setThemeState] = useState(getTheme);

    useEffect(() => {
        // Reconcile with the persisted choice on mount (first paint is set by
        // the inline script in app.blade.php; this covers client routing).
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored === 'dark' || stored === 'light') {
                setTheme(stored);
                setThemeState(stored);
            }
        } catch {
        }
        const onChange = (e) => setThemeState(e.detail);
        const onStorage = (e) => {
            if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
                setTheme(e.newValue);
                setThemeState(e.newValue);
            }
        };
        window.addEventListener(THEME_EVENT, onChange);
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener(THEME_EVENT, onChange);
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    const next = theme === 'dark' ? 'light' : 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} mode`}
            title={`Switch to ${next} mode`}
        >
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
