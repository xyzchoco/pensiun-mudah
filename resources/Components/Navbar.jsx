import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props;

    return (
        <nav className="bg-white border-b border-[#E4E2E1] sticky top-0 z-50">
            <div className="max-w-[1200px] mx-auto px-10 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Pensiun Mudah Logo"
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <>
                            <Link
                                href={route('dashboard')}
                                className="font-['Atkinson_Hyperlegible'] text-[#006B32] font-bold hover:opacity-80 transition-opacity"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] font-bold hover:opacity-80 transition-opacity"
                            >
                                Keluar
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="font-['Atkinson_Hyperlegible'] text-[#006B32] font-bold hover:opacity-80 transition-opacity"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold px-6 py-3 rounded-lg transition-all"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
