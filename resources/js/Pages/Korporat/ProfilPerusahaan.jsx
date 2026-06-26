import { Link, usePage } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

export default function ProfilPerusahaan() {
    const { auth } = usePage().props;
    const profile = auth?.user?.corporate_profile || {};

    const companyFields = [
        { label: 'Nama Perusahaan', value: profile.nama_perusahaan || '-', highlight: true, span: 1 },
        { label: 'Kategori Bisnis', value: profile.kategori_bisnis || '-', highlight: false, span: 1 },
        { label: 'Email Bisnis', value: profile.email_bisnis || '-', highlight: false, link: true, span: 1 },
        { label: 'Alamat Kantor Pusat', value: profile.alamat_kantor || '-', highlight: true, span: 2 },
        { label: 'Nomor Telepon', value: profile.no_telepon || '-', highlight: false, span: 1 },
        { label: 'Email Perusahaan', value: profile.email_perusahaan || '-', highlight: false, span: 1 },
    ];

    return (
        <KorporatLayout
            title="Profil Perusahaan - Pensiun Mudah"
            activeNav="profil"
        >
            {/* Toast notifikasi sudah ditangani di KorporatLayout */}

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                    Profil Perusahaan
                </h1>

                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-[#1B1C1C]">
                                {profile.nama_perusahaan || 'Nama Perusahaan Belum Diset'}
                            </h2>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                                Jabatan: {profile.jabatan || '-'}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#E5F0E9] px-3 py-1 text-xs font-bold text-[#006B32]">
                                    PREMIUM MEMBER
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[#1B1C1C]">
                        <svg className="h-5 w-5 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5M12 8h.01" />
                        </svg>
                        Informasi Perusahaan
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {companyFields.map((field) => (
                            <div key={field.label} className={field.span === 2 ? 'lg:col-span-2' : ''}>
                                <label className={`block font-bold ${field.highlight ? 'text-[#006B32]' : 'text-[#1B1C1C]'}`}>
                                    {field.label}
                                </label>
                                <div className={`mt-2 rounded-lg border px-4 py-3 ${field.highlight ? 'border-[#006B32] bg-white' : 'border-[#E4E2E1] bg-[#FBF9F8]'}`}>
                                    <span className={field.link ? 'font-semibold text-[#006B32]' : field.highlight ? 'font-bold text-[#1B1C1C]' : 'text-[#3D4A3E]'}>
                                        {field.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-[#E4E2E1] pt-6 sm:flex-row">
                        <Link
                            href="/korporat/profil-perusahaan/edit"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Edit Profil Perusahaan
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#DC2626] px-6 py-3.5 font-bold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                        >
                            Keluar (Logout)
                        </Link>
                    </div>
                </div>
            </div>
        </KorporatLayout>
    );
}