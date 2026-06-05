import MainLayout from '../Layouts/MainLayout';
import { Link } from '@inertiajs/react';

export default function Beranda() {
    return (
        <MainLayout>
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FBF9F8] pt-14 pb-20 relative overflow-hidden flex justify-center">
                <div className="max-w-[1200px] w-full px-10 relative">
                    {/* Container Putih Berbayang */}
                    <div className="bg-white border border-[#E4E2E1] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] rounded-xl flex flex-col md:flex-row p-4 relative z-10">
                        
                        {/* Kiri: Teks */}
                        <div className="flex flex-col gap-6 p-8 md:w-1/2 justify-center">
                            <h1 className="font-['Public_Sans'] font-bold text-5xl leading-[60px] text-[#1B1C1C] tracking-tight max-w-[524px]">
                                Persiapkan Masa Pensiun Anda dengan PENSIUN MUDAH
                            </h1>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xl leading-[32px] max-w-[524px]">
                                Memberdayakan profesional berpengalaman untuk transisi ke babak kehidupan berikutnya dengan percaya diri, stabilitas keuangan, dan tujuan yang bermakna.
                            </p>
                            <div className="mt-2">
                                <Link 
                                    href="/register" 
                                    className="bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg px-8 py-4 rounded-lg shadow-md inline-block transition-all"
                            >
                                    Mulai Sekarang
                                </Link>
                            </div>
                        </div>

                        {/* Kanan: Gambar */}
                        <div className="md:w-1/2 relative p-4 flex justify-end min-h-[400px]">
                            {/* Efek Blur Hijau (Decorative Element dari desain lu) */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#008740] opacity-20 blur-[32px] rounded-full z-0"></div>
                            
                            {/* Frame Gambar Utama */}
                            <div className="w-full max-w-[528px] h-full bg-gray-200 border-[8px] border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[24px] z-10 overflow-hidden relative">
                                {/* Nanti ganti dengan gambar asli: <img src="/hero-image.png" className="w-full h-full object-cover" /> */}
                                <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                                    Hero Image 528x528
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SEMUA YANG ANDA BUTUHKAN SECTION --- */}
            <section className="bg-[#FBF9F8] py-20 border-t border-[#E4E2E1]">
                <div className="max-w-[1200px] mx-auto px-10 flex flex-col items-center">
                    <p className="text-[#00A651] font-['Atkinson_Hyperlegible'] font-bold text-lg tracking-widest uppercase mb-4">
                        Semua Yang Anda Butuhkan
                    </p>
                    <h2 className="font-['Public_Sans'] font-bold text-5xl leading-[58px] text-[#1B1C1C] text-center max-w-[768px] tracking-tight mb-6">
                        Layanan Komprehensif untuk Masa Depan Anda
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xl leading-[32px] text-center max-w-[672px] mb-16 opacity-90">
                        Dari pembelajaran interaktif hingga konsultasi ahli, kami menyediakan ekosistem lengkap untuk persiapan masa pensiun Anda.
                    </p>

                    {/* Grid Fitur */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {/* Card 1 */}
                        <div className="bg-white border border-[#E4E2E1] shadow-sm rounded-xl p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-[#FF9E03] rounded-lg flex items-center justify-center text-white font-bold text-xl">1</div>
                            <h3 className="font-['Public_Sans'] font-bold text-xl text-[#1B1C1C]">LMS Pelatihan Lengkap</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-base leading-[24px]">250+ kursus video berkualitas tinggi dari instruktur berpengalaman, bisa diakses kapan saja dan di mana saja.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white border border-[#E4E2E1] shadow-sm rounded-xl p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-[#FA8686] rounded-lg flex items-center justify-center text-white font-bold text-xl">2</div>
                            <h3 className="font-['Public_Sans'] font-bold text-xl text-[#1B1C1C]">Konsultasi Profesional</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-base leading-[24px]">Akses langsung ke psikolog, konsultan bisnis, dokter wellness, dan ahli keuangan berpengalaman.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white border border-[#E4E2E1] shadow-sm rounded-xl p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-[#9FFA81] rounded-lg flex items-center justify-center text-[#1B1C1C] font-bold text-xl">3</div>
                            <h3 className="font-['Public_Sans'] font-bold text-xl text-[#1B1C1C]">Layanan Keuangan</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-base leading-[24px]">Solusi simpanan, investasi, pembiayaan dan pinjaman yang dirancang khusus untuk kebutuhan pensiunan.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA SECTION --- */}
            <section className="bg-[#006B32] py-14 px-10 flex justify-center">
                <div className="max-w-[1200px] flex flex-col items-center gap-6 text-center">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl md:text-[32px] leading-[42px] text-white">
                        Siap Memulai Perjalanan Pensiun Anda?
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-xl leading-[32px] text-white opacity-90 max-w-[672px]">
                        Bergabunglah dengan ribuan profesional lainnya yang telah mempercayakan persiapan masa pensiun mereka kepada Pensiun Mudah.
                    </p>
                    <Link href="/register" className="mt-4 bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg px-12 py-5 rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all">
                        Daftar Sekarang
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}
