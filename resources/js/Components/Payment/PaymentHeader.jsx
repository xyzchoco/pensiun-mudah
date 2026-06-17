import { Link, usePage } from "@inertiajs/react";

// Ambil inisial nama user buat avatar (fallback kalau foto profil belum ada)
function getInitials(name) {
  if (!name) return "PM";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PaymentHeader() {
  const { auth } = usePage().props;
  const user = auth?.user;
  const displayName = user?.name || "Budi Santoso";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E4E2E1]">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* --- 1. LOGO --- */}
        <Link href="/dashboard" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Pensiun Mudah"
            className="h-9 w-auto"
          />
        </Link>

        {/* --- 2. AREA USER --- */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-[#F0EDED] transition-colors"
            aria-label="Notifikasi"
          >
            <svg
              className="w-5 h-5 text-[#6B7280]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#BA1A1A] border-2 border-white rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm text-[#1B1C1C] leading-tight">
                {displayName}
              </p>
              <p className="font-semibold text-[10px] tracking-wider uppercase text-[#008740]">
                Premium Member
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#008740] flex items-center justify-center text-white font-bold text-sm">
              {getInitials(displayName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
