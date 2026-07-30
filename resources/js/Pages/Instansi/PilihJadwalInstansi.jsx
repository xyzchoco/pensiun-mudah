import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';
import axios from 'axios';

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Format Date -> "YYYY-MM-DD" pakai waktu LOKAL (jangan toISOString, itu geser ke UTC)
function toYmd(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function sameDay(a, b) {
    return a && b && a.toDateString() === b.toDateString();
}

function formatRupiah(value) {
    const amount = Number(value) || 0;
    if (amount <= 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
}

export default function PilihJadwalInstansi({
    course = { id: null, title: '', price: 0 },
    defaultDate = null,          // tanggal mulai default kursus (patokan deteksi custom)
    defaultEndDate = null,       // tanggal selesai default kursus (rentang multi-hari)
    defaultLocation = 'Lokasi akan dikonfirmasi',
    eventTime = 'Jadwal akan dikonfirmasi',
    quantity = 1,
    backHref = '/instansi/beli-pelatihan',
    submitUrl = '/instansi/request-jadwal',
    midtransClientKey,
    pendingRequest = null, // { id, status, statusUrl, snapTokenUrl }
    isEventPassed = false,
    eventStartAt = null, // ISO string for UI reference
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // User boleh beli lagi kalau request sebelumnya sudah lunas/selesai/ditolak/kadaluarsa
    // Jadi, hanya kunci jika ada request dengan status 'menunggu_approval' atau 'menunggu_bayar'
    const isLocked = (pendingRequest && (pendingRequest.status === 'menunggu_approval' || pendingRequest.status === 'menunggu_bayar')) || isEventPassed;

    // Titik awal tampilan kalender: dari tanggal default kursus, atau bulan ini
    const initial = defaultDate ? new Date(defaultDate) : today;

    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    // Rentang tanggal terpilih
    const [startDate, setStartDate] = useState(defaultDate ? new Date(defaultDate) : null);
    const [endDate, setEndDate] = useState(defaultEndDate ? new Date(defaultEndDate) : null);

    const [peserta, setPeserta] = useState(
        pendingRequest?.jumlah_peserta ?? Math.max(1, Number(quantity) || 1)
    );
    const [lokasi, setLokasi] = useState('');
    const [jamMulai, setJamMulai] = useState('');
    const [jamSelesai, setJamSelesai] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Load Midtrans Snap
    useEffect(() => {
        if (!midtransClientKey) return;
        if (!document.querySelector('script[src="https://app.sandbox.midtrans.com/snap/snap.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', midtransClientKey);
            script.async = true;
            document.body.appendChild(script);
        }
    }, [midtransClientKey]);

    // Durasi (hari) dari rentang terpilih
    const durasiHari = startDate
        ? (endDate ? Math.round((endDate - startDate) / 86400000) + 1 : 1)
        : 0;

    const totalBiaya = (Number(course.price) || 0) * peserta;

    const isPending = pendingRequest &&
        (pendingRequest.status === 'menunggu_bayar' || pendingRequest.status === 'menunggu_approval');
    const displayTotal = isPending ? pendingRequest.total : totalBiaya;

    // Deteksi custom (mirror logika backend) -> cuma buat kasih hint ke user
    const willNeedApproval =
        lokasi.trim() !== '' ||
        jamMulai !== '' ||
        jamSelesai !== '' ||
        (defaultDate && startDate && toYmd(startDate) !== toYmd(new Date(defaultDate))) ||
        (defaultEndDate && endDate && toYmd(endDate) !== toYmd(new Date(defaultEndDate))) ||
        (!defaultEndDate && defaultDate && endDate && toYmd(endDate) !== toYmd(new Date(defaultDate)));

    // Susun sel-sel kalender untuk bulan yang sedang ditampilkan
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [
        ...Array.from({ length: firstWeekday }, () => null), // sel kosong sebelum tgl 1
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
    ];

    const goPrevMonth = () => {
        const m = viewMonth - 1;
        if (m < 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth(m);
    };
    const goNextMonth = () => {
        const m = viewMonth + 1;
        if (m > 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth(m);
    };

    // Klik tanggal: klik-1 set awal, klik-2 set akhir, klik-3 reset ulang
    const handleDayClick = (date) => {
        if (isLocked || date < today) return; // tanggal lampau atau terkunci tidak bisa dipilih
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (date < startDate) {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const dayClass = (date) => {
        if (isLocked || date < today) return 'text-[#C7CAC8] cursor-not-allowed';
        if (sameDay(date, startDate) || sameDay(date, endDate)) return 'bg-[#006B32] font-bold text-white';
        if (startDate && endDate && date > startDate && date < endDate) return 'bg-[#E5F0E9] text-[#006B32]';
        return 'text-[#1B1C1C] hover:bg-[#F0EDED]';
    };

    const rangeLabel = startDate
        ? `${startDate.getDate()} ${monthShort[startDate.getMonth()]}${endDate ? ` — ${endDate.getDate()} ${monthShort[endDate.getMonth()]}` : ''}, ${(endDate ?? startDate).getFullYear()}`
        : 'Belum dipilih';

    // Kirim ke backend (store) -> backend yang mutusin jalur A / B
    const konfirmasiJadwal = async () => {
        if (isLocked) return; // Guard tambahan: jangan kirim request kalau terkunci
        if (!startDate) return; // wajib pilih tanggal dulu
        setSubmitting(true);
        setErrors({});

        try {
            const { data } = await axios.post(submitUrl, {
                course_id: course.id,
                tanggal_mulai: toYmd(startDate),
                tanggal_selesai: toYmd(endDate ?? startDate), // 1 hari kalau cuma pilih 1 tanggal
                jumlah_peserta: peserta,
                usulan_lokasi: lokasi,
                jam_mulai: jamMulai || null,
                jam_selesai: jamSelesai || null,
            });

            if (data.is_custom) {
                // JALUR B → pindah ke halaman "sedang ditinjau"
                router.visit(data.redirect_url);
                return;
            }

            // JALUR A → popup Midtrans langsung
            if (window.snap && data.snap_token) {
                window.snap.pay(data.snap_token, {
                    onSuccess: async () => {
                        // finalize lalu redirect ke halaman pembayaran berhasil
                        const { data: finalizeData } = await axios.post(route('instansi.pembayaran.finalize', data.request_id));
                        router.visit(finalizeData.redirect);
                    },
                    onPending: () => {
                        // Jika statusnya MENUNGGU_BAYAR, arahkan ke halaman status
                        // yang akan menampilkan tombol "Lanjutkan Pembayaran"
                        router.visit(route('instansi.request-ditinjau', data.request_id));
                    },
                    onError: () => {
                        alert('Pembayaran gagal atau terjadi kesalahan.');
                        setSubmitting(false);
                    },
                    onClose: () => {
                        console.log('Pop-up ditutup oleh user');
                        setSubmitting(false);
                    },
                });
            } else {
                alert('Midtrans Snap tidak dimuat atau token gagal didapat.');
                setSubmitting(false);
            }
        } catch (err) {
            setSubmitting(false);
            if (err.response?.status === 409) {
                router.visit(err.response.data.redirect_url);
                return;
            }
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Terjadi kesalahan sistem.');
            }
        }
    };

    // Handler baru untuk tombol "Lanjutkan Pembayaran"
    const handleLanjutBayar = async () => {
        if (!pendingRequest || pendingRequest.status !== 'menunggu_bayar') return;

        setSubmitting(true); // Set submitting state for the button
        setErrors({});

        try {
            // 1. Dapatkan snap token dari backend
            const snapTokenResponse = await axios.post(pendingRequest.snapTokenUrl);
            const { snap_token, request_id, finalize_url } = snapTokenResponse.data;

            if (window.snap && snap_token) {
                // 2. Buka Midtrans Snap popup
                window.snap.pay(snap_token, {
                    onSuccess: async () => {
                        // 3. Jika pembayaran sukses, panggil finalize endpoint
                        try {
                            const finalizeResponse = await axios.post(finalize_url);
                            router.visit(finalizeResponse.data.redirect); // Redirect ke halaman sukses
                        } catch (finalizeError) {
                            alert('Terjadi kesalahan saat finalisasi pembayaran.');
                            console.error('Finalisasi pembayaran error:', finalizeError);
                            setSubmitting(false); // Reset submitting state
                        }
                    },
                    onPending: () => {
                        // Jika status masih menunggu, arahkan ke halaman status
                        router.visit(route('instansi.request-ditinjau', request_id));
                    },
                    onError: () => {
                        alert('Pembayaran gagal atau terjadi kesalahan.');
                        setSubmitting(false); // Reset submitting state
                    },
                    onClose: () => {
                        console.log('Pop-up Midtrans ditutup oleh user');
                        setSubmitting(false); // Reset submitting state
                    },
                });
            } else {
                alert('Midtrans Snap tidak dimuat atau token gagal didapat.');
                setSubmitting(false);
            }
        } catch (err) {
            console.error('Error in handleLanjutBayar:', err);
            if (err.response?.status === 409) {
                // Jika ada request aktif lain, redirect ke sana
                router.visit(err.response.data.redirect_url);
            } else if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Terjadi kesalahan sistem saat melanjutkan pembayaran.');
            }
            setSubmitting(false); // Reset submitting state on error
        }
    };

    return (
        <InstansiLayout showSidebar={false} title="Pilih Jadwal - Pensiun Mudah" activeNav="dashboard">
            <Head title="Pilih Jadwal - Pensiun Mudah" />
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link href={backHref} className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Beli Kelas
                    </Link>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        {/* ===== Kalender ===== */}
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="max-w-[10rem] text-2xl font-bold leading-tight text-[#1B1C1C]">
                                    Pilih Rentang Tanggal
                                </h1>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={goPrevMonth} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#006B32] transition-colors hover:bg-[#F0EDED]" aria-label="Bulan sebelumnya">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="w-28 text-center font-bold leading-tight text-[#1B1C1C]">
                                        {monthNames[viewMonth]} {viewYear}
                                    </span>
                                    <button type="button" onClick={goNextMonth} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#006B32] transition-colors hover:bg-[#F0EDED]" aria-label="Bulan berikutnya">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                                {weekdays.map((w) => (
                                    <div key={w} className="py-2 text-xs font-bold text-[#9AA6A0]">{w}</div>
                                ))}
                                {cells.map((date, idx) => (
                                    <div key={idx} className="py-1">
                                        {date && (
                                            <button
                                                type="button"
                                                onClick={() => handleDayClick(date)}
                                                disabled={isLocked || date < today}
                                                className={`mx-auto flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors ${dayClass(date)}`}
                                            >
                                                {date.getDate()}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-[#1B1C1C]">Usulan Lokasi Offline <span className="font-normal text-[#6B7280]">(Opsional)</span></label>
                                    <input
                                        type="text"
                                        value={lokasi}
                                        onChange={(e) => setLokasi(e.target.value)}
                                        placeholder="Cth: Aula Kantor Dinas XYZ"
                                        disabled={isLocked}
                                        className="w-full rounded-lg border border-[#C7CAC8] px-3 py-2 text-sm focus:border-[#006B32] focus:ring-[#006B32] disabled:bg-[#F0EDED] disabled:text-[#9AA6A0] disabled:cursor-not-allowed"
                                    />
                                    {errors.usulan_lokasi && <p className="text-sm text-red-500">{errors.usulan_lokasi[0]}</p>}
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-[#1B1C1C]">Usulan Jam Mulai <span className="font-normal text-[#6B7280]">(Opsional)</span></label>
                                        <input
                                            type="time"
                                            value={jamMulai}
                                            onChange={(e) => setJamMulai(e.target.value)}
                                            disabled={isLocked}
                                            className="w-full rounded-lg border border-[#C7CAC8] px-3 py-2 text-sm focus:border-[#006B32] focus:ring-[#006B32] disabled:bg-[#F0EDED] disabled:text-[#9AA6A0] disabled:cursor-not-allowed"
                                        />
                                        {errors.jam_mulai && <p className="text-sm text-red-500">{errors.jam_mulai[0]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-[#1B1C1C]">Usulan Jam Selesai <span className="font-normal text-[#6B7280]">(Opsional)</span></label>
                                        <input
                                            type="time"
                                            value={jamSelesai}
                                            onChange={(e) => setJamSelesai(e.target.value)}
                                            disabled={isLocked}
                                            className="w-full rounded-lg border border-[#C7CAC8] px-3 py-2 text-sm focus:border-[#006B32] focus:ring-[#006B32] disabled:bg-[#F0EDED] disabled:text-[#9AA6A0] disabled:cursor-not-allowed"
                                        />
                                        {errors.jam_selesai && <p className="text-sm text-red-500">{errors.jam_selesai[0]}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-fit rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                            <h2 className="text-xl font-bold text-[#1B1C1C]">Ringkasan Jadwal</h2>
                            <p className="mt-2 text-sm font-semibold text-[#3D4A3E]">{course.title}</p>

                            <div className="mt-6 space-y-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45" />
                                            </svg>
                                        </span>
                                        <span className="text-sm font-semibold text-[#3D4A3E]">Jumlah Peserta</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => setPeserta((p) => (p > 1 ? p - 1 : 1))} disabled={isLocked} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#006B32] text-[#006B32] transition-colors hover:bg-[#006B32]/5 disabled:cursor-not-allowed disabled:opacity-60 disabled:border-[#C7CAC8] disabled:text-[#C7CAC8]" aria-label="Kurangi peserta">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                                        </button>
                                        <span className="w-6 text-center font-bold text-[#1B1C1C]">{peserta}</span>
                                        <button type="button" onClick={() => setPeserta((p) => p + 1)} disabled={isLocked} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#006B32] text-[#006B32] transition-colors hover:bg-[#006B32]/5 disabled:cursor-not-allowed disabled:opacity-60 disabled:border-[#C7CAC8] disabled:text-[#C7CAC8]" aria-label="Tambah peserta">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Durasi (dinamis dari rentang terpilih) */}
                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#006B32] text-white">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="3" y="5" width="18" height="16" rx="2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Durasi</p>
                                        <p className="font-bold text-[#1B1C1C]">{rangeLabel}</p>
                                        {durasiHari > 0 && (
                                            <p className="text-sm font-semibold text-[#006B32]">Sesi {durasiHari} Hari</p>
                                        )}
                                    </div>
                                </div>

                                {/* Lokasi (usulan user, atau default penyelenggara) */}
                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
                                            <circle cx="12" cy="11" r="2" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Lokasi Pelatihan</p>
                                        <p className="font-bold text-[#1B1C1C]">{lokasi.trim() || defaultLocation}</p>
                                    </div>
                                </div>

                                {/* Jadwal harian (dari data kursus) */}
                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="9" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Jadwal Harian</p>
                                        <p className="font-bold text-[#1B1C1C]">
                                            {jamMulai && jamSelesai ? `${jamMulai} - ${jamSelesai} WIB` : eventTime}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-[#E4E2E1] pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#3D4A3E]">Total Biaya</span>
                                    <span className="text-2xl font-extrabold text-[#006B32]">{formatRupiah(displayTotal)}</span>
                                </div>

                                {/* Hint: kasih tau user kalau pilihannya bakal butuh approval admin */}
                                {willNeedApproval && (
                                    <p className="mt-3 rounded-lg bg-[#FFF3E8] px-3 py-2 text-xs font-semibold text-[#B45309]">
                                        Karena kamu mengubah tanggal / lokasi, jadwal ini perlu persetujuan admin dulu sebelum pembayaran.
                                    </p>
                                )}

                                {pendingRequest && (pendingRequest.status === 'menunggu_approval' || pendingRequest.status === 'menunggu_bayar') ? (
                                    // Tombol "Lanjutkan Pembayaran" atau "Menunggu Persetujuan"
                                    <button
                                        onClick={pendingRequest.status === 'menunggu_bayar' ? handleLanjutBayar : () => router.visit(pendingRequest.statusUrl)}
                                        disabled={submitting}
                                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${pendingRequest.status === 'menunggu_bayar'
                                            ? 'bg-[#006B32] hover:bg-[#005A2B]'
                                            : 'bg-[#FF8928] hover:bg-[#F57F1E]'
                                            }`}
                                    >
                                        {pendingRequest.status === 'menunggu_bayar' ? (
                                            <>
                                                <span className="text-xl">💳</span> {submitting ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xl">🕐</span> Menunggu Persetujuan — Lihat Status
                                            </>
                                        )}
                                    </button>
                                ) : isEventPassed ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C7CAC8] py-3.5 font-bold text-white cursor-not-allowed"
                                    >
                                        Jadwal Kelas Sudah Berlalu
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={konfirmasiJadwal}
                                        disabled={!startDate || submitting}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="9" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
                                        </svg>
                                        {submitting ? 'Memproses...' : 'Konfirmasi Jadwal'}
                                    </button>
                                )}

                                {isEventPassed && (
                                    <p className="mt-3 text-center text-xs font-semibold text-red-500">
                                        Pendaftaran untuk jadwal ini sudah ditutup.
                                    </p>
                                )}

                                <p className="mt-3 text-center text-xs text-[#9AA6A0]">Pendaftaran aman melalui Pensiun Mudah</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}