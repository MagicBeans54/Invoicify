import React from 'react';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'sonner';

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
                <>
                    <App {...props} />
                    <Toaster position="top-center" />
                </>
            ));
        } else {
            createRoot(el).render(
                <>
                    <App {...props} />
                    <Toaster position="top-center" />
                </>
            );
        }
    },
    progress: {
        color: '#4b5563',
    },
});
