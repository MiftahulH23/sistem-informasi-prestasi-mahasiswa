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
import LogoKemahasiswaan from "@/Assets/images/LogoKemahasiswaan.jpg"

const menuMahasiswa = [
    {
        name: "Dashboard",
        url: "dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Pengajuan Lomba",
        url: "pengajuan-lomba",
        icon: FilePlus,
    },
    {
        name: "Prestasi",
        url: "prestasi",
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
                            <a href="/dashboard">
                                <div className="w-8 h-8 overflow-hidden">
                                    <img src={LogoKemahasiswaan} alt="Logo Kemahasiswaan" />

                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Sistem Informasi Prestasi
                                    </span>
                                    <span className="truncate text-xs">
                                        Kemahaiswaan PCR
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="mt-10">
                {/* <NavMain items={data.navMain} /> */}
                <NavProjects projects={menu[role]} />
            </SidebarContent>
        </Sidebar>
    );
}
