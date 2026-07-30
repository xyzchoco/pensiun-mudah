import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LandingHeader from '@/Components/Landing/LandingHeader';
import Footer from '@/Components/Footer';

// ── Dekorasi fallback saat tidak ada gambar ──────────────────────────────────
const heroBars = [
    'h-[35%]', 'h-[55%]', 'h-[45%]', 'h-[70%]', 'h-[60%]',
    'h-[85%]', 'h-[72%]', 'h-[95%]', 'h-[80%]', 'h-[65%]',
];

// ── Format countdown (hari / jam / menit) ────────────────────────────────────
function formatCountdown(diffMs) {
    if (diffMs <= 0) return null;
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const mins = totalMinutes % 60;

    if (days > 0) return `${days} hari ${hours} jam`;
    if (hours > 0) return `${hours} jam ${mins} menit`;
    return `${mins} menit`;
}

// ── Ikon info-card ───────────────────────────────────────────────────────────
function InfoIcon({ name }) {
    if (name === 'calendar') {
        return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18" />
            </svg>
        );
    }
    if (name === 'clock') {
        return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
        );
    }
    if (name === 'pin') {
        return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
                <circle cx="12" cy="11" r="2" />
            </svg>
        );
    }
    // default: user
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
    );
}

// ── Komponen kartu Event Terkait ─────────────────────────────────────────────
function RelatedCard({ item }) {
    const tanggalLabel = item.tanggal
        ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
        : '';

    return (
        <div className="overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
            {/* thumbnail atau gradient fallback */}
            <div className="relative h-32 bg-gradient-to-br from-[#1B3326] to-[#0C1A12]">
                {item.image_url && (
                    <img
                        src={item.image_url}
                        alt={item.judul}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
                {tanggalLabel && (
                    <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-[#1B1C1C]">
                        {tanggalLabel}
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#006B32]">
                    {item.kategori}
                </p>
                <h3 className="mt-1 font-bold leading-snug text-[#1B1C1C] line-clamp-2">
                    {item.judul}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">{item.jenis_event}</span>
                    <Link
                        href={route('event-landing.detail', item.id)}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#006B32] hover:underline"
                    >
                        Detail
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── Halaman utama ─────────────────────────────────────────────────────────────
export default function DetailEventLanding({ event, relatedEvents, loginRedirect }) {
    // ── Data dari DB ──────────────────────────────────────────────────────────
    const isOnline = event.jenis_event === 'Online';
    const lokasi_label = isOnline ? 'Platform / Link' : 'Lokasi';
    const kapasitas = event.kapasitas ?? 0;
    const registered = event.registered_count ?? 0;
    const sisaKuota = Math.max(0, kapasitas - registered);
    const pctFilled = kapasitas > 0 ? Math.min((registered / kapasitas) * 100, 100) : 0;
    const kuotaPenuh = sisaKuota <= 0;

    const tanggalLabel = event.tanggal
        ? new Date(event.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : '-';
    const waktuLabel = event.jam ? `${String(event.jam).slice(0, 5)} WIB - Selesai` : '-';

    // ── Countdown berbasis mulai_at ────────────────────────────────────────────
    const mulaiAt = event.mulai_at ? new Date(event.mulai_at) : null;
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000); // update tiap 30 detik
        return () => clearInterval(id);
    }, []);

    const diffMs = mulaiAt ? mulaiAt - now : null;
    const sudahMulai = diffMs !== null && diffMs <= 0;
    const countdownText = diffMs !== null && !sudahMulai ? formatCountdown(diffMs) : null;
    const isWarning = countdownText !== null && diffMs < 24 * 60 * 60 * 1000;

    // Status tombol pendaftaran
    const daftarDisabled = kuotaPenuh || sudahMulai;

    // ── Info card items ───────────────────────────────────────────────────────
    const infoItems = [
        { id: 'tanggal', label: 'Tanggal', value: tanggalLabel, icon: 'calendar' },
        { id: 'waktu', label: 'Waktu', value: waktuLabel, icon: 'clock' },
        { id: 'lokasi', label: lokasi_label, value: event.lokasi_link || '-', icon: 'pin' },
        { id: 'pembicara', label: 'Pembicara', value: event.narasumber || '-', icon: 'user' },
    ];

    // ── Deskripsi (bisa mengandung HTML dari TinyMCE/Quill) ──────────────────
    const descriptionHtml = event.deskripsi || '';
    const hasDescription = descriptionHtml.replace(/<[^>]*>/g, '').trim().length > 0;

    // ── Topics & Benefits (opsional — hanya tampil bila ada dari props) ──────
    const topics = Array.isArray(event.topics) ? event.topics : [];
    const benefits = Array.isArray(event.benefits) ? event.benefits : [];

    // ── Related events — hanya render item yang punya id ─────────────────────
    const validRelated = (relatedEvents ?? []).filter(e => e?.id);

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title={`${event.judul} - Pensiun Mudah`} />
            <LandingHeader loginHref="/login" registerHref={loginRedirect} />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    {/* ── Navigasi kembali ── */}
                    <Link
                        href="/event"
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Event
                    </Link>

                    <div className="mt-6 grid gap-8 lg:grid-cols-3">
                        {/* ────────── KOLOM KIRI ────────── */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Hero image */}
                            <div className="relative flex aspect-video items-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E2A3A] to-[#06141C] p-6">
                                <span className="absolute left-5 top-5 z-10 rounded-full bg-[#FF8928] px-4 py-1.5 text-sm font-bold text-white">
                                    {event.status_label ?? 'Akan Datang'}
                                </span>
                                {event.image_url ? (
                                    <img
                                        src={event.image_url}
                                        alt={event.judul}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="flex h-1/2 w-full items-end justify-center gap-2 opacity-80">
                                        {heroBars.map((bar, i) => (
                                            <span key={i} className={`w-4 rounded-t bg-gradient-to-t from-[#0FB5A8]/30 to-[#5EEAD4] sm:w-6 ${bar}`} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Judul */}
                            <h1 className="text-3xl font-bold leading-tight text-[#1B1C1C] sm:text-4xl">
                                {event.judul}
                            </h1>

                            {/* Info cards */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {infoItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-[#E4E2E1] bg-white p-4 shadow-sm">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-white">
                                            <InfoIcon name={item.icon} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#6B7280]">{item.label}</p>
                                            <p className="truncate font-bold text-[#1B1C1C]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Deskripsi */}
                            {hasDescription && (
                                <div>
                                    <h2 className="border-l-4 border-[#006B32] pl-3 text-xl font-bold text-[#1B1C1C]">
                                        Tentang Event Ini
                                    </h2>
                                    <div
                                        className="prose prose-sm sm:prose-base mt-4 max-w-none text-[#3D4A3E] prose-headings:text-[#1B1C1C] prose-strong:text-[#1B1C1C] prose-a:text-[#008740]"
                                        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                    />
                                </div>
                            )}

                            {/* Topik utama (hanya bila ada dari backend) */}
                            {topics.length > 0 && (
                                <div>
                                    <p className="font-bold text-[#1B1C1C]">Topik Utama:</p>
                                    <ul className="mt-2 divide-y divide-[#E4E2E1]">
                                        {topics.map((topic, i) => (
                                            <li key={i} className="flex items-start gap-3 py-3 text-[#3D4A3E]">
                                                <svg className="mt-1 h-4 w-4 shrink-0 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Benefit (hanya bila ada dari backend) */}
                            {benefits.length > 0 && (
                                <div>
                                    <p className="font-bold text-[#1B1C1C]">Yang Anda Dapatkan:</p>
                                    <ul className="mt-2 space-y-2">
                                        {benefits.map((b, i) => (
                                            <li key={i} className="flex items-center gap-3 text-[#3D4A3E]">
                                                <svg className="h-4 w-4 shrink-0 text-[#22C55E]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Event terkait */}
                            {validRelated.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1B1C1C]">Event Terkait Lainnya</h2>
                                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {validRelated.map((item) => (
                                            <RelatedCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ────────── KOLOM KANAN — Pendaftaran ────────── */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                                <h2 className="text-lg font-bold text-[#1B1C1C]">Pendaftaran Peserta</h2>

                                {/* Progress kapasitas */}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm text-[#3D4A3E]">Kapasitas Terisi</span>
                                    <span className="text-xl font-extrabold text-[#006B32]">
                                        {registered} / {kapasitas}
                                    </span>
                                </div>
                                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E4E2E1]">
                                    <div
                                        className="h-full rounded-full bg-[#006B32] transition-all"
                                        style={{ width: `${pctFilled}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-right text-xs text-[#6B7280]">
                                    Tersisa {sisaKuota} kursi lagi
                                </p>

                                {/* Status penutupan / countdown */}
                                <div className="mt-4">
                                    {kuotaPenuh ? (
                                        <div className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                                            Kuota Penuh
                                        </div>
                                    ) : sudahMulai ? (
                                        <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                            Pendaftaran Ditutup
                                        </div>
                                    ) : countdownText ? (
                                        <div className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${isWarning ? 'bg-orange-50 text-[#FF8928]' : 'bg-green-50 text-[#006B32]'}`}>
                                            Ditutup dalam {countdownText}
                                        </div>
                                    ) : null}
                                </div>

                                {/* Tombol daftar */}
                                {daftarDisabled ? (
                                    <button
                                        disabled
                                        className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-300 py-3.5 font-bold text-gray-500"
                                    >
                                        {kuotaPenuh ? 'Kuota Penuh' : 'Pendaftaran Ditutup'}
                                    </button>
                                ) : (
                                    <Link
                                        href={loginRedirect}
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                    >
                                        Daftar Sekarang
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
