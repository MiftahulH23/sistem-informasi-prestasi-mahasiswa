import { AppSidebar } from "@/components/app-sidebar";
import Profile from "@/Components/Profile";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/Components/ui/tooltip";

export default function AuthenticatedLayout({children }) {
    return (
        <SidebarProvider className="w-screen">
            <AppSidebar />
            <SidebarInset className="flex-auto w-screen overflow-y-auto">
                <header className="flex h-16 shrink-0 items-center gap-2 bg-background sticky top-0 z-10">
                    <div className="flex items-center justify-between gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Profile  />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-background">
                    <TooltipProvider>{children}</TooltipProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
