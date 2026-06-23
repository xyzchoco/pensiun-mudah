import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

const navItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        href: '/korporat/dashboard',
        icon: 'grid',
    },
    {
        key: 'beli',
        label: 'Beli Pelatihan',
        href: '/korporat/beli-pelatihan',
        icon: 'bag',
    },
    {
        key: 'profil',
        label: 'Profil Perusahaan',
        href: '/korporat/profil-perusahaan',
        icon: 'user',
    },
];

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function NavIcon({ name }) {
    if (name === 'grid') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        );
    }
    if (name === 'bag') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12l-1 13H7L6 7z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7a3 3 0 016 0"
                />
            </svg>
        );
    }
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="8" r="4" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 21c0-4 4-6 8-6s8 2 8 6"
            />
        </svg>
    );
}

export default function KorporatLayout({
    title = 'Pensiun Mudah',
    activeNav = 'dashboard',
    showHeader = true,
    searchPlaceholder = 'Cari kursus, konsultan, webinar...',
    children,
}) {
    const { auth } = usePage().props;
    const user = auth?.user ?? { name: 'Budi Santoso' };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const brand = (
        <Link href="/korporat/dashboard" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B32] text-sm font-extrabold text-white">
                PM
            </span>
            <span className="font-['Atkinson_Hyperlegible'] text-lg font-extrabold">
                <span className="text-[#006B32]">PENSIUN</span>
                <span className="text-[#FF8928]">MUDAH</span>
            </span>
        </Link>
    );

    const sidebarNav = (
        <nav className="space-y-1 px-4">
            {navItems.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className={
                        item.key === activeNav
                            ? "flex items-center gap-3 rounded-lg bg-[#006B32] px-4 py-3 font-['Atkinson_Hyperlegible'] font-bold text-white"
                            : "flex items-center gap-3 rounded-lg px-4 py-3 font-['Atkinson_Hyperlegible'] font-semibold text-[#3D4A3E] hover:bg-[#F0EDED]"
                    }
                >
                    <NavIcon name={item.icon} />
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="flex min-h-screen bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title={title} />

            <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E4E2E1]/60 bg-white lg:flex">
                <div className="px-6 py-5">{brand}</div>
                {sidebarNav}
            </aside>

            {sidebarOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between px-6 py-5">
                            {brand}
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Tutup menu"
                            >
                                <svg
                                    className="h-6 w-6 text-[#3D4A3E]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        {sidebarNav}
                    </aside>
                </div>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col">
                {showHeader ? (
                    <header className="flex h-16 items-center justify-between gap-4 border-b border-[#E4E2E1]/40 bg-white px-4 sm:h-20 sm:px-6 lg:px-10">
                        <div className="flex flex-1 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 text-[#3D4A3E] hover:bg-[#F0EDED] lg:hidden"
                                aria-label="Tampilkan menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <div className="relative w-full max-w-md">
                                <svg
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3D4A3E]/60"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    className="w-full rounded-lg bg-[#F0EDED] py-2.5 pl-10 pr-4 font-['Atkinson_Hyperlegible'] text-sm text-[#6B7280] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                                />
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                            <button
                                type="button"
                                className="relative rounded-full p-2 hover:bg-[#F0EDED]"
                                aria-label="Notifikasi"
                            >
                                <svg
                                    className="h-5 w-5 text-[#3D4A3E]/60"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#BA1A1A]" />
                            </button>
                            <div className="h-8 w-px bg-[#E4E2E1] hidden sm:block" />
                            <div className="hidden text-right sm:block">
                                <p className="font-['Atkinson_Hyperlegible'] text-sm font-bold text-[#1B1C1C]">
                                    {user.name}
                                </p>
                                <p className="font-['Atkinson_Hyperlegible'] text-[10px] font-semibold uppercase tracking-wider text-[#006B32]">
                                    Premium Member
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006B32] font-bold text-white">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    </header>
                ) : (
                    <header className="flex h-16 items-center justify-between border-b border-[#E4E2E1]/40 bg-white px-4 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#3D4A3E] hover:bg-[#F0EDED]"
                            aria-label="Tampilkan menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        {brand}
                        <span className="w-9" />
                    </header>
                )}

                <main className="flex-1 overflow-y-auto">
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
}
