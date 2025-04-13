import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    LogOut
} from "lucide-react";

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
                <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                    tabIndex={-1}
                >
                    <Avatar>
                        <AvatarImage src={user.avatar} alt="Profile image" />
                        <AvatarFallback>{inisial}</AvatarFallback>
                    </Avatar>
                    <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="ms-2 opacity-60"
                        aria-hidden="true"
                    />
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
                    <LogOut
                        size={16}
                        strokeWidth={2}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                    <Link method="post" href={route("logout")}>
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
