import { Button } from "@/components/ui/button";
import {
    RiFacebookFill,
    RiGithubFill,
    RiGoogleFill,
    RiTwitterXFill,
} from "@remixicon/react";
import GoogleLogo from "@/Assets/images/search.png";
export default function FormLogin() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <a href="auth/redirect" className="w-full bg-background text-sky-500 px-4 py-2 rounded-lg shadow-md font-semibold flex gap-3 items-center justify-center hover:bg-[#009ef7] hover:text-white cursor-pointer">
                <div className="w-6 h-6 overflow-hidden">
                    <img
                        src={GoogleLogo}
                        alt="logo google"
                        className="w-full h-full object-cover"
                    />
                </div>
                Login with Google
            </a>
        </div>
    );
}
