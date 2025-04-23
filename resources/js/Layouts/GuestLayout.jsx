import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}
