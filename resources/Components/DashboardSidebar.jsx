import { Link } from '@inertiajs/react';

const menuItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        active: true,
        icon: (
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 10v6a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1v-6a1 1 0 00-.293-.707l-7-7z" />
            </svg>
        ),
    },
    {
        label: 'Beli Pelatihan',
        href: '#',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
        ),
    },
    {
        label: 'Pelatihan',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5A1 1 0 002 6.5V15a1 1 0 001.106.994l7-1.5 7 1.5A1 1 0 0018 15V6.5a1 1 0 00-.606-.92l-7-3.5z" />
            </svg>
        ),
    },
    {
        label: 'Sertifikat',
        href: '#',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        label: 'Webinar',
        href: '#',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
        ),
    },
];

export default function DashboardSidebar({ isOpen, onClose }) {
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
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg font-['Atkinson_Hyperlegible'] text-base transition-all ${
                                item.active
                                    ? 'bg-[#006B32] text-white font-semibold shadow-[0_4px_6px_-1px_rgba(0,107,50,0.2)]'
                                    : 'text-[#3D4A3E] hover:bg-white/60'
                            }`}
                        >
                            <span className={item.active ? 'text-white' : 'text-[#3D4A3E]'}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
