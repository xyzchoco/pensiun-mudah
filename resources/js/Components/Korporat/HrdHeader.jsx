import { Link } from '@inertiajs/react';

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function HrdHeader({
    userName = 'Doni',
    userRole = 'HRD PT Mencari Cinta Sejati',
    searchPlaceholder = 'Cari anggota...',
}) {
    return (
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[#E4E2E1]/40 bg-white px-4 font-['Atkinson_Hyperlegible'] sm:h-20 sm:px-6 lg:px-10">
            <Link
                href="/korporat/dashboard"
                className="flex shrink-0 items-center gap-2"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B32] text-sm font-extrabold text-white">
                    PM
                </span>
                <span className="hidden text-lg font-extrabold sm:inline">
                    <span className="text-[#006B32]">PENSIUN</span>
                    <span className="text-[#FF8928]">MUDAH</span>
                </span>
            </Link>

            <div className="relative w-full max-w-md">
                <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3D4A3E]/60"
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
                    className="w-full rounded-full border border-[#E4E2E1] bg-[#F0EDED] py-2.5 pl-11 pr-4 text-sm text-[#3D4A3E] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                />
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold text-[#1B1C1C]">
                        {userName}
                    </p>
                    <p className="text-xs text-[#6B7280]">{userRole}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                    {getInitials(userName)}
                </div>
            </div>
        </header>
    );
}
