import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import DashboardHeader from '../../Components/DashboardHeader';
import DashboardSidebar from '../../Components/DashboardSidebar';

export default function DashboardLayout({ children, title = 'Dashboard', showHeader = true, showSearch = true }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    // Otomatis menutup tampilan notifikasi jika user berpindah halaman via Sidebar
    useEffect(() => {
        setShowNotif(false);
    }, [url]);

    // Tampilkan sidebar secara default di layar besar, sembunyikan di layar kecil
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#FBF9F8]">
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full">
                    {showHeader && (
                        <DashboardHeader
                            sidebarOpen={sidebarOpen}
                            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                            onToggleNotif={() => setShowNotif((prev) => !prev)}
                            title={title}
                            showSearch={showSearch}
                        />
                    )}

                    <main className="p-8 flex-1 overflow-y-auto">
                        {showNotif ? (
                            /* ========================================= */
                            /* TAMPILAN HALAMAN NOTIFIKASI               */
                            /* ========================================= */
                            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Tombol Kembali */}
                                <button 
                                    onClick={() => setShowNotif(false)} 
                                    className="flex items-center gap-2 text-[#006B32] font-semibold mb-8 hover:opacity-80 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Dashboard
                                </button>

                                {/* Header Notifikasi */}
                                <div className="flex flex-col gap-1 mb-6">
                                    <div className="text-sm font-semibold flex items-center gap-2">
                                        <span className="text-[#1B1C1C]">Dashboard</span>
                                        <span className="text-[#6B7280]">{'>'}</span>
                                        <span className="text-[#006B32]">Notifikasi</span>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <div>
                                            <h1 className="text-3xl font-bold text-[#1B1C1C] mb-2">Notifikasi Anda</h1>
                                            <p className="text-[#6B7280]">Tetap terinformasi dengan aktivitas terbaru akun Anda.</p>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#006B32] text-[#006B32] font-semibold rounded-lg hover:bg-green-50 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7M5 18l4 4l10-10" />
                                            </svg>
                                            Tandai semua dibaca
                                        </button>
                                    </div>
                                </div>

                                {/* Daftar Kartu Notifikasi */}
                                <div className="space-y-4">
                                    
                                    {/* 1. Kartu Success (Hijau) */}
                                    <div className="bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] border-l-[#006B32] p-6 flex items-start gap-4 relative">
                                        <div className="absolute right-6 top-6 text-xs text-[#6B7280]">2 jam yang lalu</div>
                                        <div className="shrink-0 w-12 h-12 rounded-full border border-[#006B32] bg-[#E5F0E9] flex items-center justify-center text-[#006B32]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 pr-16">
                                            <h3 className="text-lg font-bold text-[#1B1C1C] mb-1">Pembayaran Berhasil!</h3>
                                            <p className="text-[#6B7280] text-sm mb-4">Anda kini memiliki akses penuh ke Kursus Manajemen Keuangan.</p>
                                            <button className="bg-[#006B32] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-green-800 transition">
                                                Mulai Belajar
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2. Kartu Error/Gagal (Merah) */}
                                    <div className="bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] border-l-[#DC2626] p-6 flex items-start gap-4 relative">
                                        <div className="absolute right-6 top-6 text-xs text-[#6B7280]">Dua hari yang lalu</div>
                                        <div className="shrink-0 w-12 h-12 rounded-full border border-[#DC2626] bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 pr-16">
                                            <h3 className="text-lg font-bold text-[#DC2626] mb-1">Transaksi Gagal</h3>
                                            <p className="text-[#6B7280] text-sm mb-4">Silakan coba lagi atau hubungi bantuan jika kendala berlanjut.</p>
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
                                        <div className="absolute right-6 top-6 text-xs text-[#6B7280]">Kemarin</div>
                                        <div className="shrink-0 w-12 h-12 rounded-full border border-[#FF8928] bg-[#FFF3E8] flex items-center justify-center text-[#FF8928]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 pr-16">
                                            <h3 className="text-lg font-bold text-[#1B1C1C] mb-1">Kelas Gratis Baru Tersedia!</h3>
                                            <p className="text-[#6B7280] text-sm mb-4">'Tips Berkebun di Rumah' kini dapat Anda ikuti tanpa biaya.</p>
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
                        ) : (
                            /* ========================================= */
                            /* KONTEN UTAMA DASHBOARD NORMAL             */
                            /* ========================================= */
                            children
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}