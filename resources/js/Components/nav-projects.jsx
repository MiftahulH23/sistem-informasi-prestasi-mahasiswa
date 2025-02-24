import { Folder, MoreHorizontal, Share, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils";

export function NavProjects({
  projects
}) {
  const { isMobile } = useSidebar()

  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const split = item.url.split("/")[0]
          const active = route().current(split)
          return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url} className={cn("", active ? "bg-background font-bold text-primary" : "bg-transparent")}>
                <item.icon className="text-[#4f94c8]" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        )})}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
