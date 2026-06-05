import DashboardLayout from '../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            
            <div className="grid grid-cols-12 gap-6">
                {/* Main Content (Left) */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                    {/* Hero Banner - Perbaikan Lebar & Presisi */}
                    <div className="col-span-12 xl:col-span-8 bg-[#006B32] text-white p-8 rounded-2xl flex items-center relative overflow-hidden h-[240px]">
                        {/* Background Image Layer */}
                        <div 
                            className="absolute inset-0 bg-cover bg-right opacity-40" 
                            style={{ backgroundImage: "url('/images/hero-bg.png')" }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#006B32] via-[#006B32]/80 to-transparent" />

                        {/* Content Area - Diubah jadi w-full agar lebih leluasa */}
                        <div className="relative z-10 w-full flex flex-col justify-center">
                            <span className="bg-[#FFFFFF]/20 px-3 py-1 text-[10px] font-bold rounded mb-3 inline-block tracking-widest uppercase w-fit">
                                PROMO SPESIAL
                            </span>
                            <h2 className="text-3xl font-bold mb-2">Spesial Kelas MPP</h2>
                            <p className="text-sm opacity-90 mb-6 max-w-lg leading-relaxed">
                                Voucher Potongan 200rb khusus untuk pendaftaran bulan ini. Persiapkan masa pensiun dengan lebih baik.
                            </p>
                            <button className="bg-[#FF8928] text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#e67a22] transition-colors w-fit">
                                Gunakan Kode
                            </button>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'KURSUS DIIKUTI', val: '14', badge: '+2 bulan ini' },
                            { label: 'JAM BELAJAR', val: '48h', badge: '+4h mgg ini' },
                            { label: 'SERTIFIKAT', val: '3', badge: '1 dlm proses' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-[#E4E2E1] shadow-sm">
                                <p className="text-[10px] font-bold text-[#6B7280] mb-1">{s.label}</p>
                                <p className="text-2xl font-bold mb-1">{s.val}</p>
                                <p className="text-[10px] text-[#006B32] font-bold bg-[#E8F5E9] px-2 py-1 rounded w-fit">{s.badge}</p>
                            </div>
                        ))}
                    </div>

                    {/* Gabung Kelas Korporat */}
                    <div className="bg-white border border-[#E4E2E1] p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-2 text-[#1B1C1C]">🏢 Gabung Kelas Korporat</h3>
                        <p className="text-sm text-[#6B7280] mb-4">Masukkan kode akses dari perusahaan Anda untuk mulai belajar bersama tim.</p>
                        <div className="flex gap-4">
                            <input className="border border-[#E4E2E1] p-3 rounded-lg flex-1 text-sm bg-[#FBF9F8]" placeholder="CONTOH: CORP-2024-XXXX" />
                            <button className="bg-[#FF8928] text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2">
                                🔗 Gabung Kelas
                            </button>
                        </div>
                    </div>

                    {/* Progress Kursus Aktif */}
                    <div className="bg-white border border-[#E4E2E1] p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-[#1B1C1C]">📖 Progress Kursus Aktif</h3>
                            <button className="text-xs font-bold text-[#6B7280] border border-[#E4E2E1] px-3 py-1 rounded-lg">Lebih Banyak</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Literasi Keuangan Pensiun — Modul 4', prog: '75%', color: 'bg-[#006B32]' },
                                { title: 'Psikologi Masa Pensiun — Modul 2', prog: '46%', color: 'bg-[#6B7280]' },
                                { title: 'Wellness & Kesehatan Senior — Modul 1', prog: '26%', color: 'bg-[#FF8928]' },
                            ].map((c, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1 font-bold">
                                        <span className="text-[#1B1C1C]">{c.title}</span>
                                        <span className="text-[#006B32]">{c.prog}</span>
                                    </div>
                                    <div className="w-full bg-[#E4E2E1] h-2 rounded-full overflow-hidden">
                                        <div className={`${c.color} h-full`} style={{width: c.prog}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aktivitas Belajar Chart */}
                    <div className="bg-white border border-[#E4E2E1] p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-6 text-[#1B1C1C]">📊 Aktivitas Belajar <span className="text-xs font-normal text-[#6B7280]">(7 Hari Terakhir)</span></h3>
                        <div className="flex items-end justify-between h-40 gap-2 border-b pb-2">
                            {[15, 8, 35, 20, 20, 8, 5].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    {h === 35 && <span className="bg-[#006B32] text-white text-[10px] px-2 py-1 rounded">3.2 jam</span>}
                                    <div className={`w-8 rounded-t ${h === 35 ? 'bg-[#006B32]' : 'bg-[#E4E2E1]'}`} style={{height: h * 3}}></div>
                                    <span className="text-xs font-bold text-[#6B7280]">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                    {/* Target Pensiun Gauge */}
                    <div className="bg-white border border-[#E4E2E1] p-6 rounded-xl shadow-sm text-center">
                        <h3 className="font-bold mb-4 text-left text-[#1B1C1C]">🎯 Target Pensiun</h3>
                        <div className="w-32 h-32 border-[12px] border-[#006B32] rounded-full mx-auto flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-[#1B1C1C]">68%</span>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-4 font-bold">KESIAPAN ANDA</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <div className="bg-[#FBF9F8] p-2 rounded text-[#1B1C1C]">MENTAL 85%</div>
                            <div className="bg-[#FBF9F8] p-2 rounded text-[#1B1C1C]">KEUANGAN 55%</div>
                            <div className="bg-[#FBF9F8] p-2 rounded text-[#1B1C1C]">KESEHATAN 70%</div>
                            <div className="bg-[#FBF9F8] p-2 rounded text-[#1B1C1C]">SOSIAL 60%</div>
                        </div>
                    </div>

                    {/* Jadwal Mendatang */}
                    <div className="bg-white border border-[#E4E2E1] p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-4 text-[#1B1C1C]">📅 Jadwal Mendatang</h3>
                        {[
                            { date: '23 MEI', title: 'Manajemen Keuangan', time: '14:00 WIB' },
                            { date: '23 MEI', title: 'Materi Keuangan', time: '14:00 WIB' },
                            { date: '25 MEI', title: 'Gabung Pelatihan', time: '10:00 WIB' }
                        ].map((j, i) => (
                            <div key={i} className="flex gap-3 mb-4 items-center">
                                <div className="bg-[#E8F5E9] text-[#006B32] text-[10px] font-bold p-2 rounded-lg text-center w-12">{j.date}</div>
                                <div>
                                    <p className="text-sm font-bold text-[#1B1C1C]">{j.title}</p>
                                    <p className="text-[10px] text-[#6B7280]">🕐 {j.time}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full border border-[#E4E2E1] py-2 rounded-lg text-sm font-bold mt-2 text-[#6B7280]">Lihat Semua Jadwal</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}