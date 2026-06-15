import { Link, usePage } from '@inertiajs/react';

const menuItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <img
                src="/images/icon_dashboard.png"
                alt="Dashboard"
                className="w-4.5 h-4.5 object-contain"
            />
        ),
    },
    {
        label: 'Beli Pelatihan',
        href: '/beli-pelatihan',
        icon: (
            <img
                src="/images/icon_buy.png"
                alt="Beli Pelatihan"
                className="w-6 h-6 object-contain"
            />
        ),
    },
    {
        label: 'Pelatihan',
        href: '/pelatihan',
        icon: (
            <img
                src="/images/icon_pelatihan.png"
                alt="Pelatihan"
                className="w-5 h-5 object-contain"
            />
        ),
    },
    {
        label: 'Sertifikat',
        href: '/sertifikat',
        icon: (
            <img
                src="/images/icon_sertif.png"
                alt="Sertifikat"
                className="w-6 h-6 object-contain"
            />
        ),
    },
    {
        label: 'Profil Saya',
        href: '/profile',
        icon: (
            <img
                src="/images/iconprofile.png"
                alt="Profil Saya"
                className="w-6 h-6 object-contain"
            />
        ),
    },
];

export default function DashboardSidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const currentPath = url.split('?')[0];

    return (
        <>
            {/* Backdrop — mobile & tablet */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[288px] max-w-[85vw] flex-col bg-[#F6F3F2] border-r border-[#E4E2E1] py-4 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-6 pb-8">
                    <Link href="/" onClick={onClose}>
                        <img
                            src="/images/logo.png"
                            alt="Pensiun Mudah"
                            className="h-12 sm:h-14 w-auto"
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-[#3D4A3E] hover:bg-white/60 transition-colors lg:hidden"
                        aria-label="Tutup menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-['Atkinson_Hyperlegible'] text-base transition-all ${
                                    isActive
                                        ? 'bg-[#006B32] text-white font-semibold shadow-[0_4px_6px_-1px_rgba(0,107,50,0.2)]'
                                        : 'text-[#3D4A3E] hover:bg-white/60'
                                }`}
                            >
                                {/* Penambahan efek filter agar gambar berubah warna otomatis */}
                                <span className={`transition-all duration-300 ${isActive ? '[&>img]:brightness-0 [&>img]:invert' : '[&>img]:brightness-0 [&>img]:opacity-70'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}