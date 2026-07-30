import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import Footer from '@/Components/Footer';
import useFlashToast from '../Hooks/useFlashToast';
import SearchDropdown from '@/Components/SearchDropdown';

const navItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        href: '/instansi/dashboard',
        icon: 'grid',
    },
    {
        key: 'beli',
        label: 'Beli Pelatihan',
        href: '/instansi/beli-pelatihan',
        icon: 'bag',
    },
    {
        key: 'anggota',
        label: 'Anggota',
        href: '/instansi/anggota',
        icon: 'users',
    },
    {
        key: 'profil',
        label: 'Profil Perusahaan',
        href: '/instansi/profil-perusahaan',
        icon: 'user',
    },
];

function getInitials(name) {
    return (name || 'PM')
        .split(' ')
        .filter(Boolean)
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
    if (name === 'users') {
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
                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
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

export default function InstansiLayout({
    title = 'Pensiun Mudah',
    activeNav = 'dashboard',
    showHeader = true,
    showSidebar = true,
    searchPlaceholder = 'Cari kursus, konsultan, webinar...',
    children,
}) {
    useFlashToast();
    const { auth } = usePage().props;
    const user = auth?.user ?? {};
    const corporateProfile = user?.corporate_profile ?? {};
    const companyName =
        corporateProfile.nama_perusahaan || user.name || 'Instansi';
    const { unreadNotifCount = 0 } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Tampilkan sidebar otomatis di layar besar
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

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

            {showSidebar && (
                <>
                    {/* Backdrop - mobile & tablet */}
                    <div
                        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${sidebarOpen
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sidebar */}
                    <aside
                        className={`fixed left-0 top-0 z-50 flex h-screen w-[288px] max-w-[85vw] flex-col bg-[#F6F3F2] border-r border-[#E4E2E1] py-4 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        <div className="flex items-center justify-between px-6 pb-8">
                            <Link href="/instansi/dashboard">
                                <img
                                    src="/images/logo.png"
                                    alt="Pensiun Mudah"
                                    className="h-12 sm:h-14 w-auto"
                                />
                            </Link>
                            {showSidebar && (
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg text-[#3D4A3E] hover:bg-white/60 transition-colors lg:hidden"
                                    aria-label="Tutup menu"
                                >
                                    <svg
                                        className="w-5 h-5"
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
                            )}
                        </div>

                        {sidebarNav}
                    </aside>

                </>
            )}
            <div
                className={`min-h-screen flex-1 transition-all duration-300 ${(sidebarOpen && showSidebar) ? 'lg:pl-72' : 'lg:pl-0'}`}
            >
                <div className="flex-1 flex flex-col h-full">
                    {showHeader ? (
                        <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-[#E4E2E1]/30 shrink-0 gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {showSidebar && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSidebarOpen((prev) => !prev)
                                        }
                                        className="p-2 rounded-lg text-[#3D4A3E] hover:bg-[#F0EDED] transition-colors shrink-0"
                                        aria-label={
                                            sidebarOpen
                                                ? 'Sembunyikan sidebar'
                                                : 'Tampilkan sidebar'
                                        }
                                        aria-expanded={sidebarOpen}
                                    >
                                        {sidebarOpen ? (
                                            <svg
                                                className="w-6 h-6"
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
                                        ) : (
                                            <svg
                                                className="w-6 h-6"
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
                                        )}
                                    </button>
                                )}
                                <h1 className="font-['Atkinson_Hyperlegible'] font-bold text-lg sm:text-xl text-[#1B1C1C] truncate">
                                    {title}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                <div className="hidden md:block">
                                    <SearchDropdown placeholder={searchPlaceholder} />
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4">
                                    {/* 🔔 Lonceng → sekarang Link ke halaman notifikasi */}
                                    <Link
                                        href="/notifikasi"
                                        className="relative p-2 rounded-full hover:bg-[#F0EDED] transition-colors"
                                        aria-label="Notifikasi"
                                    >
                                        <svg
                                            className="w-4 h-5 text-[#3D4A3E]/60"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>

                                        {/* Badge cuma muncul kalau ADA notif belum dibaca (bukan nyala terus) */}
                                        {unreadNotifCount > 0 && (
                                            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#BA1A1A] border-2 border-white px-1 text-[9px] font-bold text-white">
                                                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                            </span>
                                        )}
                                    </Link>

                                    <div className="w-px h-8 bg-[#E4E2E1] hidden sm:block" />

                                    <Link
                                        href="/instansi/profil-perusahaan"
                                        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-[#F0EDED] sm:gap-3"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="font-['Atkinson_Hyperlegible'] font-bold text-sm text-[#1B1C1C]">
                                                {companyName}
                                            </p>
                                            <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[10px] tracking-wider uppercase text-[#006B32]">
                                                Akun Instansi
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B32] border-2 border-[#006B32]/20 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                            {getInitials(companyName)}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </header>
                    ) : null}

                    <main className="flex-1 overflow-y-auto">
                        {children}
                        <Footer />
                    </main>
                </div>
            </div>
            {/* Toast Notifications */}
            <Toaster position="top-right" />
        </div>
    );
}
