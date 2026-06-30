import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

/* --- Sidebar navigation config --- */
const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: "/images/icon_dashboard.png", iconClass: "w-4.5 h-4.5" },
  { label: "Beli Pelatihan", href: "/beli-pelatihan", icon: "/images/icon_buy.png", iconClass: "w-6 h-6" },
  { label: "Pelatihan", href: "/pelatihan", icon: "/images/icon_pelatihan.png", iconClass: "w-5 h-5" },
  { label: "Sertifikat", href: "/sertifikat", icon: "/images/icon_sertif.png", iconClass: "w-6 h-6" },
  { label: "Profil Saya", href: "/profile", icon: "/images/iconprofile.png", iconClass: "w-6 h-6" },
];

function getInitials(name) {
  if (!name) return "PM";
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

const kategoriLabel = {
  publik: "Member Gratis",
  asn: "Member ASN",
  korporat: "Member Korporat",
};

/* --- Inlined sidebar --- */
function Sidebar({ isOpen, onClose, currentPath }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[288px] max-w-[85vw] flex-col bg-[#F6F3F2] border-r border-[#E4E2E1] py-4 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-6 pb-8">
          <Link href="/" onClick={onClose}>
            <img src="/images/logo.png" alt="Pensiun Mudah" className="h-12 sm:h-14 w-auto" />
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
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-['Atkinson_Hyperlegible'] text-base transition-all ${isActive
                    ? "bg-[#006B32] text-white font-semibold shadow-[0_4px_6px_-1px_rgba(0,107,50,0.2)]"
                    : "text-[#3D4A3E] hover:bg-white/60"
                  }`}
              >
                <span
                  className={`transition-all duration-300 ${isActive
                      ? "[&>img]:brightness-0 [&>img]:invert"
                      : "[&>img]:brightness-0 [&>img]:opacity-70"
                    }`}
                >
                  <img src={item.icon} alt={item.label} className={`${item.iconClass} object-contain`} />
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

/* --- Inlined header --- */
function Header({ sidebarOpen, onToggleSidebar, title, showSearch }) {
  const { auth, unreadNotifCount = 0 } = usePage().props; // ✅ ambil count dari shared props
  const user = auth?.user;
  const displayName = user?.name || "Pengguna";
  const firstName = displayName.split(" ")[0];
  const memberLabel = kategoriLabel[user?.kategori_pensiun] ?? "Member Gratis";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-[#E4E2E1]/30 shrink-0 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#3D4A3E] hover:bg-[#F0EDED] transition-colors shrink-0"
          aria-label={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D4A3E]/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
          {/* ✅ Bell jadi Link ke halaman notifikasi + badge dinamis */}
          <Link
            href="/notifikasi"
            className="relative p-2 rounded-full hover:bg-[#F0EDED] transition-colors"
            aria-label={`Notifikasi${unreadNotifCount > 0 ? `, ${unreadNotifCount} belum dibaca` : ""}`}
          >
            <svg className="w-4 h-5 text-[#3D4A3E]/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {/* ✅ Badge hanya muncul kalau ADA notif belum dibaca */}
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#BA1A1A] px-1 text-[10px] font-bold text-white border-2 border-white">
                {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
              </span>
            )}
          </Link>

          <div className="w-px h-8 bg-[#E4E2E1] hidden sm:block" />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-['Atkinson_Hyperlegible'] font-bold text-sm text-[#1B1C1C]">{firstName}</p>
              <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[10px] tracking-wider uppercase text-[#006B32]">
                {memberLabel}
              </p>
            </div>
            <Link
              href="/profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B32] border-2 border-[#006B32]/20 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
            >
              {getInitials(displayName)}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ===== Main layout export ===== */
export default function DashboardLayout({
  children,
  title = "Dashboard",
  showHeader = true,
  showSearch = true,
}) {
  const { url } = usePage();
  const currentPath = url.split("?")[0];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tampilkan sidebar otomatis di layar besar
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F8]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPath={currentPath} />
      <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
        <div className="flex-1 flex flex-col h-full">
          {showHeader && (
            <Header
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              title={title}
              showSearch={showSearch}
            />
          )}
          <main className="p-8 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}