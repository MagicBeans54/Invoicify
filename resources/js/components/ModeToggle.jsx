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
