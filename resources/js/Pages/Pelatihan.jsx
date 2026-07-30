import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';

// Badge warna per tipe kelas
const tipeBadge = {
  Online: { label: 'Online', bg: 'bg-blue-100 text-blue-700' },
  Offline: { label: 'Offline', bg: 'bg-amber-100 text-amber-700' },
  Hybrid: { label: 'Hybrid', bg: 'bg-purple-100 text-purple-700' },
};

function CourseCard({ course, isCompleted = false }) {
  const tipe = course.tipe_kelas || 'Online';
  const badge = tipeBadge[tipe] || tipeBadge.Online;
  const isOffline = tipe === 'Offline';

  // Tentukan href tombol utama berdasarkan tipe kelas
  const mainHref = isOffline
    ? `/pelatihan/${course.id}/detail-offline`
    : `/pelatihan/${course.id}/belajar${course.firstLessonId ? `?lesson=${course.firstLessonId}` : ''}`;

  const mainLabel = isOffline ? 'Lihat Detail Kelas' : 'Lanjutkan Belajar';

  return (
    <div className="bg-white border border-[#E4E2E1] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-[180px] bg-gray-100 shrink-0">
        {course.image ? (
          <img src={course.image} className="w-full h-full object-cover" alt="Course" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {/* Badge kategori */}
        <span className="absolute top-4 left-4 bg-[#006B32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{course.category}</span>
        {/* Badge tipe kelas */}
        <span className={`absolute top-4 right-4 text-[11px] font-bold px-3 py-1.5 rounded-full ${badge.bg}`}>{badge.label}</span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#1B1C1C] mb-8 line-clamp-2">{course.title}</h3>

        {!isCompleted ? (
          <div className="mt-auto">
            {/* Progress bar hanya untuk kelas Online/Hybrid */}
            {!isOffline && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#4B5563]">Progres Belajar</span>
                  <span className="text-sm font-bold text-[#006B32]">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                  <div className="bg-[#006B32] h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </>
            )}

            {/* Info singkat untuk kelas offline */}
            {isOffline && (
              <p className="text-sm text-[#6B7280] mb-6">
                Kelas tatap muka — lihat detail jadwal & lokasi.
              </p>
            )}

            {course.next_session && (
              <div className="mb-6 p-4 rounded-2xl bg-[#E5F0E9] border border-[#006B32]/10 text-left">
                <p className="text-[11px] font-bold text-[#006B32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Jadwal Praktik Hybrid Terdekat
                </p>
                <div className="space-y-1 text-xs text-[#3D4A3E]">
                  <p className="font-bold text-[#1B1C1C]">{course.next_session.tanggal}</p>
                  <p className="font-medium">{course.next_session.jam}</p>
                  <p className="truncate font-medium flex items-center gap-1">
                    <svg className="w-3 h-3 text-[#3D4A3E]/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                    {course.next_session.lokasi}
                  </p>
                </div>
              </div>
            )}

            {!isOffline && course.progress === 100 ? (
              <div className="space-y-3">
                <Link
                  href={route('sertifikat.index')}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh Sertifikat
                </Link>
                <Link
                  href={route('pelatihan.review.create', course.id)}
                  className="w-full flex items-center justify-center gap-2 border border-[#E4E2E1] text-[#1B1C1C] font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors text-center"
                >
                  Beri Penilaian
                </Link>
              </div>
            ) : (
              <Link
                href={mainHref}
                className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
              >
                {!isOffline && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                )}
                {isOffline && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                {mainLabel}
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-auto space-y-3">
            <Link
              href={route('sertifikat.index')}
              className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Unduh Sertifikat
            </Link>
            <Link
              href={route('pelatihan.review.create', course.id)}
              className="w-full flex items-center justify-center gap-2 border border-[#E4E2E1] text-[#1B1C1C] font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors text-center"
            >
              Beri Penilaian
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Terima props dinamis dari controller
export default function Pelatihan({ ongoingCourses = [], completedCourses = [] }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'User Pensiun Mudah';

  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState('sedang_berjalan');

  // Fungsi untuk mengelompokkan kursus berdasarkan tipe_kelas
  const groupByTipe = (courses) => {
    const groups = {};
    courses.forEach((c) => {
      const tipe = c.tipe_kelas || 'Online';
      if (!groups[tipe]) groups[tipe] = [];
      groups[tipe].push(c);
    });
    return groups;
  };

  const currentCourses = activeTab === 'sedang_berjalan' ? ongoingCourses : completedCourses;
  const grouped = groupByTipe(currentCourses);
  const tipeOrder = ['Online', 'Hybrid', 'Offline'];
  const sortedTipes = tipeOrder.filter((t) => grouped[t]?.length > 0);

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
            className={`pb-4 text-[15px] font-bold transition-all relative ${activeTab === 'sedang_berjalan' ? 'text-[#006B32]' : 'text-[#6B7280] hover:text-[#1B1C1C]'
              }`}
          >
            Sedang Berjalan ({ongoingCourses.length})
            {activeTab === 'sedang_berjalan' && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006B32] rounded-t-md"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('selesai')}
            className={`pb-4 text-[15px] font-bold transition-all relative ${activeTab === 'selesai' ? 'text-[#006B32]' : 'text-[#6B7280] hover:text-[#1B1C1C]'
              }`}
          >
            Selesai ({completedCourses.length})
            {activeTab === 'selesai' && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006B32] rounded-t-md"></span>
            )}
          </button>
        </div>

        {/* --- GRID KONTEN (GROUPED BY TIPE KELAS) --- */}
        {currentCourses.length === 0 && (
          <div className="text-center py-12 text-[#6B7280]">
            {activeTab === 'sedang_berjalan'
              ? 'Belum ada pelatihan yang sedang berjalan. Yuk beli kelas dulu!'
              : 'Belum ada pelatihan yang diselesaikan. Semangat belajarnya!'}
          </div>
        )}

        {sortedTipes.map((tipe) => (
          <div key={tipe} className="mb-10">
            <h2 className="text-xl font-bold text-[#1B1C1C] mb-4 flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${tipe === 'Online' ? 'bg-blue-500' : tipe === 'Offline' ? 'bg-amber-500' : 'bg-purple-500'}`}></span>
              Kelas {tipe}
              <span className="text-sm font-normal text-[#6B7280]">({grouped[tipe].length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {grouped[tipe].map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompleted={activeTab === 'selesai'}
                />
              ))}
            </div>
          </div>
        ))}

      </div>
    </DashboardLayout>
  );
}