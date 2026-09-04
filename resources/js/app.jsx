import React from 'react';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { THEME_EVENT } from '@/components/ModeToggle';

const appName =
    document.querySelector('meta[name="app-name"]')?.content || 'Invoicify';

// Follows the ModeToggle (`dark` class on <html>) so toasts match the theme.
function ThemedToaster() {
    const [theme, setTheme] = React.useState(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    React.useEffect(() => {
        const onChange = (e) => setTheme(e.detail);
        window.addEventListener(THEME_EVENT, onChange);
        return () => window.removeEventListener(THEME_EVENT, onChange);
    }, []);
    return <Toaster position="top-center" theme={theme} />;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        if (props.initialPage.props?.ziggy) {
            window.Ziggy = props.initialPage.props.ziggy;
        }
        if (import.meta.env.SSR) {
            hydrateRoot(el, (
                <TooltipProvider>
                    <App {...props} />
                    <ThemedToaster />
                </TooltipProvider>
            ));
        } else {
            createRoot(el).render(
                <TooltipProvider>
                    <App {...props} />
                    <ThemedToaster />
                </TooltipProvider>
            );
        }
    },
    progress: {
        color: '#24D6AE',
    },
});
