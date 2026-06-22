import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

/* =========================================================
 * Self-contained DashboardLayout
 * - No external header/sidebar component dependency.
 * - Sidebar, header, and notification panel are all inlined below.
 * ========================================================= */

/* --- Sidebar navigation config --- */
const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "/images/icon_dashboard.png",
    iconClass: "w-4.5 h-4.5",
  },
  {
    label: "Beli Pelatihan",
    href: "/beli-pelatihan",
    icon: "/images/icon_buy.png",
    iconClass: "w-6 h-6",
  },
  {
    label: "Pelatihan",
    href: "/pelatihan",
    icon: "/images/icon_pelatihan.png",
    iconClass: "w-5 h-5",
  },
  {
    label: "Sertifikat",
    href: "/sertifikat",
    icon: "/images/icon_sertif.png",
    iconClass: "w-6 h-6",
  },
  {
    label: "Profil Saya",
    href: "/profile",
    icon: "/images/iconprofile.png",
    iconClass: "w-6 h-6",
  },
];

/* --- Helpers --- */
function getInitials(name) {
  if (!name) return "PM";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* --- Inlined sidebar --- */
function Sidebar({ isOpen, onClose, currentPath }) {
  return (
    <>
      {/* Backdrop - mobile & tablet */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[288px] max-w-[85vw] flex-col bg-[#F6F3F2] border-r border-[#E4E2E1] py-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
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
                    ? "bg-[#006B32] text-white font-semibold shadow-[0_4px_6px_-1px_rgba(0,107,50,0.2)]"
                    : "text-[#3D4A3E] hover:bg-white/60"
                }`}
              >
                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? "[&>img]:brightness-0 [&>img]:invert"
                      : "[&>img]:brightness-0 [&>img]:opacity-70"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`${item.iconClass} object-contain`}
                  />
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
function Header({
  sidebarOpen,
  onToggleSidebar,
  onToggleNotif,
  title,
  showSearch,
}) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const displayName = user?.name || "Pengguna";
  const firstName = displayName.split(" ")[0];

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
            <svg
              className="w-4 h-5 text-[#3D4A3E]/60"
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
                {firstName}
              </p>
              <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[10px] tracking-wider uppercase text-[#006B32]">
                Member Gratis
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B32] border-2 border-[#006B32]/20 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              {getInitials(displayName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* --- Inlined notification panel --- */
function NotificationPanel({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Tombol Kembali */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#006B32] font-semibold mb-8 hover:opacity-80 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Kembali ke Dashboard
      </button>

      {/* Header Notifikasi */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span className="text-[#1B1C1C]">Dashboard</span>
          <span className="text-[#6B7280]">{">"}</span>
          <span className="text-[#006B32]">Notifikasi</span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1C1C] mb-2">
              Notifikasi Anda
            </h1>
            <p className="text-[#6B7280]">
              Tetap terinformasi dengan aktivitas terbaru akun Anda.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#006B32] text-[#006B32] font-semibold rounded-lg hover:bg-green-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7M5 18l4 4l10-10"
              />
            </svg>
            Tandai semua dibaca
          </button>
        </div>
      </div>

      {/* Daftar Kartu Notifikasi */}
      <div className="space-y-4">
        {/* 1. Kartu Success (Hijau) */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] border-l-[#006B32] p-6 flex items-start gap-4 relative">
          <div className="absolute right-6 top-6 text-xs text-[#6B7280]">
            2 jam yang lalu
          </div>
          <div className="shrink-0 w-12 h-12 rounded-full border border-[#006B32] bg-[#E5F0E9] flex items-center justify-center text-[#006B32]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1 pr-16">
            <h3 className="text-lg font-bold text-[#1B1C1C] mb-1">
              Pembayaran Berhasil!
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              Anda kini memiliki akses penuh ke Kursus Manajemen Keuangan.
            </p>
            <button className="bg-[#006B32] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-green-800 transition">
              Mulai Belajar
            </button>
          </div>
        </div>

        {/* 2. Kartu Error/Gagal (Merah) */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] border-l-[#DC2626] p-6 flex items-start gap-4 relative">
          <div className="absolute right-6 top-6 text-xs text-[#6B7280]">
            Dua hari yang lalu
          </div>
          <div className="shrink-0 w-12 h-12 rounded-full border border-[#DC2626] bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1 pr-16">
            <h3 className="text-lg font-bold text-[#DC2626] mb-1">
              Transaksi Gagal
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              Silakan coba lagi atau hubungi bantuan jika kendala berlanjut.
            </p>
            <div className="flex gap-3">
              <button className="bg-[#DC2626] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition">
                Coba Lagi
              </button>
              <button className="border-2 border-[#E4E2E1] text-[#4B5563] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">
                Hubungi Bantuan
              </button>
            </div>
          </div>
        </div>

        {/* 3. Kartu Info/Promo (Oranye) */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] border-l-[#FF8928] p-6 flex items-start gap-4 relative">
          <div className="absolute right-6 top-6 text-xs text-[#6B7280]">
            Kemarin
          </div>
          <div className="shrink-0 w-12 h-12 rounded-full border border-[#FF8928] bg-[#FFF3E8] flex items-center justify-center text-[#FF8928]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div className="flex-1 pr-16">
            <h3 className="text-lg font-bold text-[#1B1C1C] mb-1">
              Kelas Gratis Baru Tersedia!
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              'Tips Berkebun di Rumah' kini dapat Anda ikuti tanpa biaya.
            </p>
            <button className="bg-[#FF8928] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition">
              Lihat Detail Kelas
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[#6B7280] mt-10 text-sm font-medium">
        Menampilkan 3 notifikasi terbaru
      </p>
    </div>
  );
}

/* =========================================================
 * Main layout export
 * ========================================================= */
export default function DashboardLayout({
  children,
  title = "Dashboard",
  showHeader = true,
  showSearch = true,
}) {
  const { url } = usePage();
  const currentPath = url.split("?")[0];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Tutup tampilan notifikasi saat berpindah halaman
  useEffect(() => {
    setShowNotif(false);
  }, [url]);

  // Tampilkan sidebar otomatis di layar besar
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F8]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={currentPath}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}
      >
        <div className="flex-1 flex flex-col h-full">
          {showHeader && (
            <Header
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              onToggleNotif={() => setShowNotif((prev) => !prev)}
              title={title}
              showSearch={showSearch}
            />
          )}

          <main className="p-8 flex-1 overflow-y-auto">
            {showNotif ? (
              <NotificationPanel onBack={() => setShowNotif(false)} />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
