import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { CreditCard, FileText, LogOut } from 'lucide-react';
import ShellLayout from '@/components/ShellLayout';

const NAV = [
    { title: 'My Invoices', routeName: 'client.dashboard', icon: FileText },
    { title: 'My Payments', routeName: 'client.payments.index', icon: CreditCard },
];

export default function ClientLayout(props) {
    const { props: pageProps } = usePage();
    const stats = pageProps.stats;
    const bellCount = stats?.overdueInvoices ?? 0;
    const bellHref = route('client.dashboard');

    return (
        <ShellLayout
            nav={NAV}
            brandHref={route('client.dashboard')}
            roleLabel="Client"
            groupLabel="My Account"
            bellCount={bellCount}
            bellHref={bellHref}
            accountMenu={[
                { label: 'Log out', icon: LogOut, onClick: () => router.post(route('logout')) },
            ]}
            {...props}
        />
    );
}
