import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useRef } from 'react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const profileFormRef = useRef();
    const passwordFormRef = useRef();

    const handleSaveAll = () => {
        profileFormRef.current?.submit();
        passwordFormRef.current?.submit();
    };
    const { auth: { user } } = usePage().props;

    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
          })
        : '-';

    const completedCourses = user.enrollments
        ? user.enrollments.filter((enrollment) => enrollment.is_completed).length
        : 0;

    return (
        <DashboardLayout title="Profile" showSearch={false}>
            <Head title="Profile" />

            <div className="pb-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-[28px] font-bold text-[#1B1C1C]">Pengaturan Profil</h1>
                            <p className="mt-2 text-sm text-[#4B5563]">
                                Kelola informasi pribadi Anda untuk mendapatkan pengalaman belajar yang dipersonalisasi sesuai dengan kebutuhan masa pensiun Anda.
                            </p>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 rounded-lg border border-[#EF4444] bg-white px-5 py-2.5 text-sm font-semibold text-[#EF4444] shadow-sm hover:bg-red-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </Link>
                    </div>
                    
                    {/* Bagian Atas: Sidebar (Kiri) dan Informasi Pribadi (Kanan) */}
                    <div className="grid grid-cols-[320px_minmax(520px,720px)] gap-6 items-stretch">
                        
                        {/* Sidebar Profil */}
                        <aside className="h-full rounded-xl border border-[#DDE6DF] bg-white p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="relative inline-flex h-[130px] w-[130px] items-center justify-center rounded-full border-[3px] border-[#006B32] p-1">
                                        <img
                                            src={user.profile_photo_url ?? '/images/avatar.png'}
                                            alt={user.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    <button type="button" className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#FF8928] text-white shadow-sm hover:bg-[#e07720]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
                                        </svg>
                                    </button>
                                </div>
                                <h2 className="text-[22px] font-bold text-[#1B1C1C]">{user.name}</h2>

                                <div className="my-6 w-full border-t border-[#DDE6DF]"></div>

                                <div className="w-full space-y-4 px-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-[#4B5563]">Member Sejak</span>
                                        <span className="font-bold text-[#1B1C1C]">{memberSince}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-[#4B5563]">Kursus Selesai</span>
                                        <span className="font-bold text-[#1B1C1C]">{completedCourses} Materi</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Form Informasi Pribadi (Kanan) */}
                        <section className="h-full flex flex-col rounded-xl border border-[#DDE6DF] bg-white shadow-sm">
                            <div className="border-b border-[#DDE6DF] bg-[#F8F9F7] px-6 py-4 flex items-center gap-2 rounded-t-xl">
                                <span className="inline-flex h-6 w-6 items-center justify-center text-[#006B32]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <h3 className="text-base font-bold text-[#006B32]">Informasi Pribadi</h3>
                            </div>
                            <div className="p-6 flex-grow">
                                <UpdateProfileInformationForm ref={profileFormRef} mustVerifyEmail={mustVerifyEmail} status={status} />
                            </div>
                        </section>
                    </div>

                    {/* Bagian Bawah: Ubah Kata Sandi (Full Width) */}
                    <section className="rounded-xl border border-[#DDE6DF] bg-white shadow-sm">
                        <div className="border-b border-[#DDE6DF] bg-[#F8F9F7] px-6 py-4 flex items-center gap-2 rounded-t-xl">
                            <span className="inline-flex h-6 w-6 items-center justify-center text-[#006B32]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <h3 className="text-base font-bold text-[#006B32]">Ubah Kata Sandi</h3>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm ref={passwordFormRef} className="" />
                        </div>
                    </section>

                    {/* Footer: Tombol Aksi */}
                    <div className="flex justify-between items-center py-4 mt-6">
                        <button className="px-10 py-3 rounded-lg border-2 border-[#006B32] text-[#006B32] font-bold hover:bg-[#f0f7f2] transition">
                            Batalkan
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAll}
                            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#FF8928] text-white font-bold shadow hover:bg-[#e07720] transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                            </svg>
                            Simpan Perubahan
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}