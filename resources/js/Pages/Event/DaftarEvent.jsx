import { Head, Link, usePage } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventInfoGrid from '@/Components/Event/EventInfoGrid';
import EventRegistrationCard from '@/Components/Event/EventRegistrationCard';
import EventFooter from '@/Components/Event/EventFooter';

export default function DaftarEvent({ event, sudahDaftar, daftarHref }) {
    const { auth } = usePage().props;
    const user = auth.user || {};
    const ev = event || {};
    const description = ev.deskripsi || '';
    const descriptionHtml = /<\/?[a-z][\s\S]*>/i.test(description)
        ? description
        : description
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join('');

    const imageSrc = ev.image_url || (ev.image_path ? `/storage/${ev.image_path}` : '/images/event-placeholder.svg');
    const venueLabel = ev.jenis_event === 'Online' ? 'Platform / Link' : 'Lokasi';
    const venueValue = ev.lokasi_link || 'Lokasi menyusul';
    const venueHref = (ev.jenis_event === 'Online' && ev.lokasi_link?.startsWith('http')) ? ev.lokasi_link : undefined;
    const backHref = `/event/${ev.id}`;

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={`Daftar - ${ev.judul}`} />
            <PaymentHeader />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                    <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" /></svg>
                        Kembali ke Detail Event
                    </Link>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <div className="overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white">
                                <img src={imageSrc} alt={ev.judul} className="aspect-[16/10] w-full object-cover" />
                            </div>
                            <h1 className="mt-6 text-3xl lg:text-4xl font-bold text-[#1B1C1C] leading-tight">{ev.judul}</h1>
                            <div className="mt-6">
                                <EventInfoGrid date={ev.tanggal} time={ev.jam} isOnline={ev.jenis_event === 'Online'} venueLabel={venueLabel} venueValue={venueValue} venueHref={venueHref} />
                            </div>
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-[#1B1C1C]">Tentang Seminar</h2>
                                <div className="prose prose-sm sm:prose-base mt-4 max-w-none text-[#4B5563]" dangerouslySetInnerHTML={{ __html: descriptionHtml || '<p>Deskripsi event belum tersedia.</p>' }} />
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-[#1B1C1C] mb-4">Data Peserta</h3>
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-semibold text-[#6B7280] uppercase">Nama Lengkap</label><input type="text" value={user.name || ''} readOnly disabled className="mt-1 w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500" /></div>
                                    <div><label className="block text-xs font-semibold text-[#6B7280] uppercase">Email</label><input type="email" value={user.email || ''} readOnly disabled className="mt-1 w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500" /></div>
                                    <div><label className="block text-xs font-semibold text-[#6B7280] uppercase">No. Telepon</label><input type="text" value={user.whatsapp || 'Belum diisi'} readOnly disabled className="mt-1 w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500" /></div>
                                    <p className="text-[10px] text-gray-400 italic">* Data diambil otomatis dari akun Anda.</p>
                                </div>
                            </div>
                            <EventRegistrationCard event={ev} sudahDaftar={sudahDaftar} daftarHref={daftarHref} />
                            {ev.jenis_event === 'Online' ? (
                                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">Link Zoom/Google Meet akan dikirim ke email Anda 1 jam sebelum event dimulai.</div>
                            ) : (
                                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">Lokasi & detail acara akan dikirim ke email Anda sebelum event dimulai.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <EventFooter />
        </div>
    );
}
