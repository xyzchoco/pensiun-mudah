import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

// Terima props dinamis dari controller
export default function Pelatihan({ ongoingCourses = [], completedCourses = [] }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'User Pensiun Mudah';

  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState('sedang_berjalan');

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

        {/* --- GRID KONTEN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* VIEW: SEDANG BERJALAN */}
          {activeTab === 'sedang_berjalan' && ongoingCourses.map((course) => (
            <div key={course.id} className="bg-white border border-[#E4E2E1] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-[180px] bg-gray-100 shrink-0">
                {course.image ? (
                  <img src={course.image} className="w-full h-full object-cover" alt="Course" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-[#006B32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{course.category}</span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-[#1B1C1C] mb-8 line-clamp-2">{course.title}</h3>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#4B5563]">Progres Belajar</span>
                    <span className="text-sm font-bold text-[#006B32]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                    <div className="bg-[#006B32] h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>

                  {/* LINK KELAS AKTIF SEKARANG DINAMIS BOS */}
                  <Link
                    href={`/pelatihan/${course.id}/belajar${course.firstLessonId ? `?lesson=${course.firstLessonId}` : ''}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                    Lanjutkan Belajar
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY STATE SEDANG BERJALAN */}
          {activeTab === 'sedang_berjalan' && ongoingCourses.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#6B7280]">
              Belum ada pelatihan yang sedang berjalan bos. Yuk beli kelas dulu!
            </div>
          )}

          {/* VIEW: SELESAI */}
          {activeTab === 'selesai' && completedCourses.map((course) => (
            <div key={course.id} className="bg-white border border-[#E4E2E1] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-[180px] bg-gray-100 shrink-0">
                {course.image ? (
                  <img src={course.image} className="w-full h-full object-cover" alt="Course" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-[#006B32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{course.category}</span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-[#1B1C1C] mb-8 line-clamp-2">{course.title}</h3>

                <div className="mt-auto space-y-3">
                  <Link
                    href={route('sertifikat.index')}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Unduh Sertifikat
                  </Link>

                  <button className="w-full border border-[#E4E2E1] text-[#1B1C1C] font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                    Beri Penilaian
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY STATE SELESAI */}
          {activeTab === 'selesai' && completedCourses.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#6B7280]">
              Belum ada pelatihan yang diselesaikan bos. Semangat belajarnya!
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}