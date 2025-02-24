import * as React from "react";
import {
    Group,
    LayoutDashboard,
    Medal,
    Notebook,
    FilePlus,
    BookMarked,
    LayoutList,
    FileBadge,
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
        name: "Data Pengajuan Lomba",
        url: "/data-pengajuan-lomba",
        icon: Notebook,
    },
    {
        name: "Pelaporan Prestasi",
        url: "/pelaporan-prestasi",
        icon: FileBadge,
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
    {
        name: "Udpate Pengajuan Lomba",
        url: "/update-pengajuan-lomba",
        icon: Medal,
    },
    {
        name: "Kategori Lomba",
        url: "/kategori-lomba",
        icon: Group,
    },
    {
        name: "Judul Lomba",
        url: "/judul-lomba",
        icon: LayoutList,
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
        <Sidebar variant="inset" {...props} className="z-20">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
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
