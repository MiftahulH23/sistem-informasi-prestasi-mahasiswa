import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import GoogleLogo from "@/Assets/images/googleLogo.png";
import LogoKemahasiswaan from "@/Assets/images/LogoKemahasiswaanTransparant.png";

export default function Login({ status, canResetPassword, appUrl }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign in">
                <meta
                    name="description"
                    content="Sistem Informasi Prestasi Mahasiswa Politeknik Caltex Riau"
                />
            </Head>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden px-6 py-8 shadow-md rounded-lg bg-white">
                <div className="flex gap-3 items-center mb-4 justify-center">
                    <div className="w-12 h-12 flex-none overflow-hidden">
                        <img
                            src={LogoKemahasiswaan}
                            alt="Logo Kemahasiswaan"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-primary font-bold text-xl">
                            Sistem Informasi Prestasi Mahasiswa
                        </h1>
                        <p className="text-primary">Kemahasiswaan PCR</p>
                    </div>
                </div>
                <a
                    href="auth/redirect"
                    className="w-full bg-background text-sky-500 px-4 py-2 rounded-lg shadow-md font-semibold flex gap-3 items-center justify-center hover:bg-[#009ef7] hover:text-white cursor-pointer"
                >
                    <div className="w-6 h-6 overflow-hidden">
                        <img
                            src={GoogleLogo}
                            alt="Masuk dengan akun Google"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>Sign in with Google</div>
                </a>
            </div>
        </GuestLayout>
    );
}
