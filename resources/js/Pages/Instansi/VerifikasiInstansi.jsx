import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

function BrandLogo() {
    return (
        <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B32] text-sm font-extrabold text-white">
                PM
            </span>
            <span className="font-['Atkinson_Hyperlegible'] text-lg font-extrabold">
                <span className="text-[#006B32]">PENSIUN</span>
                <span className="text-[#FF8928]">MUDAH</span>
            </span>
        </Link>
    );
}

export default function VerifikasiInstansi() {
    const [form, setForm] = useState({
        namaPerusahaan: '',
        jabatan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/instansi/verifikasi', form);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Verifikasi Akun Instansi - Pensiun Mudah" />
            <header className="border-b border-[#E4E2E1]/60 bg-white px-4 py-4 sm:px-8">
                <BrandLogo />
            </header>

            <main className="flex flex-1 justify-center px-4 py-10">
                <div className="w-full max-w-2xl rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-10">
                    <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Verifikasi Akun Instansi
                    </h1>
                    <p className="mt-3 text-[#3D4A3E]">
                        Lengkapi data dasar perusahaan Anda untuk mengaktifkan
                        akses ke fitur korporat. Data lainnya dapat Anda
                        lengkapi nanti melalui menu Profil Perusahaan.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block font-bold text-[#1B1C1C]">
                                Nama Perusahaan
                            </label>
                            <input
                                type="text"
                                value={form.namaPerusahaan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        namaPerusahaan: e.target.value,
                                    })
                                }
                                placeholder="Masukkan nama perusahaan Anda"
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-[#FBF9F8] px-4 py-3 text-[#1B1C1C] outline-none placeholder:text-[#9AA6A0] focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-[#1B1C1C]">
                                Jabatan
                            </label>
                            <input
                                type="text"
                                value={form.jabatan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        jabatan: e.target.value,
                                    })
                                }
                                placeholder="Masukkan jabatan Anda di perusahaan"
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-[#FBF9F8] px-4 py-3 text-[#1B1C1C] outline-none placeholder:text-[#9AA6A0] focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <button
                                type="submit"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                            >
                                Simpan & Lanjutkan
                            </button>
                            <Link
                                href="/onboarding/pilih-kategori"
                                className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#006B32] px-6 py-3.5 font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                            >
                                Kembali
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
