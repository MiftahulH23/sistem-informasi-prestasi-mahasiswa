import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, LogOut } from "lucide-react";

export default function Profile() {
    const user = usePage().props.auth.user;
    const inisial = user.name
        .split(" ")
        .slice(0, 2)
        .map((item) => item.charAt(0))
        .join("");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="focus-visible:ring-0 focus-visible:outline-none pr-2 rounded-full bg-white focus-visible:ring-transparent pl-1 gap-1">
                    <Avatar>
                        <AvatarImage src={user.avatar} alt="Profile image" />
                        <AvatarFallback>{inisial}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="text-black stroke-[1.5] translate-y-px" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64" align="end">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                        {user.name}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link
                        method="post"
                        href={route("logout")}
                        className="w-full flex items-center justify-start gap-2"
                    >
                        <LogOut
                            size={16}
                            strokeWidth={2}
                            className="opacity-60"
                            aria-hidden="true"
                        />
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
