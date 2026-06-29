import { Link, usePage } from '@inertiajs/react';

function getInitials(name) {
    return (name || 'PM')
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function InstansiPaymentHeader() {
    const { auth } = usePage().props;
    const user = auth?.user ?? {};
    const corporateProfile = user?.corporate_profile ?? {};
    const companyName = corporateProfile.nama_perusahaan || user.name || 'Instansi';

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-[#E4E2E1]">
            <div className="mx-auto max-w-6xl px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/instansi/dashboard" className="flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Pensiun Mudah"
                        className="h-10 sm:h-12 w-auto"
                    />
                </Link>

                {/* AREA USER INSTANSI */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <button
                        type="button"
                        className="relative p-2 rounded-full hover:bg-[#F0EDED] transition-colors"
                        aria-label="Notifikasi"
                    >
                        <svg
                            className="w-5 h-5 text-[#3D4A3E]/60"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#BA1A1A] border-2 border-white rounded-full" />
                    </button>

                    <div className="w-px h-8 bg-[#E4E2E1] hidden sm:block" />

                    <div className="flex items-center gap-2 sm:gap-3">
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
                    </div>
                </div>
            </div>
        </header>
    );
}
