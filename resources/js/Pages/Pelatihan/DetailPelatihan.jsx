import { Head, Link } from '@inertiajs/react';
import CoursePreviewCard from '@/Components/Pelatihan/CoursePreviewCard';
import PurchaseCard from '@/Components/Pelatihan/PurchaseCard';
import BenefitCard from '@/Components/Pelatihan/BenefitCard';
import TestimonialCard from '@/Components/Pelatihan/TestimonialCard';
import PelatihanFooter from '@/Components/Pelatihan/PelatihanFooter';
import JadwalTatapMuka from '@/Components/Course/JadwalTatapMuka';

export default function DetailPelatihan({ course, sesiSeminar, backUrl = '/beli-pelatihan', reviews = [], ratingAverage = 0, totalReviews = 0 }) {
    // Data kursus (anggap dari backend, kasih default biar aman dirender)
    const data = course || {};

    if (!data) return <div>Loading...</div>;

    const displayRating = ratingAverage ? ratingAverage : (data.rating_average || 0);
    const displayReviewCount = totalReviews || data.total_reviews || 0;

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

    // Testimoni peserta - pakai data asli dari database, fallback ke dummy
    const testimonials = reviews.length > 0
        ? reviews
        : [
            {
                name: 'Bambang Wijaya',
                text: 'Materinya sangat membuka mata. Sekarang saya jauh lebih tenang mengatur dana pensiun dan tahu ke mana harus mengalokasikannya.',
            },
            {
                name: 'Siti Rahayu',
                text: 'Penjelasannya runtut dan mudah dipahami untuk usia kami. Grup WA-nya juga aktif dan sangat membantu.',
            },
            {
                name: 'Hendra Gunawan',
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
                        href={backUrl}
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
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE9D8] px-3 py-1 text-sm font-bold text-[#1B1C1C]">
                                <svg className="h-4 w-4 text-[#FF8928]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                </svg>
                                {displayRating} ({displayReviewCount} Review)
                            </span>
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

                    {/* --- 5. JADWAL TATAP MUKA (Hanya untuk Hybrid/Offline) --- */}
                    {(data.tipe_kelas === 'Hybrid' || data.tipe_kelas === 'Offline') && (
                        <div className="mt-10">
                            <JadwalTatapMuka sesiSeminar={sesiSeminar} />
                        </div>
                    )}

                    {/* --- 6. TESTIMONI --- */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-[#1B1C1C] text-center">
                            Apa Kata Mereka?
                        </h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={index}
                                    name={testimonial.name}
                                    text={testimonial.text}
                                    avatar={testimonial.avatar}
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
