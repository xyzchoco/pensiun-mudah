import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function DetailKelasOffline({ course = {}, downloadHref = null }) {
    const {
        title = 'Kelas Offline',
        instruktur = 'Akan dikonfirmasi',
        perusahaan = 'Akan dikonfirmasi',   // ⬅️ PT yang beli course
        tanggal = 'Akan dikonfirmasi',
        jadwal = 'Akan dikonfirmasi',
        tempat = 'Akan dikonfirmasi',
        durasi = 'Akan dikonfirmasi',
    } = course;

    // Unduh PDF dari backend
    const handleUnduh = () => {
        if (downloadHref) {
            window.location.href = downloadHref;
        } else {
            // Hide sidebar saat print, kemudian restore
            document.body.classList.add('print-mode');
            window.print();
            // Restore setelah print dialog ditutup
            setTimeout(() => {
                document.body.classList.remove('print-mode');
            }, 500);
        }
    };

    // Tambah CSS untuk hide sidebar saat print
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                /* Hide sidebar */
                [data-testid="sidebar"],
                nav,
                aside,
                .sidebar {
                    display: none !important;
                }
                
                /* Hide navigation elements */
                header {
                    display: none !important;
                }
                
                /* Adjust main content to full width */
                body,
                main,
                .container {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                /* Hide buttons except print-visible ones */
                button[onclick*="print"],
                .print-button {
                    display: block !important;
                }
                
                /* Clean up margins and padding for print */
                .mx-auto,
                .px-4,
                .py-10 {
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <DashboardLayout title="Bukti Pendaftaran" showSearch={false}>
            <Head title={`Bukti Pendaftaran - ${title}`} />

            <div className="mx-auto max-w-3xl px-4 py-10">
                {/* ===== Success Hero ===== */}
                <div className="flex flex-col items-center text-center">
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#006B32] shadow-[0px_10px_15px_-3px_rgba(0,107,50,0.2)]">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl">
                        Selamat! Anda Berhasil Bergabung
                    </h1>
                </div>

                {/* ===== Instruksi ===== */}
                <div className="mt-8 flex items-start gap-4 rounded-xl border-2 border-[#964900] bg-[#F6F3F2] p-4">
                    <svg className="h-6 w-6 shrink-0 text-[#964900]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11 12h1v4h1" />
                    </svg>
                    <p className="text-sm text-[#1B1C1C]">
                        Wajib diunduh atau tangkapan layar (screenshot) sebagai bukti saat menghadiri kelas offline.
                    </p>
                </div>

                {/* ===== Kartu Bukti Pendaftaran (Ticket) ===== */}
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#BCCABB] bg-white shadow-sm">
                    <div className="p-8">
                        {/* Header kartu */}
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-base text-[#006B32]">Bukti Pendaftaran</span>
                            <span className="text-sm font-extrabold text-[#006B32] opacity-60">PENSIUN MUDAH</span>
                        </div>

                        {/* Isi kartu: 2 kolom */}
                        <div className="mt-8 grid gap-8 sm:grid-cols-2">
                            {/* Kolom kiri */}
                            <div className="space-y-4">
                                <Field label="Judul Pelatihan" value={title} />
                                <Field label="Pemateri" value={instruktur} />
                                <Field label="Nama Perusahaan" value={perusahaan} />
                            </div>

                            {/* Kolom kanan (dengan ikon) */}
                            <div className="space-y-4">
                                <IconField icon="📅" label="Tanggal Pelaksanaan" value={tanggal} />
                                <IconField icon="🕐" label="Jam Pelaksanaan" value={jadwal} />
                                <IconField icon="📍" label="Lokasi" value={tempat} />
                                <IconField icon="⏱️" label="Durasi" value={durasi + " Hari"} />
                            </div>
                        </div>

                        {/* Separator putus-putus */}
                        <div className="mt-8 border-t-2 border-dashed border-[#BCCABB]" />
                    </div>

                    {/* Cutout efek tiket (kiri & kanan) */}
                    <span className="absolute -left-4 bottom-[92px] h-8 w-8 rounded-full border border-[#BCCABB] bg-[#FBF9F8]" />
                    <span className="absolute -right-4 bottom-[92px] h-8 w-8 rounded-full border border-[#BCCABB] bg-[#FBF9F8]" />
                </div>

                {/* ===== Tombol Aksi ===== */}
                <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
                    <button
                        type="button"
                        onClick={handleUnduh}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-3.5 font-bold text-[#642F00] shadow-sm transition-colors hover:bg-[#F57F1E]"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        Unduh Bukti Pendaftaran (PDF)
                    </button>

                    <Link
                        href={route('dashboard')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#006B32] py-3.5 font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}

/* Field teks biasa (kolom kiri) */
function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]">{label}</p>
            <p className="mt-1 text-[#1B1C1C]">{value}</p>
        </div>
    );
}

/* Field dengan ikon (kolom kanan) */
function IconField({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-lg leading-none text-[#006B32]">{icon}</span>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]">{label}</p>
                <p className="mt-1 text-[#1B1C1C]">{value}</p>
            </div>
        </div>
    );
}