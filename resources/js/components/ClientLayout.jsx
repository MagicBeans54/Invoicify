import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ChevronsUpDown, CreditCard, FileText, LogOut } from 'lucide-react';
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

const navConfig = [
    { title: 'My Invoices', routeName: 'client.dashboard', icon: FileText },
    { title: 'My Payments', routeName: 'client.payments.index', icon: CreditCard },
];

function initials(name) {
    return (name || '?')
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function ClientLayout({ title, subtitle, crumbs, actions, children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const items = navConfig.map((item) => ({
        ...item,
        url: route(item.routeName),
    }));

    const root =
        items.find(
            (item) => url === item.url || url.startsWith(`${item.url}/`)
        ) ?? items[0];
    const trail = crumbs ?? [
        { label: root.title, href: root.url },
        ...(title && title !== root.title ? [{ label: title, href: null }] : []),
    ];

    const stats = props.stats;
    const bellCount = stats?.overdueInvoices ?? 0;
    const bellHref = route('client.dashboard');

    return (
        <SidebarProvider style={{ '--sidebar-width': '13.5rem' }}>
            <FlashToaster />
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link
                                href={route('client.dashboard')}
                                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                            >
                                <TechstackMark className="size-10 group-data-[collapsible=icon]:size-8" />
                                <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate text-sm font-semibold tracking-tight text-primary">
                                        Invoicify
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Client portal
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>My Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="pl-1">
                                {items.map((item) => {
                                    const isActive =
                                        url === item.url ||
                                        url.startsWith(`${item.url}/`);
                                    return (
                                        <SidebarMenuItem key={item.routeName}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                                className="h-9 gap-3 rounded-lg font-medium transition-[width,height,padding,background-color,color] duration-150 data-active:bg-primary/10 data-active:text-primary data-active:font-semibold [&_svg]:text-primary"
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    {isActive && (
                                                        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
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
                                    side="bottom"
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
                                    <DropdownMenuItem
                                        className="cursor-pointer [&_svg]:text-primary"
                                        onClick={() => router.post(route('logout'))}
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {trail.map((crumb, index) => {
                                const isLast = index === trail.length - 1;
                                return (
                                    <React.Fragment key={`${crumb.label}-${index}`}>
                                        <BreadcrumbItem>
                                            {isLast || !crumb.href ? (
                                                <BreadcrumbPage>
                                                    {crumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
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
                    <div className="ml-auto flex items-center gap-1">
                        <ModeToggle />
                        <NotificationBell
                            size="sm"
                            count={bellCount}
                            onClick={() => router.visit(bellHref)}
                        />
                    </div>
                </header>
                <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
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
