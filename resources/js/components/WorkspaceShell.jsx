import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    ChevronsUpDown,
    CreditCard,
    FileText,
    LogOut,
    Settings as SettingsIcon,
    Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import FlashToaster from '@/components/FlashToaster';
import ModeToggle from '@/components/ModeToggle';
import PageTransition from '@/components/PageTransition';
import { TechstackMark } from '@/components/TechstackLogo';
import { NotificationBell } from '@/components/ui/notification-bell';

const NAV = {
    admin: {
        home: 'invoices.index',
        eyebrow: 'Admin workspace',
        group: 'Workspace',
        showSettings: true,
        routes: [
            { title: 'Invoices', routeName: 'invoices.index', icon: FileText },
            { title: 'Clients', routeName: 'clients.index', icon: Users },
            { title: 'Payments', routeName: 'admin.payments.index', icon: CreditCard },
            { title: 'Settings', routeName: 'settings.index', icon: SettingsIcon },
        ],
    },
    client: {
        home: 'client.dashboard',
        eyebrow: 'Client portal',
        group: 'My Account',
        showSettings: false,
        routes: [
            { title: 'My Invoices', routeName: 'client.dashboard', icon: FileText },
            { title: 'My Payments', routeName: 'client.payments.index', icon: CreditCard },
        ],
    },
};

function initials(name) {
    return (name || '?')
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function BellMenu({ variant, stats }) {
    const overdue = stats?.overdueInvoices ?? 0;
    const pending = stats?.pendingPayments ?? 0;
    const count = overdue + pending;
    const overdueItems = stats?.overdueItems ?? [];
    const pendingItems = variant === 'admin' ? stats?.pendingItems ?? [] : [];

    const parts = [];
    if (overdue > 0) parts.push(`${overdue} overdue invoice${overdue === 1 ? '' : 's'}`);
    if (pending > 0) parts.push(`${pending} payment${pending === 1 ? '' : 's'} to review`);
    const summary = count === 0 ? 'No new notifications' : parts.join(' · ');

    const overdueLinks = overdueItems.map((item) => ({
        key: `inv-${item.id}`,
        title: item.invoice_number,
        sub: variant === 'admin' ? `${item.client_name} · ₱${item.total}` : `₱${item.total}`,
        href:
            variant === 'admin'
                ? route('invoices.show', item.id)
                : route('client.invoices.show', item.id),
    }));
    const pendingLinks = pendingItems.map((item) => ({
        key: `pay-${item.id}`,
        title: item.reference_number || `Payment #${item.id}`,
        sub: `₱${item.amount}${item.invoice_number ? ` · ${item.invoice_number}` : ''}`,
        href: route('admin.payments.show', item.id),
    }));

    const viewAllHref =
        variant === 'admin'
            ? pending > 0
                ? route('admin.payments.index')
                : route('invoices.index')
            : route('client.dashboard');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <NotificationBell count={count} size="sm" className="h-8 w-8" title={summary} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-80">
                <DropdownMenuLabel>
                    <span className="font-medium">Notifications</span>
                    <span className="block text-xs font-normal text-muted-foreground">{summary}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {overdueLinks.length > 0 && (
                    <>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Overdue invoices ({overdueLinks.length})
                        </DropdownMenuLabel>
                        {overdueLinks.map((item) => (
                            <DropdownMenuItem key={item.key} asChild className="flex-col items-start gap-1">
                                <Link href={item.href}>
                                    <span className="w-full truncate text-sm font-medium">{item.title}</span>
                                    <span className="tnum text-xs text-muted-foreground">{item.sub}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                    </>
                )}
                {pendingLinks.length > 0 && (
                    <>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Payments to review ({pendingLinks.length})
                        </DropdownMenuLabel>
                        {pendingLinks.map((item) => (
                            <DropdownMenuItem key={item.key} asChild className="flex-col items-start gap-1">
                                <Link href={item.href}>
                                    <span className="w-full truncate text-sm font-medium">{item.title}</span>
                                    <span className="tnum text-xs text-muted-foreground">{item.sub}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                    </>
                )}
                {count === 0 && (
                    <>
                        <p className="px-2 py-4 text-center text-sm text-muted-foreground">All caught up.</p>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem asChild>
                    <Link href={viewAllHref} className="justify-center text-sm font-medium">
                        View all
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function WorkspaceShell({ variant, title, subtitle, crumbs, actions, children }) {
    const config = NAV[variant] ?? NAV.admin;
    const { url, props } = usePage();
    const user = props.auth?.user;
    const stats = props.stats;
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const items = config.routes.map((item) => {
        const itemUrl = route(item.routeName);
        return {
            ...item,
            url: itemUrl,
            isActive: url === itemUrl || url.startsWith(`${itemUrl}/`),
        };
    });

    const root = items.find((item) => item.isActive) ?? items[0];
    const trail = crumbs ?? [
        { label: root.title, href: root.url },
        ...(title && title !== root.title ? [{ label: title, href: null }] : []),
    ];

    function handleLogoutSelect(e) {
        e.preventDefault();
        if (confirmingLogout) {
            setConfirmingLogout(false);
            router.post(route('logout'));
        } else {
            setConfirmingLogout(true);
        }
    }

    return (
        <SidebarProvider style={{ '--sidebar-width': '13.5rem' }} className="bg-sidebar">
            <FlashToaster />
            <Sidebar collapsible="icon" className="border-0">
                <SidebarHeader className="h-14 justify-center border-0 px-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link
                                href={route(config.home)}
                                className="flex h-10 items-center gap-2.5 rounded-lg px-2 transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                            >
                                <TechstackMark className="size-7 shrink-0" />
                                <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate text-sm font-semibold tracking-tight text-primary">
                                        Invoicify
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {config.eyebrow}
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>{config.group}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.routeName}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                            tooltip={item.title}
                                            className="h-9 gap-3 rounded-lg font-medium transition-[width,height,padding,background-color,color] duration-150 data-active:bg-primary/10 data-active:text-primary data-active:font-semibold [&_svg]:text-muted-foreground data-active:[&_svg]:text-primary"
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                                {item.isActive && (
                                                    <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu
                                onOpenChange={(open) => {
                                    if (!open) setConfirmingLogout(false);
                                }}
                            >
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-1"
                                    >
                                        <Avatar className="size-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg">
                                                {initials(user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {user?.name || 'Account'}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user?.email || ''}
                                            </span>
                                        </span>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="top"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="size-8 rounded-lg">
                                                <AvatarFallback className="rounded-lg">
                                                    {initials(user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">
                                                    {user?.name || 'Account'}
                                                </span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {user?.email || ''}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {config.showSettings && (
                                        <>
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link href={route('settings.index')}>
                                                    <SettingsIcon />
                                                    Settings
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem className="cursor-pointer" onSelect={handleLogoutSelect}>
                                        <LogOut />
                                        {confirmingLogout ? 'Click again to confirm logout' : 'Log out'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="bg-sidebar">
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-0 bg-sidebar px-4">
                    <SidebarTrigger className="-ml-1 h-8 w-8 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
                    {trail.length > 1 && (
                        <div className="min-w-0 flex-1">
                            <Breadcrumb>
                                <BreadcrumbList className="flex-nowrap overflow-hidden">
                                    {trail.map((crumb, index) => {
                                        const isLast = index === trail.length - 1;
                                        return (
                                            <React.Fragment key={`${crumb.label}-${index}`}>
                                                <BreadcrumbItem className="min-w-0">
                                                    {isLast || !crumb.href ? (
                                                        <BreadcrumbPage className="truncate">
                                                            {crumb.label}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink asChild className="truncate">
                                                            <Link href={crumb.href}>
                                                                {crumb.label}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                                {!isLast && <BreadcrumbSeparator />}
                                            </React.Fragment>
                                        );
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    )}
                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                        <ModeToggle />
                        <BellMenu variant={variant} stats={stats} />
                    </div>
                </header>
                <main className="min-h-[calc(100svh-3.5rem)] flex-1 bg-background px-4 py-6 sm:px-6 sm:py-8 md:rounded-tl-2xl">
                    <PageTransition pageKey={url} className="mx-auto max-w-5xl">
                        {(title || subtitle || actions) && (
                            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    {title && (
                                        <h1 className="text-xl font-semibold tracking-tight">
                                            {title}
                                        </h1>
                                    )}
                                    {subtitle && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                {actions && (
                                    <div className="flex items-center gap-2">
                                        {actions}
                                    </div>
                                )}
                            </div>
                        )}
                        {children}
                    </PageTransition>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
