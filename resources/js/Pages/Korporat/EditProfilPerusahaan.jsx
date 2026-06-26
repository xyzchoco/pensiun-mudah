import { Link, usePage, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const categoryOptions = [
    'Teknologi & Informasi',
    'Keuangan & Perbankan',
    'Kesehatan',
    'Pendidikan',
    'Manufaktur',
    'Lainnya',
];

export default function EditProfilPerusahaan({ profile = {} }) {
    const { auth } = usePage().props;
    const corporateProfile = profile || auth.user.corporate_profile || {};

    // 1. INISIALISASI useForm INERTIA
    const { data, setData, post, processing, errors } = useForm({
        // Kita pakai _method PUT karena kita mau update data dan kirim file gambar
        _method: 'PUT',
        nama_perusahaan: corporateProfile.nama_perusahaan || '',
        kategori_bisnis: corporateProfile.kategori_bisnis || categoryOptions[0],
        website: corporateProfile.website || '',
        email_bisnis: corporateProfile.email_bisnis || '',
        no_telepon: corporateProfile.no_telepon || '',
        alamat_kantor: corporateProfile.alamat_kantor || '',
        logo: null, // Untuk nampung file gambar baru
    });

    // 2. STATE UNTUK PREVIEW GAMBAR
    const [previewLogo, setPreviewLogo] = useState(
        corporateProfile.logo_path ? `/storage/${corporateProfile.logo_path}` : null
    );
    const fileInputRef = useRef(null);

    // 3. FUNGSI HANDLE UPLOAD GAMBAR
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setPreviewLogo(URL.createObjectURL(file)); // Bikin preview instan
        }
    };

    // 4. FUNGSI SUBMIT KE BACKEND
    const handleSubmit = (e) => {
        e.preventDefault();

        // Tembak ke route laravel
        post('/korporat/profil-perusahaan/update', {
            preserveScroll: true,
        });
    };

    return (
        <KorporatLayout title="Edit Profil Perusahaan" activeNav="profil">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10">
                <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#3D4A3E]">
                    <span>Pengaturan</span>
                    <span className="text-[#9AA6A0]">&rsaquo;</span>
                    <span>Profil Perusahaan</span>
                    <span className="text-[#9AA6A0]">&rsaquo;</span>
                    <span className="text-[#006B32]">Edit</span>
                </nav>

                <h1 className="mt-3 text-3xl font-bold text-[#1B1C1C]">Edit Profil Perusahaan</h1>
                <p className="mt-2 text-[#3D4A3E]">Perbarui informasi entitas bisnis Anda untuk keperluan administrasi dan laporan.</p>

                {/* BUNGKUS DENGAN FORM */}
                <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">

                    {/* BAGIAN UPLOAD LOGO */}
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <div className="relative shrink-0 overflow-hidden rounded-full h-24 w-24 border-2 border-[#E4E2E1]">
                            {previewLogo ? (
                                <img src={previewLogo} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#0E3A2E] text-white">
                                    <span className="text-xl font-bold">PT</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-[#1B1C1C]">Logo Perusahaan</h2>
                            <p className="mt-1 text-sm text-[#3D4A3E]">Gunakan logo dengan format PNG atau JPG, maksimal 2MB.</p>

                            {/* Input File Tersembunyi */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()} // Trigger input file
                                className="mt-3 rounded-lg border border-[#006B32] px-5 py-2.5 font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                            >
                                Ubah Foto
                            </button>
                            {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                        </div>
                    </div>

                    <hr className="my-8 border-[#E4E2E1]" />

                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* NAMA PERUSAHAAN */}
                        <div>
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="nama">Nama Perusahaan</label>
                            <input
                                id="nama"
                                type="text"
                                value={data.nama_perusahaan}
                                onChange={(e) => setData('nama_perusahaan', e.target.value)}
                                className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:ring-2 ${errors.nama_perusahaan ? 'border-red-500 focus:ring-red-500/20' : 'border-[#E4E2E1] focus:border-[#006B32] focus:ring-[#006B32]/20'}`}
                            />
                            {errors.nama_perusahaan && <p className="mt-1 text-xs text-red-500">{errors.nama_perusahaan}</p>}
                        </div>

                        {/* KATEGORI BISNIS */}
                        <div>
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="kategori">Kategori Bisnis</label>
                            <div className="relative mt-2">
                                <select
                                    id="kategori"
                                    value={data.kategori_bisnis}
                                    onChange={(e) => setData('kategori_bisnis', e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 pr-10 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                                >
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {/* Ikon Panah Bawah */}
                                <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3D4A3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4 4 4-4" /></svg>
                            </div>
                            {errors.kategori_bisnis && <p className="mt-1 text-xs text-red-500">{errors.kategori_bisnis}</p>}
                        </div>

                        {/* WEBSITE */}
                        <div>
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="website">Website Perusahaan</label>
                            <input
                                id="website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                            {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                        </div>

                        {/* EMAIL BISNIS */}
                        <div>
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="email">Email Bisnis</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email_bisnis}
                                onChange={(e) => setData('email_bisnis', e.target.value)}
                                className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:ring-2 ${errors.email_bisnis ? 'border-red-500' : 'border-[#E4E2E1] focus:border-[#006B32] focus:ring-[#006B32]/20'}`}
                            />
                            {errors.email_bisnis && <p className="mt-1 text-xs text-red-500">{errors.email_bisnis}</p>}
                        </div>

                        {/* TELEPON */}
                        <div>
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="telepon">Nomor Telepon</label>
                            <input
                                id="telepon"
                                type="tel"
                                value={data.no_telepon}
                                onChange={(e) => setData('no_telepon', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                            {errors.no_telepon && <p className="mt-1 text-xs text-red-500">{errors.no_telepon}</p>}
                        </div>

                        {/* ALAMAT */}
                        <div className="sm:col-span-2">
                            <label className="text-sm font-bold text-[#1B1C1C]" htmlFor="alamat">Alamat Kantor Pusat</label>
                            <textarea
                                id="alamat"
                                rows={4}
                                value={data.alamat_kantor}
                                onChange={(e) => setData('alamat_kantor', e.target.value)}
                                className="mt-2 w-full resize-none rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                            {errors.alamat_kantor && <p className="mt-1 text-xs text-red-500">{errors.alamat_kantor}</p>}
                        </div>
                    </div>

                    <hr className="my-8 border-[#E4E2E1]" />

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/korporat/profil-perusahaan"
                            className="rounded-lg border border-[#006B32] px-6 py-3 text-center font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing} // Disable tombol saat loading
                            className={`rounded-lg px-6 py-3 font-bold text-white transition-colors ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8928] hover:bg-[#F57F1E]'}`}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </KorporatLayout>
    );
}