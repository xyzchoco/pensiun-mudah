import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Sertifikat() {
    // DATA DUMMY: Daftar Sertifikat
    const certificates = [
        {
            id: 1,
            title: 'Literasi Keuangan Masa Pensiun',
            date: '12 Oktober 2023',
            image: '/images/cert-sample.png', // Ganti dengan gambar sertifikat lu
        },
        {
            id: 2,
            title: 'Psikologi Masa Pensiun',
            date: '05 November 2023',
            image: '/images/cert-sample.png',
        },
        {
            id: 3,
            title: 'Wellness & Kesehatan Senior',
            date: '29 Desember 2023',
            image: '/images/cert-sample.png',
        },
    ];

    return (
        <DashboardLayout title="Sertifikat" showSearch={false}>
            <Head title="Sertifikat Saya" />

            <div className="pb-10 max-w-7xl mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="mb-12 mt-2">
                    <h1 className="text-4xl font-bold text-[#006B32] mb-4">
                        Sertifikat Saya
                    </h1>
                    <p className="text-[#4B5563] text-base max-w-3xl leading-relaxed">
                        Selamat atas pencapaian Anda! Berikut adalah daftar sertifikat yang telah Anda selesaikan selama perjalanan pembelajaran di Pensiun Mudah.
                    </p>
                </div>

                {/* --- GRID SERTIFIKAT --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white border border-[#E4E2E1] rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                            
                            {/* Bingkai Gambar Sertifikat */}
                            <div className="w-full aspect-[4/3] bg-[#F3F4F6] rounded-2xl p-4 mb-6 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={cert.image} 
                                    alt={cert.title} 
                                    className="w-full h-full object-contain shadow-sm border border-gray-200"
                                    // Placeholder jika gambar gagal load
                                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Sertifikat"; }}
                                />
                            </div>

                            {/* Info Teks */}
                            <div className="flex-grow flex flex-col justify-center mb-6">
                                <h3 className="font-bold text-xl text-[#1B1C1C] mb-2 leading-tight px-2">
                                    {cert.title}
                                </h3>
                                <p className="text-sm text-[#6B7280]">
                                    Selesai pada: <span className="font-medium text-[#1B1C1C]">{cert.date}</span>
                                </p>
                            </div>

                            {/* Tombol Unduh */}
                            <button className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Unduh Sertifikat
                            </button>
                        </div>
                    ))}
                </div>

                {/* --- GREEN CTA BANNER --- */}
                <div className="mt-16 bg-[#006B32] rounded-[32px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    {/* Background Pattern Hiasan (Opsional) */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Terus Kembangkan Keahlian Anda
                        </h2>
                        <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
                            Setiap sertifikat yang Anda dapatkan adalah langkah nyata menuju masa pensiun yang lebih berdaya dan bermakna. Ingin mencoba tantangan baru?
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link 
                            href="/beli-pelatihan" 
                            className="inline-block bg-white text-[#1B1C1C] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Lihat Semua Kursus
                        </Link>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}