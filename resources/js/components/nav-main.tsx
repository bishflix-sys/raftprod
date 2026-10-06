import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { url } = usePage();
    const currentUrl = new URL(url, 'http://localhost');

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {(() => {
                            const itemUrl = new URL(
                                toUrl(item.href),
                                currentUrl.origin,
                            );
                            const itemModule =
                                itemUrl.searchParams.get('module');
                            const isActive = itemModule
                                ? currentUrl.pathname === itemUrl.pathname &&
                                  currentUrl.searchParams.get('module') ===
                                      itemModule
                                : isCurrentUrl(item.href);

                            return (
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            );
                        })()}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
