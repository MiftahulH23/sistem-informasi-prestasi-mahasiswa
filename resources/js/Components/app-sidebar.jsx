import LogoKemahasiswaan from "@/Assets/images/LogoKemahasiswaan.jpg";
import { NavProjects } from "@/Components/nav-projects";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import {
    BookMarked,
    FileBadge,
    Group,
    LayoutDashboard,
    LayoutList,
    Medal,
    Notebook,
    BookOpenText,
    Newspaper,
} from "lucide-react";

const menuMahasiswa = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Prestasi",
        url: "/prestasi",
        icon: Medal,
    },
    {
        name: "Pengajuan Lomba",
        url: "/pengajuan-lomba",
        icon: Notebook,
    },
    {
        name: "Pelaporan Prestasi",
        url: "/pelaporan-prestasi",
        icon: FileBadge,
    },
    {
        name: "Bimbingan",
        url: "/bimbingan",
        icon: BookOpenText,
    },
    {
        name: "Portofolio",
        url: "/portofolio",
        icon: Newspaper,
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
        url: "/prestasi",
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
    {
        name: "Pengajuan Lomba",
        url: "/pengajuan-lomba/update",
        icon: Medal,
    },
    {
        name: "Pelaporan Prestasi",
        url: "/pelaporan-prestasi/update",
        icon: FileBadge,
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
const menuDosen = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Prestasi",
        url: "/prestasi",
        icon: Medal,
    },
    {
        name: "Bimbingan",
        url: "/bimbingan-dosen",
        icon: BookOpenText,
    },
];
export function AppSidebar({ ...props }) {
    const user = usePage().props.auth.user;
    const role = user.role;
    const menu = {
        Mahasiswa: menuMahasiswa,
        Kemahasiswaan: menuKemahasiswaan,
        eksekutif: menuEksekutif,
        Dosen: menuDosen,
    };
    return (
        <Sidebar variant="inset" {...props} className="z-20">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-transparent"
                        >
                            <a href="/dashboard">
                                <div className="w-8 h-8 overflow-hidden">
                                    <img
                                        src={LogoKemahasiswaan}
                                        alt="Logo Kemahasiswaan"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Sistem Informasi Prestasi
                                    </span>
                                    <span className="truncate text-xs">
                                        Kemahasiswaan PCR
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
            <SidebarFooter>
                <span className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} PCR</span>
            </SidebarFooter>
        </Sidebar>
    );
}
