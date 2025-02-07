import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import GoogleLogo from '@/Assets/images/googleLogo.png'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <a href="auth/redirect" className='w-full bg-background text-sky-500 px-4 py-2 rounded-lg shadow-md font-semibold flex gap-3 items-center justify-center hover:bg-[#009ef7] hover:text-white cursor-pointer'>
                <div className="w-6 h-6 overflow-hidden">
                    <img src={GoogleLogo} alt="logo google" className='w-full h-full object-cover' />
                </div>
                <div>
                    Sign in with Google
                </div>
            </a>
        </GuestLayout>
    );
}
