import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import InstansiLayout from '@/Layouts/InstansiLayout';

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function toYmd(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function PilihJadwalHybridInstansi({
    course = { id: null, title: '', price: 0 },
    defaultDate = null,
    defaultLocation = 'Lokasi akan dikonfirmasi',
    eventTime = 'Jadwal akan dikonfirmasi',
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const initial = defaultDate ? new Date(defaultDate) : today;

    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    // Rentang tanggal terpilih
    const [startDate, setStartDate] = useState(defaultDate ? new Date(defaultDate) : null);
    const [endDate, setEndDate] = useState(null);

    const [lokasi, setLokasi] = useState('');
    const [jam, setJam] = useState('08:00');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Durasi (hari) dari rentang terpilih
    const durasiHari = startDate
        ? (endDate ? Math.round((endDate - startDate) / 86400000) + 1 : 1)
        : 0;

    // Susun sel-sel kalender untuk bulan yang sedang ditampilkan
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [
        ...Array.from({ length: firstWeekday }, () => null),
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

    function sameDay(a, b) {
        return a && b && a.toDateString() === b.toDateString();
    }

    const handleDayClick = (date) => {
        if (date < today) return;
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
        if (date < today) return 'text-[#C7CAC8] cursor-not-allowed';
        if (sameDay(date, startDate) || sameDay(date, endDate)) return 'bg-[#006B32] font-bold text-white';
        if (startDate && endDate && date > startDate && date < endDate) return 'bg-[#E5F0E9] text-[#006B32]';
        return 'text-[#1B1C1C] hover:bg-[#F0EDED]';
    };

    const rangeLabel = startDate
        ? `${startDate.getDate()} ${monthShort[startDate.getMonth()]}${endDate ? ` — ${endDate.getDate()} ${monthShort[endDate.getMonth()]}` : ''}, ${(endDate ?? startDate).getFullYear()}`
        : 'Belum dipilih';

    const konfirmasiJadwal = async () => {
        if (!startDate) return;
        if (!lokasi.trim()) {
            setErrors({ usulan_lokasi: ['Usulan lokasi wajib diisi.'] });
            return;
        }
        setSubmitting(true);
        setErrors({});

        try {
            const { data } = await axios.post('/instansi/request-jadwal-hybrid', {
                course_id: course.id,
                tanggal_mulai: toYmd(startDate),
                tanggal_selesai: toYmd(endDate ?? startDate),
                usulan_lokasi: lokasi,
                jam: jam || null,
            });

            if (data.success && data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        } catch (err) {
            setSubmitting(false);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Terjadi kesalahan sistem.');
            }
        }
    };

    return (
        <InstansiLayout showSidebar={false} title="Pilih Jadwal Hybrid - Pensiun Mudah" activeNav="dashboard">
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href={`/instansi/modul/${course.slug}`}
                        className="inline-flex items-center gap-2 font-bold text-[#006B32]"
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
                                d="M19 12H5M11 6l-6 6 6 6"
                            />
                        </svg>
                        Kembali ke Detail Modul
                    </Link>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Calendar card */}
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="max-w-[12rem] text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                                    Pilih Rentang Tanggal
                                </h1>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={goPrevMonth}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32]/40 text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan sebelumnya"
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
                                                d="M15 6l-6 6 6 6"
                                            />
                                        </svg>
                                    </button>
                                    <span className="text-lg font-bold text-[#1B1C1C] w-36 text-center">
                                        {monthNames[viewMonth]} {viewYear}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={goNextMonth}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32]/40 text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan berikutnya"
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
                                                d="M9 6l6 6-6 6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-7 gap-2 text-center">
                                {weekdays.map((weekday) => (
                                    <div
                                        key={weekday}
                                        className="pb-2 text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]/60"
                                    >
                                        {weekday}
                                    </div>
                                ))}
                                {cells.map((date, index) => {
                                    if (!date) {
                                        return <div key={index} className="py-3 text-sm text-[#9AA6A0]" />;
                                    }
                                    const isBeforeToday = date < today;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDayClick(date)}
                                            disabled={isBeforeToday}
                                            className={`rounded-lg py-3 text-sm transition-colors w-full text-center ${dayClass(date)}`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            <hr className="my-8 border-[#E4E2E1]" />

                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-[#006B32]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                                    />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                <h2 className="font-bold text-[#1B1C1C]">
                                    Tuliskan Usulan Lokasi <span className="text-red-500 font-normal">*</span>
                                </h2>
                            </div>
                            <input
                                type="text"
                                value={lokasi}
                                onChange={(e) => setLokasi(e.target.value)}
                                placeholder="Masukkan alamat atau nama lokasi yang diusulkan..."
                                className="mt-3 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                            />
                            {errors.usulan_lokasi && (
                                <p className="mt-2 text-sm font-semibold text-red-500">{errors.usulan_lokasi[0]}</p>
                            )}
                            <p className="mt-2 text-xs text-[#6B7280]">
                                Lokasi ini akan digunakan sebagai titik temu utama untuk sesi tatap muka praktik.
                            </p>

                            <div className="mt-6 flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-[#006B32]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                                </svg>
                                <h2 className="font-bold text-[#1B1C1C]">
                                    Tuliskan Usulan Jam Mulai <span className="text-red-500 font-normal">*</span>
                                </h2>
                            </div>
                            <input
                                type="time"
                                value={jam}
                                onChange={(e) => setJam(e.target.value)}
                                className="mt-3 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                            />
                            {errors.jam && (
                                <p className="mt-2 text-sm font-semibold text-red-500">{errors.jam[0]}</p>
                            )}
                        </div>

                        {/* Summary card */}
                        <div className="h-fit rounded-2xl border border-[#E4E2E1] bg-[#F0EDED] p-6">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-[#006B32]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="17"
                                        rx="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 9h18M8 2v4M16 2v4"
                                    />
                                </svg>
                                <h2 className="font-bold text-[#1B1C1C]">
                                    Ringkasan Jadwal
                                </h2>
                            </div>

                            <dl className="mt-6 space-y-4">
                                <div className="flex items-start justify-between gap-4 border-b border-[#E4E2E1] pb-4">
                                    <dt className="text-sm text-[#3D4A3E]">
                                        Kelas
                                    </dt>
                                    <dd className="text-right text-sm font-bold text-[#1B1C1C]">
                                        {course.title}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4 border-b border-[#E4E2E1] pb-4">
                                    <dt className="text-sm text-[#3D4A3E]">
                                        Tanggal
                                    </dt>
                                    <dd className="text-right text-sm font-bold text-[#1B1C1C]">
                                        {rangeLabel}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4 border-b border-[#E4E2E1] pb-4">
                                    <dt className="text-sm text-[#3D4A3E]">
                                        Waktu
                                    </dt>
                                    <dd className="text-right text-sm font-bold text-[#1B1C1C]">
                                        {jam ? `${jam} WIB` : 'Pagi (08:00 - 12:00 WIB)'}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4 border-b border-[#E4E2E1] pb-4 last:border-b-0">
                                    <dt className="text-sm text-[#3D4A3E]">
                                        Usulan Lokasi
                                    </dt>
                                    <dd className="text-right text-sm font-bold text-[#1B1C1C]">
                                        {lokasi.trim() || defaultLocation}
                                    </dd>
                                </div>
                            </dl>

                            <button
                                type="button"
                                onClick={konfirmasiJadwal}
                                disabled={!startDate || submitting}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? 'Memproses...' : 'Konfirmasi Jadwal'}
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12l3 3 5-6"
                                    />
                                </svg>
                            </button>
                            <p className="mt-3 text-center text-xs text-[#6B7280]">
                                Konfirmasi ini akan mengirimkan notifikasi usulan jadwal praktik ke administrator untuk ditinjau.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}
