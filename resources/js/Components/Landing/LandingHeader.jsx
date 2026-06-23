import { Link, usePage } from '@inertiajs/react';

export default function LandingHeader({
    loginHref = '/login',
    registerHref = '/register',
}) {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-50 border-b border-[#E4E2E1] bg-white">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10">
                <Link href="/" className="flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Pensiun Mudah Logo"
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="flex items-center gap-4">
                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            className="font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-opacity hover:opacity-80"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={loginHref}
                                className="font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-opacity hover:opacity-80"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={registerHref}
                                className="rounded-lg bg-[#FF8928] px-6 py-3 font-['Atkinson_Hyperlegible'] font-bold text-white transition-colors hover:bg-[#e67a22]"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
