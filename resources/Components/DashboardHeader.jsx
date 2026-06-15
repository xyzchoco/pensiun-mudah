import { usePage } from '@inertiajs/react';

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function DashboardHeader({ sidebarOpen, onToggleSidebar, onToggleNotif, title = 'Dashboard', showSearch = true }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const firstName = user.name.split(' ')[0];

    return (
        <header className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-[#E4E2E1]/30 shrink-0 gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-[#3D4A3E] hover:bg-[#F0EDED] transition-colors shrink-0"
                    aria-label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
                    aria-expanded={sidebarOpen}
                >
                    {sidebarOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
                <h1 className="font-['Atkinson_Hyperlegible'] font-bold text-lg sm:text-xl text-[#1B1C1C] truncate">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                {showSearch && (
                    <div className="relative w-48 sm:w-72 lg:w-96 max-w-[384px] hidden md:block">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D4A3E]/60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari kursus, konsultan, webinar..."
                            className="w-full pl-10 pr-4 py-2 bg-[#F0EDED] rounded-lg text-sm font-['Atkinson_Hyperlegible'] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        type="button"
                        onClick={onToggleNotif}
                        className="relative p-2 rounded-full hover:bg-[#F0EDED] transition-colors"
                        aria-label="Notifikasi"
                    >
                        <svg className="w-4 h-5 text-[#3D4A3E]/60" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#BA1A1A] border-2 border-white rounded-full" />
                    </button>

                    <div className="w-px h-8 bg-[#E4E2E1] hidden sm:block" />

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="font-['Atkinson_Hyperlegible'] font-bold text-sm text-[#1B1C1C]">
                                {firstName}
                            </p>
                            <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[10px] tracking-wider uppercase text-[#006B32]">
                                Member Gratis
                            </p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B32] border-2 border-[#006B32]/20 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            {getInitials(user.name)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
