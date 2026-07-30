import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";

export default function ReviewCourse({ course, existingReview }) {
    // --- STATE UNTUK REVIEW FORM ---
    const [savedReview, setSavedReview] = useState(existingReview || null);
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        router.post(
            route("pelatihan.review.store", course.id),
            {
                rating,
                comment,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSavedReview({ rating, comment });
                    setSubmitSuccess(true);
                    setIsSubmitting(false);
                    setTimeout(() => setSubmitSuccess(false), 3000);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleSkipReview = () => {
        // Kembali ke halaman sebelumnya atau dashboard
        router.visit(route('pelatihan'));
    };

    return (
        <LearningLayout>
            <Head title="Beri Penilaian - Pensiun Mudah" />
            <main className="mx-auto max-w-[1072px] px-8 pb-24 pt-14 font-['Atkinson_Hyperlegible']">
                {/* Tombol Kembali */}
                <Link
                    href={route('pelatihan.kelas', course.id)} // Kembali ke halaman kelas saya
                    className="inline-flex items-center gap-3 text-lg font-extrabold text-[#007A3D] hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Kembali ke Kelas Saya
                </Link>

                {/* ===== FORM PENILAIAN (REVIEW) ===== */}
                <div className="mt-10 rounded-xl border border-[#BCCABB] bg-white px-14 py-14 shadow-sm">
                    <form onSubmit={handleSubmitReview}>
                        {/* Toast Sukses */}
                        {submitSuccess && (
                            <div className="mb-8 flex items-center gap-3 rounded-lg border border-[#007A3D] bg-[#F4FFF0] px-5 py-4 text-sm font-bold text-[#007A3D]">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                {savedReview
                                    ? "Terima kasih! Penilaian Anda berhasil diperbarui."
                                    : "Terima kasih! Penilaian Anda telah kami simpan."}
                            </div>
                        )}

                        {/* Heading Rating */}
                        <div className="flex flex-col items-center text-center">
                            <h3 className="font-['Public_Sans'] text-2xl font-semibold text-[#1B1C1C]">
                                {savedReview
                                    ? "Penilaian Anda"
                                    : "Bagaimana pengalaman Pelatihan Anda?"}
                            </h3>
                            <p className="mt-1 text-xl leading-8 text-[#3D4A3E]">
                                {savedReview
                                    ? "Terima kasih sudah memberikan penilaian untuk kursus ini."
                                    : "Pilih rating dan berikan komentar Anda"}
                            </p>
                        </div>

                        {/* Star Rating */}
                        <div className="mt-6 flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= (hoverRating || rating);
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="flex h-14 w-14 items-center justify-center rounded-xl transition-colors hover:bg-[#FFF4E8]"
                                        disabled={isSubmitting}
                                    >
                                        <Star
                                            className={`h-10 w-10 transition-colors ${isActive
                                                ? "fill-[#FF8928] text-[#FF8928]"
                                                : "fill-[#6D7B6D]/20 text-[#6D7B6D]"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Label dan Textarea */}
                        <div className="mt-12">
                            <div className="flex items-end gap-2">
                                <label className="text-lg font-bold text-[#1B1C1C]">
                                    Ulasan
                                </label>
                                <span className="text-sm text-[#3D4A3E]">(Opsional)</span>
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Contoh: Materi sangat mudah dipahami dan membantu saya mengatur tabungan hari tua..."
                                className="mt-3 min-h-[160px] w-full resize-y rounded-lg border-2 border-[#BCCABB] bg-[#FBF9F8] p-4 text-lg leading-relaxed text-[#1B1C1C] placeholder:text-[#6B7280] focus:border-[#007A3D] focus:outline-none focus:ring-2 focus:ring-[#007A3D]/20"
                                disabled={isSubmitting}
                                maxLength={1000}
                            />

                            {/* Indikator sisa karakter */}
                            <p className="mt-2 text-right text-sm text-[#6B7280]">
                                {comment.length}/1000
                            </p>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleSkipReview}
                                className="flex h-[71px] min-w-[340px] items-center justify-center rounded-lg border-2 border-[#006B32] bg-[#FBF9F8] px-8 text-lg font-bold text-[#006B32] transition-colors hover:bg-[#F0FDF4]"
                                disabled={isSubmitting}
                            >
                                Lewati
                            </button>

                            <button
                                type="submit"
                                disabled={rating === 0 || isSubmitting}
                                className={`flex h-[71px] min-w-[340px] items-center justify-center rounded-lg px-8 text-lg font-bold text-white shadow-sm transition-colors ${rating === 0 || isSubmitting
                                    ? "cursor-not-allowed bg-gray-300"
                                    : "cursor-pointer bg-[#FF8928] hover:bg-[#E0761F]"
                                    }`}
                            >
                                {isSubmitting
                                    ? "Menyimpan..."
                                    : savedReview
                                        ? "Perbarui Rating"
                                        : "Simpan Rating"}
                            </button>
                        </div>

                        {/* Guidance Note */}
                        <div className="mt-8 rounded-xl border border-dashed border-[#6D7B6D] bg-[#F6F3F2] p-6 text-center">
                            <p className="text-lg leading-relaxed text-[#3D4A3E]">
                                Rating dan ulasan Anda membantu kami meningkatkan kualitas
                                pelatihan untuk peserta lainnya.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </LearningLayout>
    );
}