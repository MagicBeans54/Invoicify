import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { CreditCard, FileText, LogOut } from 'lucide-react';
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
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import FlashToaster from '@/components/FlashToaster';

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

export default function ClientLayout({ title, children, actions }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const items = navConfig.map((item) => ({
        ...item,
        url: route(item.routeName),
    }));

    // Breadcrumb trail: root crumb from the active section, then the page
    // title (which pages already pass in) when it differs from the section.
    const root =
        items.find(
            (item) => url === item.url || url.startsWith(`${item.url}/`)
        ) ?? items[0];
    const crumbs = [{ label: root.title, href: root.url }];
    if (title && title !== root.title) {
        crumbs.push({ label: title, href: null });
    }

    return (
        <SidebarProvider>
            <FlashToaster />
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild size="lg">
                                <Link href={route('client.dashboard')}>
                                    <img
                                        src="/images/techstack_ico.png"
                                        alt="Techstacks"
                                        className="size-8 rounded-md object-cover"
                                    />
                                    <div className="grid flex-1 text-left leading-tight">
                                        <span className="truncate text-sm font-semibold tracking-tight">
                                            Invoicify
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            Client Portal
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>My Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
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
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {crumbs.map((crumb, index) => {
                                const isLast = index === crumbs.length - 1;
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
                    <div className="ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Avatar className="size-8">
                                        <AvatarFallback>
                                            {initials(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.name || 'Account'}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => router.post(route('logout'))}
                                >
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex-1 px-6 py-8">
                    <div className="mx-auto max-w-5xl">
                        {(title || actions) && (
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">{title}</h1>
                                {actions && <div className="flex gap-2">{actions}</div>}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}