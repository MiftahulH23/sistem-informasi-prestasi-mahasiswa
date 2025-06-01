import { AppSidebar } from "@/Components/app-sidebar";
import { Breadcrumbs } from "@/Components/Breadcrumb";
import Profile from "@/Components/Profile";
import { Button } from "@/Components/ui/button";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { usePage } from "@inertiajs/react";
import { ChevronsLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function AuthenticatedLayout({ children, breadcrumbs }) {

    const currentPath = window.location.pathname;
    const isInMainMenu = currentPath.split("/").length <= 2;
    return (
        <SidebarProvider className="w-screen">
            <AppSidebar />
            <SidebarInset className="flex-auto w-screen overflow-y-auto">
                <header className="flex h-16 shrink-0 items-center gap-2 bg-background sticky top-0 z-10">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <Profile />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-background">
                    <TooltipProvider delayDuration={0}>
                        {children}
                    </TooltipProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
