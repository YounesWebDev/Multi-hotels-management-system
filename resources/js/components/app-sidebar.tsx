import { NavFooter } from '@/components/nav-footer';
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
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bed, BookOpen, Building2, CalendarCheck, Folder, LayoutGrid, UserRoundCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

const ManagerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/Dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Rooms',
        href: '/rooms',
        icon: Bed,
    },
    {
        title: 'Guests',
        href: '/guests',
        icon: Users,
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: CalendarCheck,
    },
];

const AdminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Assign Manager',
        href: '/assign-manager',
        icon: UserRoundCog,
    },
    {
        title: 'Manage Hotels',
        href: '/hotels',
        icon: Building2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const {auth} = usePage<SharedData>().props;
    const user = auth?.user;
    if(user?.role === 'manager' && !user?.tenant_id){
        return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href='/dashboard' prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
    
            <SidebarContent>
                <NavMain items={[{title: 'Dashboard' , href: '/dashboard' , icon: LayoutGrid}]} />
            </SidebarContent>
    
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
    }
    const isAdmin = auth?.user?.role === 'admin';
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href='/dashboard' prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
    
            <SidebarContent>                         
                <NavMain items={isAdmin ? AdminNavItems : ManagerNavItems} />
            </SidebarContent>
    
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
    
}
