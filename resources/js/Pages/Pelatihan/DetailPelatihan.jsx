import { Head, Link } from '@inertiajs/react';
import CoursePreviewCard from '@/Components/Pelatihan/CoursePreviewCard';
import PurchaseCard from '@/Components/Pelatihan/PurchaseCard';
import BenefitCard from '@/Components/Pelatihan/BenefitCard';
import TestimonialCard from '@/Components/Pelatihan/TestimonialCard';
import PelatihanFooter from '@/Components/Pelatihan/PelatihanFooter';

export default function DetailPelatihan({ course }) {
    // Data kursus (anggap dari backend, kasih default biar aman dirender)
    const data = course || {};

    if (!data) return <div>Loading...</div>;

    const previewLesson = data.lessons && data.lessons.length > 0 ? data.lessons[0] : null;

    const slug = data.slug || data.id;

    // Fitur yang didapat (ditampilin di kartu pembelian)
    const purchaseFeatures = [
        'Modul Video HD',
        'E-Book Perencanaan Keuangan',
        'Grup WA Eksklusif Pensiunan',
        'Sertifikat Kelulusan Resmi',
    ];

    // Daftar benefit "Tentang Kursus Ini"
    const benefits = [
        {
            title: 'Proteksi Aset',
            description:
                'Strategi melindungi kekayaan dari inflasi dan risiko pasar yang tidak terduga.',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l7 3v6c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V6l7-3z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.5 12l1.8 1.8 3.2-3.6"
                    />
                </svg>
            ),
        },
        {
            title: 'Perencanaan Waris',
            description:
                'Susun warisan secara bijak agar transisi kekayaan ke keluarga berjalan lancar.',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 8a3 3 0 106 0 3 3 0 00-6 0zm12 12v-2a4 4 0 00-3-3.8"
                    />
                </svg>
            ),
        },
        {
            title: 'Arus Kas Pasif',
            description:
                'Bangun sumber penghasilan pasif yang stabil untuk menopang kebutuhan harian.',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6"
                    />
                </svg>
            ),
        },
        {
            title: 'Dana Kesehatan',
            description:
                'Siapkan dana darurat dan proteksi kesehatan untuk menghadapi masa tua dengan tenang.',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 11h2v-2h2v2h2v2h-2v2h-2v-2H9v-2z"
                    />
                </svg>
            ),
        },
    ];

    // Testimoni peserta
    const testimonials = [
        {
            name: 'Bambang Wijaya',
            profession: 'Pensiunan BUMN',
            text: 'Materinya sangat membuka mata. Sekarang saya jauh lebih tenang mengatur dana pensiun dan tahu ke mana harus mengalokasikannya.',
        },
        {
            name: 'Siti Rahayu',
            profession: 'Mantan Manajer Bank',
            text: 'Penjelasannya runtut dan mudah dipahami untuk usia kami. Grup WA-nya juga aktif dan sangat membantu.',
        },
        {
            name: 'Hendra Gunawan',
            profession: 'Wiraswasta',
            text: 'Investasi terbaik di usia 55. Saya jadi paham cara melindungi aset sekaligus menyiapkan warisan untuk anak-anak.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={data.title} />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
                    {/* --- 1. NAVIGASI KEMBALI --- */}
                    <Link
                        // Fungsi ini akan mengecek apakah URL sebelumnya berisi '/korporat/'
                        href={typeof window !== 'undefined' && window.document.referrer.includes('/korporat/')
                            ? '/korporat/beli-pelatihan'
                            : '/beli-pelatihan'}
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Beli Pelatihan
                    </Link>

                    {/* --- 2. HEADER KURSUS --- */}
                    <div className="mt-5">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#1B1C1C] leading-tight">
                            {data.title}
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-[#FF8928] px-2.5 py-1 text-sm font-bold text-white">
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" />
                                    </svg>
                                    {data.rating_average}
                                </span>
                                <span className="text-sm text-[#6B7280]">
                                    ({data.total_reviews} Review)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                <svg
                                    className="w-4 h-4 text-[#008740]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 7v5l3 2"
                                    />
                                </svg>
                                Total Durasi:{' '}
                                <span className="font-semibold text-[#1B1C1C]">
                                    {data.duration}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- 3. GRID KONTEN UTAMA --- */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-10 gap-8">
                        <div className="lg:col-span-7">
                            <CoursePreviewCard
                                thumbnail={data.thumbnail}
                                // KIRIM VIDEO URL KE KOMPONEN
                                videoUrl={previewLesson ? previewLesson.video_url : null}
                                label={`Tonton Cuplikan Kursus: ${data.title}`}
                            />
                        </div>

                        <div className="lg:col-span-3">
                            <PurchaseCard
                                slug={slug}
                                price={data.price}
                                originalPrice={data.original_price}
                                features={purchaseFeatures}
                            />
                        </div>
                    </div>

                    {/* --- 4. TENTANG KURSUS INI --- */}
                    <div className="mt-8 rounded-[24px] border border-[#E4E2E1] bg-white p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-[#1B1C1C]">
                            Tentang Kursus Ini
                        </h2>
                        <div
                            className="mt-3 text-[#6B7280] leading-relaxed prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <BenefitCard
                                    key={index}
                                    icon={benefit.icon}
                                    title={benefit.title}
                                    description={benefit.description}
                                />
                            ))}
                        </div>
                    </div>

                    {/* --- 5. TESTIMONI --- */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-[#1B1C1C] text-center">
                            Apa Kata Mereka?
                        </h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={index}
                                    name={testimonial.name}
                                    profession={testimonial.profession}
                                    text={testimonial.text}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* --- 6. FOOTER --- */}
            <PelatihanFooter />
        </div>
    );
}
