import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    CircleDollarSign,
    FileText,
    LayoutDashboard,
    Landmark,
    Users,
    Wrench,
    FolderCog,
    Mail,
    Archive,
    ChartNoAxesCombined,
    School,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type MunicipalNavItem = NavItem & { permission: string };

const mainNavItems: MunicipalNavItem[] = [
    {
        title: 'Vue générale',
        href: '/dashboard?module=overview',
        icon: LayoutDashboard,
        permission: 'module.overview.view',
    },
    {
        title: 'État civil',
        href: '/dashboard?module=civil',
        icon: FileText,
        permission: 'module.civil.view',
    },
    {
        title: 'Finances',
        href: '/dashboard?module=finances',
        icon: CircleDollarSign,
        permission: 'module.finances.view',
    },
    {
        title: 'Services techniques',
        href: '/dashboard?module=technical',
        icon: Wrench,
        permission: 'module.technical.view',
    },
    {
        title: 'Ressources humaines',
        href: '/dashboard?module=hr',
        icon: Users,
        permission: 'module.hr.view',
    },
    {
        title: 'Patrimoine',
        href: '/dashboard?module=assets',
        icon: Landmark,
        permission: 'module.assets.view',
    },
    {
        title: 'Courrier',
        href: '/dashboard?module=courrier',
        icon: Mail,
        permission: 'module.courrier.view',
    },
    {
        title: 'Comptabilité des matières',
        href: '/dashboard?module=comptabilite-matieres',
        icon: FolderCog,
        permission: 'module.comptabilite-matieres.view',
    },
    {
        title: 'Recettes',
        href: '/dashboard?module=recettes',
        icon: CircleDollarSign,
        permission: 'module.recettes.view',
    },
    {
        title: 'Domaines',
        href: '/dashboard?module=domaines',
        icon: Landmark,
        permission: 'module.domaines.view',
    },
    {
        title: 'Voirie et travaux',
        href: '/dashboard?module=voirie',
        icon: Wrench,
        permission: 'module.voirie.view',
    },
    {
        title: 'Planification',
        href: '/dashboard?module=planification',
        icon: ChartNoAxesCombined,
        permission: 'module.planification.view',
    },
    {
        title: 'Éducation, culture et sport',
        href: '/dashboard?module=education-culture',
        icon: School,
        permission: 'module.education-culture.view',
    },
    {
        title: 'Archives',
        href: '/dashboard?module=archives',
        icon: Archive,
        permission: 'module.archives.view',
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const visibleNavItems: NavItem[] = mainNavItems.filter((item) =>
        auth.user?.permissions.includes(item.permission),
    );

    if (auth.user?.permissions.includes('access.view')) {
        visibleNavItems.push({
            title: 'Gestion des accès',
            href: '/admin/access',
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="mx-2 mb-3 border-t border-sidebar-border px-2 pt-3 text-[10px] leading-4 text-muted-foreground group-data-[collapsible=icon]:hidden">
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                        <CalendarDays className="size-3.5" /> Exercice 2026
                    </p>
                    <p className="mt-1">Administration communale</p>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
