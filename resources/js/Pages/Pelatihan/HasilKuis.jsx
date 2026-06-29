import { Head, Link } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  Timer,
  XCircle,
} from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";
import { normalizeLearning } from "./learningContent";

export default function HasilKuis({ learning, quizResult }) {
  const { course } = normalizeLearning(learning);

  const score = quizResult?.score ?? 0;
  const passingScore = quizResult?.passing_score ?? 70;
  const isFinal = quizResult?.is_final ?? false;
  const totalQuestions = quizResult?.total_questions ?? 4;
  const correctCount = quizResult?.correct_count ?? 0;
  const timeTaken = quizResult?.time_taken_minutes ?? 0;

  // FIX BUG #5: wrong_questions sekarang bisa diisi dari DB (tidak lagi selalu kosong)
  const wrongQuestionsArray = quizResult?.wrong_questions ?? [];
  const wrongNumbers = new Set(wrongQuestionsArray);

  const isPassed = score >= passingScore;
  const performance = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const firstLessonHref = course.firstLessonId
    ? `/pelatihan/${course.id}/belajar?lesson=${encodeURIComponent(course.firstLessonId)}`
    : `/pelatihan/${course.id}/belajar`;

  // FIX BUG #1: "Lanjut ke Modul Berikutnya" harus mengarah ke modul/lesson berikutnya,
  // bukan firstLesson. Gunakan nextLessonId jika tersedia dari backend.
  const nextLessonHref = course.nextLessonId
    ? `/pelatihan/${course.id}/belajar?lesson=${encodeURIComponent(course.nextLessonId)}`
    : firstLessonHref; // fallback jika tidak ada modul lanjutan

  return (
    <LearningLayout>
      <Head title="Hasil Kuis - Pensiun Mudah" />
      <main className="mx-auto max-w-[1072px] px-8 pb-24 pt-14 font-['Atkinson_Hyperlegible']">
        {/* Tombol Kembali */}
        <Link
          href={firstLessonHref}
          className="inline-flex items-center gap-3 text-lg font-extrabold text-[#007A3D] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Pelatihan
        </Link>

        {/* Breadcrumbs */}
        <div className="mt-9 flex items-center gap-2 text-base font-bold">
          <Link href="/dashboard" className="text-[#007A3D] hover:underline">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <Link
            href={`/pelatihan/${course.id}/kuis`}
            className="text-[#007A3D] hover:underline"
          >
            Kuis Pelatihan
          </Link>
          <ChevronRight className="h-4 w-4 text-[#3D4A3E]" />
          <span className="text-[#3D4A3E]">Hasil Kuis</span>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[665px_320px]">
          {/* UTAMA SISI KIRI */}
          <section className="rounded-xl border border-[#BFD1C0] bg-white px-14 py-14 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {/* Lingkaran Skor */}
              <div
                className={`flex h-[192px] w-[192px] items-center justify-center rounded-full border-4 transition-colors ${isPassed
                    ? "border-[#CDE8D8] bg-[#F4FFF0]"
                    : "border-[#FACDCD] bg-[#FFEDEC]"
                  }`}
              >
                <div>
                  <p
                    className={`text-5xl font-extrabold ${isPassed ? "text-[#007A3D]" : "text-[#D12B2B]"
                      }`}
                  >
                    {score}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#6C7B70]">
                    KKM: {passingScore}
                  </p>
                </div>
              </div>

              <h1
                className={`mt-7 text-[32px] font-extrabold transition-colors ${isPassed ? "text-[#007A3D]" : "text-[#D12B2B]"
                  }`}
              >
                {isPassed ? "Selamat, Anda Lulus!" : "Maaf, Anda Belum Lulus"}
              </h1>
              <p className="mt-3 max-w-[430px] text-base leading-relaxed text-[#3D4A3E]">
                {isPassed
                  ? `Anda telah menguasai materi modul ini dengan sangat baik dan memenuhi standar kelulusan.`
                  : `Skor Anda belum mencapai nilai minimum kelulusan (${passingScore}). Silakan pelajari kembali materi dan coba lagi.`}
              </p>
            </div>

            {/* Grid Informasi Rekap */}
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center shadow-2xs">
                <CheckCircle2 className="mx-auto h-5 w-5 text-[#007A3D]" />
                <p className="mt-2 text-lg font-extrabold text-[#1F1F1F]">
                  {correctCount} Jawaban
                </p>
                <p className="text-xs font-semibold text-[#6B7280]">Benar</p>
              </div>
              <div className="rounded-xl border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center shadow-2xs">
                <CircleHelp className="mx-auto h-5 w-5 text-[#3D4A3E]" />
                <p className="mt-2 text-lg font-extrabold text-[#1F1F1F]">
                  {totalQuestions} Soal
                </p>
                <p className="text-xs font-semibold text-[#6B7280]">
                  Total Pertanyaan
                </p>
              </div>
              <div className="rounded-xl border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center shadow-2xs">
                <Timer className="mx-auto h-5 w-5 text-[#C45D00]" />
                <p className="mt-2 text-lg font-extrabold text-[#1F1F1F]">
                  {timeTaken} Menit
                </p>
                <p className="text-xs font-semibold text-[#6B7280]">
                  Durasi Pengerjaan
                </p>
              </div>
            </div>

            {/* Ringkasan Nomor Soal Dinamis */}
            <div className="mt-16">
              <h2 className="text-xl font-extrabold text-[#1F1F1F]">
                Ringkasan Performa Soal
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {performance.map((number) => {
                  const isWrong = wrongNumbers.has(number);
                  return (
                    <span
                      key={number}
                      className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 text-base font-extrabold transition-all shadow-2xs ${isWrong
                          ? "border-[#D12B2B] bg-[#FFEDEC] text-[#B51212]"
                          : "border-[#007A3D] bg-[#008740] text-white"
                        }`}
                    >
                      {number}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Tombol Navigasi Bawah */}
            <div className="mt-16 flex flex-wrap items-center gap-4">
              {isPassed ? (
                // FIX BUG #1: Gunakan nextLessonHref, bukan firstLessonHref
                <Link
                  href={nextLessonHref}
                  className="inline-flex h-14 flex-1 min-w-[240px] items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-6 text-base font-extrabold text-[#261504] shadow-sm transition-colors hover:bg-[#E0761F]"
                >
                  Lanjut ke Modul Berikutnya
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  href={`/pelatihan/${course.id}/kuis`}
                  preserveState={false}
                  className="inline-flex h-14 flex-1 min-w-[240px] items-center justify-center gap-2 rounded-xl bg-[#D12B2B] px-6 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-[#B51212]"
                >
                  Coba Kuis Lagi
                  <RotateCcw className="h-5 w-5" />
                </Link>
              )}
            </div>
          </section>

          {/* SISI KANAN: ASIDE INFO KURSUS */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-[#BFD1C0] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#1F1F1F]">
                Informasi Kursus
              </h2>
              <div className="mt-5 overflow-hidden rounded-lg bg-[#2D4F3A]">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-[200px] w-full object-cover"
                  />
                ) : (
                  <div className="relative h-[200px] bg-[linear-gradient(135deg,#C99B5D,#F3D39B_42%,#0D6B42_43%,#064626)]">
                    <div className="absolute left-6 top-10 h-28 w-40 rotate-[-18deg] rounded-sm border-[6px] border-[#0D6B42] bg-[#F7F3EC] shadow-xl">
                      <div className="mx-auto mt-4 h-2 w-12 rounded bg-[#0D6B42]" />
                      <div className="mx-auto mt-3 h-1 w-20 rounded bg-[#C7B89E]" />
                    </div>
                  </div>
                )}
              </div>
              {/* Tampilan Kondisional Sertifikat */}
              {isFinal && isPassed ? (
                <>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#007A3D] bg-[#F4FFF0] px-3 py-3">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#007A3D]">
                      <BadgeCheck className="h-5 w-5 text-[#007A3D]" />
                      Sertifikat Kelulusan Ready!
                    </span>
                    <Check className="h-5 w-5 text-[#007A3D]" />
                  </div>
                  <Link
                    href={`/pelatihan/${course.id}/sertifikat/unduh`}
                    className="mt-4 flex h-14 items-center justify-center rounded-xl bg-[#007A3D] text-base font-extrabold text-white shadow-sm transition-colors hover:bg-[#006122]"
                  >
                    Unduh Sertifikat Resmi
                  </Link>
                </>
              ) : isFinal && !isPassed ? (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#D12B2B] bg-[#FFEDEC] p-3 text-xs font-semibold text-[#B51212]">
                  <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Sertifikat dikunci. Raih nilai kelulusan {passingScore}{" "}
                    untuk klaim sertifikat kelas.
                  </span>
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#BFD1C0] bg-[#FAF8F7] p-3 text-xs font-semibold text-[#6B7280]">
                  <CircleHelp className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Sertifikat kelulusan utama otomatis terbuka setelah
                    menyelesaikan Kuis Final evaluasi akhir.
                  </span>
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </LearningLayout>
  );
}