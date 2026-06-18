import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Pelatihan() {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Budi Santoso';

    // State untuk tab aktif
    const [activeTab, setActiveTab] = useState('sedang_berjalan');

    // DATA DUMMY: Kursus Sedang Berjalan (4 Item)
    const ongoingCourses = [
        { id: 1, title: 'Literasi Keuangan Masa Pensiun', category: 'Keuangan', progress: 65, image: '/images/course-keuangan.jpg' },
        { id: 2, title: 'Kesehatan Fisik di Usia Emas', category: 'Kesehatan', progress: 30, image: '/images/course-kesehatan.jpg' },
        { id: 3, title: 'Berkebun Organik di Rumah', category: 'Hobi', progress: 85, image: '' },
        { id: 4, title: 'Membangun Komunitas di Masa Pensiun', category: 'Sosial', progress: 15, image: '/images/course-sosial.jpg' }
    ];

    // DATA DUMMY: Kursus Selesai (12 Item sesuai desain)
    const completedCourses = Array.from({ length: 12 }).map((_, index) => ({
        id: index + 1,
        title: [
            'Literasi Keuangan Masa Pensiun',
            'Kesehatan Fisik di Usia Emas',
            'Berkebun Organik di Rumah',
            'Membangun Komunitas di Masa Pensiun'
        ][index % 4],
        category: ['Keuangan', 'Kesehatan', 'Hobi', 'Sosial'][index % 4],
        image: index === 2 ? '' : `/images/course-${['keuangan', 'kesehatan', 'hobi', 'sosial'][index % 4]}.jpg`
    }));

    return (
        <DashboardLayout title="Pelatihan" showSearch={false}>
            <Head title="Pelatihan" />

            <div className="pb-10 max-w-7xl">
                
                {/* --- HEADER SECTION --- */}
                <div className="mb-8 mt-2">
                    <h1 className="text-3xl md:text-[34px] font-bold text-[#1B1C1C] mb-3">
                        Halo, {userName}
                    </h1>
                    <p className="text-[#4B5563] text-base max-w-2xl leading-relaxed">
                        Lanjutkan Pelatihan Anda hari ini untuk masa pensiun yang lebih bermakna.
                    </p>
                </div>

                {/* --- TABS NAVIGATION --- */}
                <div className="flex gap-8 border-b border-[#E4E2E1] mb-8">
                    <button
                        onClick={() => setActiveTab('sedang_berjalan')}
                        className={`pb-4 text-[15px] font-bold transition-all relative ${
                            activeTab === 'sedang_berjalan' ? 'text-[#006B32]' : 'text-[#6B7280] hover:text-[#1B1C1C]'
                        }`}
                    >
                        Sedang Berjalan ({ongoingCourses.length})
                        {activeTab === 'sedang_berjalan' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006B32] rounded-t-md"></span>
                        )}
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('selesai')}
                        className={`pb-4 text-[15px] font-bold transition-all relative ${
                            activeTab === 'selesai' ? 'text-[#006B32]' : 'text-[#6B7280] hover:text-[#1B1C1C]'
                        }`}
                    >
                        Selesai ({completedCourses.length})
                        {activeTab === 'selesai' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006B32] rounded-t-md"></span>
                        )}
                    </button>
                </div>

                {/* --- GRID KONTEN --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* VIEW: SEDANG BERJALAN */}
                    {activeTab === 'sedang_berjalan' && ongoingCourses.map((course) => (
                        <div key={course.id} className="bg-white border border-[#E4E2E1] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
                            <div className="relative h-[180px] bg-gray-100 shrink-0">
                                {course.image ? (
                                    <img src={course.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 bg-[#006B32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{course.category}</span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg text-[#1B1C1C] mb-8">{course.title}</h3>
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#4B5563]">Progres Belajar</span>
                                        <span className="text-sm font-bold text-[#006B32]">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-6"><div className="bg-[#006B32] h-full rounded-full" style={{ width: `${course.progress}%` }}></div></div>
                                    <button className="w-full flex items-center justify-center gap-2 bg-[#FF8928] text-white font-bold py-3 rounded-xl text-sm">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                        Lanjutkan Belajar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* VIEW: SELESAI (Sesuai Gambar) */}
                    {activeTab === 'selesai' && completedCourses.map((course) => (
                        <div key={course.id} className="bg-white border border-[#E4E2E1] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
                            {/* Gambar */}
                            <div className="relative h-[180px] bg-gray-100 shrink-0">
                                {course.image ? (
                                    <img src={course.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 bg-[#006B32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{course.category}</span>
                            </div>

                            {/* Konten */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg text-[#1B1C1C] mb-8">{course.title}</h3>
                                
                                <div className="mt-auto space-y-3">
                                    {/* Tombol Unduh Sertifikat */}
                                    <button className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Unduh Sertifikat
                                    </button>
                                    
                                    {/* Tombol Beri Penilaian */}
                                    <button className="w-full border border-[#E4E2E1] text-[#1B1C1C] font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                                        Beri Penilaian
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </DashboardLayout>
    );
}