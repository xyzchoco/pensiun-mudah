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

export default function VerifikasiKorporat() {
    const [form, setForm] = useState({ namaPerusahaan: '', jabatan: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/korporat/verifikasi', form);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Verifikasi Akun Korporat - Pensiun Mudah" />
            <header className="border-b border-[#E4E2E1]/60 bg-white px-4 py-4 sm:px-8">
                <BrandLogo />
            </header>

            <main className="flex flex-1 justify-center px-4 py-10">
                <div className="w-full max-w-2xl rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-10">
                    <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Verifikasi Akun Korporat
                    </h1>
                    <p className="mt-3 text-[#3D4A3E]">
                        Untuk mengakses fitur khusus HRD dan manfaat korporat,
                        silakan unggah bukti identitas kerja Anda. Kami akan
                        meninjau dokumen Anda dalam waktu maksimal 24 jam kerja.
                    </p>

                    <div className="mt-6 flex gap-3 rounded-lg border-l-4 border-[#006B32] bg-[#F6F3F2] p-4">
                        <svg
                            className="h-5 w-5 shrink-0 text-[#006B32]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4"
                            />
                        </svg>
                        <div>
                            <p className="font-bold text-[#1B1C1C]">
                                Data Anda Aman
                            </p>
                            <p className="mt-1 text-sm text-[#3D4A3E]">
                                Dokumen hanya digunakan untuk proses verifikasi
                                identitas dan tidak akan disebarluaskan sesuai
                                kebijakan privasi kami.
                            </p>
                        </div>
                    </div>

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
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <button
                                type="submit"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12l14-7-7 14-2-5-5-2z"
                                    />
                                </svg>
                                Daftar
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
