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
} from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";
import { normalizeLearning } from "./learningContent";

const performance = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const wrongNumbers = new Set([3, 7]);

export default function HasilKuis({ learning }) {
  const { course } = normalizeLearning(learning);
  const firstLessonHref = course.firstLessonId
    ? `/pelatihan/${course.id}/belajar?lesson=${encodeURIComponent(course.firstLessonId)}`
    : `/pelatihan/${course.id}/belajar`;

  return (
    <LearningLayout>
      <Head title="Hasil Kuis - Pensiun Mudah" />

      <main className="mx-auto max-w-[1072px] px-8 pb-24 pt-14">
        <Link
          href={firstLessonHref}
          className="inline-flex items-center gap-3 text-lg font-extrabold text-[#007A3D]"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Pelatihan
        </Link>

        <div className="mt-9 flex items-center gap-2 text-base font-bold">
          <Link href="/dashboard" className="text-[#007A3D]">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <Link href={`/pelatihan/${course.id}/kuis`} className="text-[#007A3D]">
            Kuis modul 1
          </Link>
          <ChevronRight className="h-4 w-4 text-[#3D4A3E]" />
          <span className="text-[#3D4A3E]">Hasil Kuis</span>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[665px_320px]">
          <section className="rounded-xl border border-[#BFD1C0] bg-white px-14 py-14">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[192px] w-[192px] items-center justify-center rounded-full border-4 border-[#CDE8D8]">
                <div>
                  <p className="text-5xl font-extrabold text-[#007A3D]">80</p>
                  <p className="mt-1 text-lg font-extrabold text-[#3D4A3E]">dari 100</p>
                </div>
              </div>

              <h1 className="mt-7 text-[32px] font-extrabold text-[#007A3D]">
                Selamat, Anda Lulus!
              </h1>
              <p className="mt-3 max-w-[410px] text-xl leading-8 text-[#3D4A3E]">
                Anda telah menguasai materi Manajemen Keuangan Pensiun dengan
                sangat baik.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center">
                <CheckCircle2 className="mx-auto h-5 w-5 text-[#007A3D]" />
                <p className="mt-3 text-lg font-extrabold text-[#1F1F1F]">8 Jawaban</p>
                <p className="text-base text-[#3D4A3E]">Benar</p>
              </div>
              <div className="rounded-lg border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center">
                <CircleHelp className="mx-auto h-5 w-5 text-[#D12B45]" />
                <p className="mt-3 text-lg font-extrabold text-[#1F1F1F]">10 Soal</p>
                <p className="text-base text-[#3D4A3E]">Total</p>
              </div>
              <div className="rounded-lg border border-[#BFD1C0] bg-[#FAF8F7] p-4 text-center">
                <Timer className="mx-auto h-5 w-5 text-[#C45D00]" />
                <p className="mt-3 text-lg font-extrabold text-[#1F1F1F]">12 Menit</p>
                <p className="text-base text-[#3D4A3E]">Durasi</p>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-extrabold text-[#1F1F1F]">
                Ringkasan Performa
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {performance.map((number) => {
                  const wrong = wrongNumbers.has(number);
                  return (
                    <span
                      key={number}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-extrabold ${
                        wrong
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

            <div className="mt-20 flex flex-wrap items-center gap-4">
              <Link
                href={firstLessonHref}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-4 text-base font-extrabold text-[#1F1F1F] shadow-sm"
              >
                Lanjut ke Modul Berikutnya
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={`/pelatihan/${course.id}/kuis`}
                className="inline-flex h-14 min-w-[290px] items-center justify-center gap-2 rounded-lg border-2 border-[#007A3D] px-6 text-base font-extrabold text-[#007A3D]"
              >
                <RotateCcw className="h-5 w-5" />
                Ulangi Kuis
              </Link>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-xl border border-[#BFD1C0] bg-white p-6">
              <h2 className="text-2xl font-extrabold text-[#1F1F1F]">
                Informasi Kursus
              </h2>
              <div className="mt-7 overflow-hidden rounded-lg bg-[#2D4F3A]">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-[290px] w-full object-cover"
                  />
                ) : (
                  <div className="relative h-[290px] bg-[linear-gradient(135deg,#C99B5D,#F3D39B_42%,#0D6B42_43%,#064626)]">
                    <div className="absolute left-9 top-16 h-36 w-48 rotate-[-18deg] rounded-sm border-[10px] border-[#0D6B42] bg-[#F7F3EC] shadow-xl">
                      <div className="mx-auto mt-6 h-3 w-16 rounded bg-[#0D6B42]" />
                      <div className="mx-auto mt-4 h-1.5 w-28 rounded bg-[#C7B89E]" />
                      <div className="mx-auto mt-2 h-1.5 w-32 rounded bg-[#C7B89E]" />
                      <div className="absolute bottom-4 right-6 h-9 w-9 rounded-full bg-[#D2A43A]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#BFD1C0] px-3 py-3">
                <span className="flex items-center gap-2 text-base text-[#1F1F1F]">
                  <BadgeCheck className="h-5 w-5 text-[#007A3D]" />
                  Sertifikat Tersedia
                </span>
                <Check className="h-5 w-5 text-[#3D4A3E]" />
              </div>

              <Link
                href="/sertifikat"
                className="mt-4 flex h-16 items-center justify-center rounded-lg border-2 border-[#007A3D] text-lg font-extrabold text-[#007A3D]"
              >
                Unduh
              </Link>
            </section>

            <div className="rounded-xl border border-[#BFD1C0] bg-[#E7E4E2] p-6 text-lg italic leading-8 text-[#1F1F1F]">
              "Keuangan yang terencana adalah kunci ketenangan di masa tua."
            </div>
          </aside>
        </div>
      </main>
    </LearningLayout>
  );
}
