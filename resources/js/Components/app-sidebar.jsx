import * as React from "react";
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    LayoutDashboard,
    Medal,
    Notebook,
    FilePlus,
    BookMarked,
} from "lucide-react";
import { NavProjects } from "@/components/nav-projects";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuMahasiswa = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Pengajuan Lomba",
        url: "/pengajuan-lomba",
        icon: FilePlus,
    },
    {
        name: "Prestasi",
        url: "/prestasi",
        icon: Medal,
    },
    {
        name: "Data Lomba",
        url: "#",
        icon: Notebook,
    },
    {
        name: "Pelaporan Lomba",
        url: "#",
        icon: BookMarked,
    },
];

const menuKemahasiswaan = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Prestasi",
        url: "#",
        icon: Medal,
    },
];
const menuEksekutif = [
    {
        name: "Pelaporan Lomba",
        url: "#",
        icon: BookMarked,
    },
    {
        name: "Pelaporan Lomba",
        url: "#",
        icon: BookMarked,
    },
];
export function AppSidebar({ ...props }) {
  const role = "mahasiswa";
  const menu = {
    mahasiswa: menuMahasiswa,
    kemahasiswaan: menuKemahasiswaan,
    eksekutif: menuEksekutif,
  }
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        SIPEMA
                                    </span>
                                    <span className="truncate text-xs">
                                        lorem
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* <NavMain items={data.navMain} /> */}
                <NavProjects projects={menu[role]} />
            </SidebarContent>
        </Sidebar>
    );
}
