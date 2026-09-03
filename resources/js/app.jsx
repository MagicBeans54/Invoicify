import React from 'react';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const appName =
    document.querySelector('meta[name="app-name"]')?.content || 'Invoicify';

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
                    <Toaster position="top-center" />
                </TooltipProvider>
            ));
        } else {
            createRoot(el).render(
                <TooltipProvider>
                    <App {...props} />
                    <Toaster position="top-center" />
                </TooltipProvider>
            );
        }
    },
    progress: {
        color: '#4b5563',
    },
});
