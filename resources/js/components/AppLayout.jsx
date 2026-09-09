import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    CreditCard,
    FileText,
    LogOut,
    Settings as SettingsIcon,
    Users,
} from 'lucide-react';
import ShellLayout from '@/components/ShellLayout';

const NAV = [
    { title: 'Invoices', routeName: 'invoices.index', icon: FileText },
    { title: 'Clients', routeName: 'clients.index', icon: Users },
    { title: 'Payments', routeName: 'admin.payments.index', icon: CreditCard },
    { title: 'Settings', routeName: 'settings.index', icon: SettingsIcon },
];

export default function AppLayout(props) {
    const { props: pageProps } = usePage();
    const stats = pageProps.stats;
    const bellCount =
        (stats?.overdueInvoices ?? 0) + (stats?.pendingPayments ?? 0);
    const bellHref =
        (stats?.pendingPayments ?? 0) > 0
            ? route('admin.payments.index')
            : route('invoices.index');

    return (
        <ShellLayout
            nav={NAV}
            brandHref={route('invoices.index')}
            roleLabel="Admin"
            groupLabel="Workspace"
            bellCount={bellCount}
            bellHref={bellHref}
            accountMenu={[
                { label: 'Settings', icon: SettingsIcon, href: route('settings.index') },
                { separator: true },
                { label: 'Log out', icon: LogOut, onClick: () => router.post(route('logout')) },
            ]}
            {...props}
        />
    );
}
