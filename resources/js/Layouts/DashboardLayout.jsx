import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { url } = usePage();
    
    return (
        <div className="min-h-screen bg-[#FBF9F8] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#E4E2E1] p-6 flex flex-col">
                <div className="mb-10">
                    <img src="/images/logo.png" alt="Logo" className="h-10 mb-2" />
                    <p className="text-[10px] text-[#6B7280] font-bold tracking-wider">MASA DEPAN CERIA BERSAMA</p>
                </div>
                <nav className="flex flex-col gap-2">
                    {[
                        { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
                        { label: 'Beli Pelatihan', href: '/beli-pelatihan', icon: '🛍️' },
                        { label: 'Pelatihan', href: '/pelatihan', icon: '📚' },
                        { label: 'Sertifikat', href: '/sertifikat', icon: '⭐' },
                        { label: 'Profil Saya', href: '/profile', icon: '👤' },
                    ].map((item) => (
                        <Link key={item.label} href={item.href} className={`flex items-center gap-3 p-3 rounded-lg font-bold ${url === item.href ? 'bg-[#E8F5E9] text-[#006B32]' : 'text-[#6B7280]'}`}>
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-[#E4E2E1] flex items-center justify-between px-8">
                    <h1 className="font-bold text-xl text-[#1B1C1C]">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Cari kursus, konsultan, webinar..." className="bg-[#FBF9F8] border border-[#E4E2E1] rounded-full pl-10 pr-4 py-2 w-72 text-sm" />
                        </div>
                        <span className="text-xl">🔔</span>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right">
                                <p className="text-sm font-bold">Budi Santoso</p>
                                <p className="text-[10px] font-bold text-[#FF8928]">PREMIUM MEMBER</p>
                            </div>
                            <img src="/images/avatar.png" className="w-10 h-10 rounded-full bg-gray-200" />
                        </div>
                    </div>
                </header>
                <main className="p-8">{children}</main>
            </div>
        </div>
    );
}