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
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1B1C1C]">Pengaturan Profil</h1>
                        <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                            Kelola informasi pribadi Anda untuk mendapatkan pengalaman belajar yang dipersonalisasi sesuai dengan kebutuhan masa pensiun Anda.
                        </p>
                    </div>
                    
                    {/* Bagian Atas: Sidebar (Kiri) dan Informasi Pribadi (Kanan) */}
                    <div className="grid grid-cols-[320px_minmax(520px,720px)] gap-6 items-stretch">
                        
                        {/* Sidebar Profil */}
                        <aside className="h-full rounded-[24px] border border-[#D9E6D5] bg-white p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="relative inline-flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#1E6A32] bg-[#F5F9F6]">
                                        <img
                                            src={user.profile_photo_url ?? '/images/avatar.png'}
                                            alt={user.name}
                                            className="h-32 w-32 rounded-full object-cover"
                                        />
                                    </div>
                                    <button type="button" className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-[#FF8928] text-white shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H4z" />
                                            <path d="M8 7a1 1 0 011-1h2a1 1 0 011 1v3h2.5a.5.5 0 01.5.5V14a1 1 0 01-1 1H5.5a.5.5 0 01-.5-.5V10.5a.5.5 0 01.5-.5H8V7z" />
                                        </svg>
                                    </button>
                                </div>
                                <h2 className="text-xl font-semibold text-[#1B1C1C]">{user.name}</h2>
                                <span className="mt-3 inline-flex rounded-full bg-[#FF8928] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                                    Premium Member
                                </span>

                                <div className="mt-4 grid gap-3 w-full text-left text-sm">
                                    <div className="rounded-2xl border border-[#D9E6D5] px-4 py-3">
                                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#6B7280]">Member Sejak</p>
                                        <p className="mt-1 font-semibold text-[#1B1C1C]">{memberSince}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#D9E6D5] px-4 py-3">
                                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#6B7280]">Kursus Selesai</p>
                                        <p className="mt-1 font-semibold text-[#1B1C1C]">{completedCourses} Materi</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Form Informasi Pribadi (Kanan) */}
                        <section className="h-full flex flex-col rounded-[24px] border border-[#D9E6D5] bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-[#D9E6D5] bg-[#F4FBF0] px-8 py-5 flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#0F6B31]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.243 3.26a1 1 0 00-1.486.872v1.12a1 1 0 001 1h1.486a1 1 0 001-1V4.132a1 1 0 00-1.486-.872L9.243 3.26z" />
                                        <path fillRule="evenodd" d="M3 8.5A4.5 4.5 0 017.5 4h5A4.5 4.5 0 0117 8.5v6A4.5 4.5 0 0112.5 19h-5A4.5 4.5 0 013 14.5v-6zm4.5-2.5a2.5 2.5 0 00-2.45 2h9.9a2.5 2.5 0 00-2.45-2h-5z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold text-[#1B1C1C]">Informasi Pribadi</h3>
                                </div>
                            </div>
                            <div className="p-6 flex-grow">
                                <UpdateProfileInformationForm ref={profileFormRef} mustVerifyEmail={mustVerifyEmail} status={status} />
                            </div>
                        </section>
                    </div>

                    {/* Bagian Bawah: Ubah Kata Sandi (Full Width) */}
                    <section className="rounded-[24px] border border-[#D9E6D5] bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-[#D9E6D5] bg-[#F4FBF0] px-6 py-4 flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#0F6B31]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M13 7V6a3 3 0 10-6 0v1H5a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-2zm-6 0V6a1 1 0 112 0v1H7zm3 4a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <h3 className="text-lg font-semibold text-[#1B1C1C]">Ubah Kata Sandi</h3>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm ref={passwordFormRef} className="" />
                        </div>
                    </section>

                    {/* Footer: Tombol Aksi */}
                    <div className="flex justify-between items-center py-4">
                        
                        {/* Tombol Keluar diubah menjadi komponen Link dari Inertia */}
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="text-[#EF4444] font-semibold border-2 border-[#EF4444] px-8 py-2.5 rounded-xl hover:bg-red-50 transition"
                        >
                            Keluar
                        </Link>
                        
                        <div className="flex gap-4">
                            <button className="px-8 py-2.5 rounded-xl border border-[#0F6B31] text-[#0F6B31] font-semibold hover:bg-green-50 transition">
                                Batalkan
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAll}
                                className="px-8 py-2.5 rounded-xl bg-[#FF8928] text-white font-semibold shadow-md hover:bg-[#e07720] transition"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}