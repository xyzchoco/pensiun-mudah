import DashboardLayout from '../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            
            {/* Pembungkus Utama (Stack vertikal) biar Banner bisa Full Width */}
            <div className="flex flex-col gap-6 pb-10">
                
                {/* ========================================== */}
                {/* 1. HERO BANNER (FULL WIDTH MENTOK KIRI KANAN) */}
                {/* ========================================== */}
                <div className="relative bg-[#368E5E] rounded-2xl overflow-hidden h-[240px] flex items-center px-10 shadow-sm w-full">
                    {/* Background Overlay (Ganti url gambarnya sesuai aset lu) */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60" 
                        style={{ backgroundImage: "url('/images/hero-dashboard-bg.png')" }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#206941] via-[#2D7A4D]/80 to-transparent" />

                    <div className="relative z-10 max-w-lg flex flex-col items-start text-white">
                        <h2 className="text-[32px] font-bold mb-2 leading-tight">Spesial Kelas MPP</h2>
                        <p className="text-sm opacity-90 mb-6 font-['Atkinson_Hyperlegible'] leading-relaxed">
                            Voucher Potongan 200rb khusus untuk pendaftaran bulan ini.
                        </p>
                        <button className="bg-[#FF8928] hover:bg-[#e67a22] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-md">
                            Gunakan Kode
                        </button>
                    </div>

                    {/* Slider Indicator Dots (Sesuai Desain) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        <div className="w-8 h-1.5 bg-[#006B32] rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full mt-[-1px]"></div>
                    </div>
                </div>

                {/* ========================================== */}
                {/* GRID BAWAH (KIRI 8 KOLOM, KANAN 4 KOLOM) */}
                {/* ========================================== */}
                <div className="grid grid-cols-12 gap-6">
                    
                    {/* MAIN CONTENT (KIRI) */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                        
                        {/* --- 2. STATS CARDS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat 1 */}
                            <div className="bg-white border border-[#E4E2E1] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center text-2xl">
                                    📘
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-1">KURSUS DIIKUTI</p>
                                    <p className="text-[28px] font-extrabold text-[#1B1C1C] leading-none mb-1">14</p>
                                    <p className="text-[10px] font-bold text-[#008740]">+2 bulan ini</p>
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="bg-white border border-[#E4E2E1] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FFF7ED] text-[#EA580C] rounded-full flex items-center justify-center text-2xl">
                                    🕒
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-1">JAM BELAJAR</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <p className="text-[28px] font-extrabold text-[#1B1C1C] leading-none">48</p>
                                        <p className="text-sm font-bold text-[#1B1C1C]">h</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-[#008740]">+5h minggu ini</p>
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-white border border-[#E4E2E1] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FFF3E5] text-[#FF8928] rounded-full flex items-center justify-center text-2xl">
                                    🏅
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-1">SERTIFIKAT</p>
                                    <p className="text-[28px] font-extrabold text-[#1B1C1C] leading-none mb-1">3</p>
                                    <p className="text-[10px] font-bold text-[#B45309]">1 dalam proses</p>
                                </div>
                            </div>
                        </div>

                        {/* --- 3. GABUNG KORPORAT --- */}
                        <div className="bg-white border border-[#E4E2E1] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h3 className="font-bold text-[#1B1C1C] mb-2 flex items-center gap-2">
                                    <span>🏢</span> Gabung Pelatihan Korporat
                                </h3>
                                <p className="text-xs text-[#6B7280] max-w-[300px]">
                                    Masukkan kode akses dari perusahaan Anda untuk mulai belajar.
                                </p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <input 
                                    className="border border-[#E4E2E1] px-4 py-3 rounded-lg w-full md:w-[240px] text-xs bg-[#FBF9F8] outline-none focus:border-[#008740]" 
                                    placeholder="CONTOH: CORP-2024-XXXX" 
                                />
                                <button className="bg-[#FF8928] hover:bg-[#e67a22] text-white px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors">
                                    <span>🔗</span> Gabung Pelatihan
                                </button>
                            </div>
                        </div>

                        {/* --- 4. PROGRESS KURSUS AKTIF --- */}
                        <div className="bg-white border border-[#E4E2E1] p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1B1C1C] mb-6 flex items-center gap-2">
                                <span>📖</span> Progress Kursus Aktif
                            </h3>
                            <div className="flex flex-col gap-6">
                                {/* Course 1 */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded bg-[#FBF9F8] flex items-center justify-center text-lg">💰</span>
                                            <span className="text-sm font-bold text-[#1B1C1C]">Literasi Keuangan Pensiun — Modul 4</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#008740]">75%</span>
                                    </div>
                                    <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#008740] h-full rounded-full" style={{width: '75%'}}></div>
                                    </div>
                                </div>

                                {/* Course 2 */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded bg-[#FBF9F8] flex items-center justify-center text-lg">🧠</span>
                                            <span className="text-sm font-bold text-[#1B1C1C]">Psikologi Masa Pensiun — Modul 2</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#6B7280]">46%</span>
                                    </div>
                                    <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#9CA3AF] h-full rounded-full" style={{width: '46%'}}></div>
                                    </div>
                                </div>

                                {/* Course 3 */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded bg-[#FBF9F8] flex items-center justify-center text-lg">🏃</span>
                                            <span className="text-sm font-bold text-[#1B1C1C]">Wellness & Kesehatan Senior — Modul 1</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#B45309]">26%</span>
                                    </div>
                                    <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#B45309] h-full rounded-full" style={{width: '26%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- 5. AKTIVITAS BELAJAR (CHART) --- */}
                        <div className="bg-white border border-[#E4E2E1] p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1B1C1C] mb-8 flex items-center gap-2">
                                <span>📊</span> Aktivitas Belajar (7 Hari)
                            </h3>
                            {/* Dummy Bar Chart */}
                            <div className="flex items-end justify-between h-32 border-b border-[#E4E2E1] pb-2 relative px-4">
                                {[
                                    { day: 'Sen', val: 10, label: '2h' },
                                    { day: 'Sel', val: 5, label: '1h' },
                                    { day: 'Rab', val: 15, label: '3h' },
                                    { day: 'Kam', val: 10, label: '2h' },
                                    { day: 'Jum', val: 10, label: '2h' },
                                    { day: 'Sab', val: 8, label: '1.5h' },
                                    { day: 'Min', val: 3, label: '0.5h' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 relative group w-10">
                                        <span className="text-[10px] font-bold text-[#6B7280] absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.label}
                                        </span>
                                        <div className="w-full bg-[#008740] rounded-t-sm" style={{height: `${item.val * 4}px`}}></div>
                                        <div className="absolute -bottom-8 w-full text-center">
                                            <span className="text-[10px] font-bold text-[#9CA3AF]">{item.day}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-8"></div>
                        </div>

                    </div>

                    {/* SIDEBAR (KANAN) */}
                    <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                        
                        {/* --- 6. EVENT --- */}
                        <div className="bg-white border border-[#E4E2E1] p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1B1C1C] mb-6 flex items-center gap-2">
                                <span>📅</span> Event
                            </h3>
                            
                            <div className="flex flex-col gap-5 mb-6">
                                {/* Event 1 */}
                                <div className="flex gap-4">
                                    <div className="w-[80px] h-[60px] rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                                        <img src="/images/event-seminar.png" className="w-full h-full object-cover" alt="Event" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="bg-[#008740] text-white text-[8px] font-bold px-2 py-0.5 rounded-full w-fit mb-1">Seminar Online</span>
                                        <h4 className="font-bold text-xs text-[#1B1C1C] mb-1">Manajemen Keuangan</h4>
                                        <p className="text-[10px] text-[#6B7280] flex items-center gap-1">🕐 14:00 WIB • 🎥 Live Zoom</p>
                                    </div>
                                </div>

                                {/* Event 2 */}
                                <div className="flex gap-4">
                                    <div className="w-[80px] h-[60px] rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                                        <img src="/images/event-workshop-1.png" className="w-full h-full object-cover" alt="Event" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="bg-[#E11D48] text-white text-[8px] font-bold px-2 py-0.5 rounded-full w-fit mb-1">Workshop Offline</span>
                                        <h4 className="font-bold text-xs text-[#1B1C1C] mb-1">Materi Keuangan</h4>
                                        <p className="text-[10px] text-[#6B7280] flex items-center gap-1">🕐 14:00 WIB</p>
                                    </div>
                                </div>

                                {/* Event 3 */}
                                <div className="flex gap-4">
                                    <div className="w-[80px] h-[60px] rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                                        <img src="/images/event-workshop-2.png" className="w-full h-full object-cover" alt="Event" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="bg-[#E11D48] text-white text-[8px] font-bold px-2 py-0.5 rounded-full w-fit mb-1">Workshop Offline</span>
                                        <h4 className="font-bold text-xs text-[#1B1C1C] mb-1">Gabung Pelatihan Gratis</h4>
                                        <p className="text-[10px] text-[#6B7280] flex items-center gap-1">🕐 10:00 WIB</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full border border-[#6B7280] hover:bg-gray-50 text-[#1B1C1C] py-2.5 rounded-lg text-sm font-bold transition-colors">
                                Lihat Event
                            </button>
                        </div>

                        {/* --- 7. TARGET PENSIUN GAUGE --- */}
                        <div className="bg-white border border-[#E4E2E1] p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1B1C1C] mb-8 flex items-center gap-2">
                                <span>🎯</span> Target Pensiun
                            </h3>
                            
                            <div 
                                className="w-[160px] h-[160px] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                                style={{ background: 'conic-gradient(#008740 68%, #F3F4F6 0)' }}
                            >
                                <div className="w-[136px] h-[136px] bg-white rounded-full flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                                    <p className="text-[32px] font-extrabold text-[#1B1C1C] leading-none mb-1">
                                        68<span className="text-lg">%</span>
                                    </p>
                                    <p className="text-[8px] font-bold text-[#6B7280] text-center px-4 leading-tight uppercase">
                                        Kesiapan Pensiun Anda
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#F0FDF4] p-3 rounded-xl flex flex-col items-center justify-center border border-[#DCFCE7]">
                                    <span className="text-[10px] font-bold text-[#16A34A] mb-1 uppercase">Mental</span>
                                    <span className="text-lg font-extrabold text-[#16A34A]">85%</span>
                                </div>
                                <div className="bg-[#FFF7ED] p-3 rounded-xl flex flex-col items-center justify-center border border-[#FFEDD5]">
                                    <span className="text-[10px] font-bold text-[#EA580C] mb-1 uppercase">Keuangan</span>
                                    <span className="text-lg font-extrabold text-[#EA580C]">55%</span>
                                </div>
                                <div className="bg-[#EFF6FF] p-3 rounded-xl flex flex-col items-center justify-center border border-[#DBEAFE]">
                                    <span className="text-[10px] font-bold text-[#2563EB] mb-1 uppercase">Kesehatan</span>
                                    <span className="text-lg font-extrabold text-[#2563EB]">70%</span>
                                </div>
                                <div className="bg-[#FEF2F2] p-3 rounded-xl flex flex-col items-center justify-center border border-[#FEE2E2]">
                                    <span className="text-[10px] font-bold text-[#DC2626] mb-1 uppercase">Sosial</span>
                                    <span className="text-lg font-extrabold text-[#DC2626]">60%</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}