import { useMemo, useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";
import { firstQuiz, normalizeLearning } from "./learningContent";

const answerLetters = ["A.", "B.", "C.", "D."];

export default function Kuis({ learning }) {
  const { course, modules } = normalizeLearning(learning);
  const quiz = firstQuiz(modules);

  // Ambil data soal dinamis dari database
  const questions = useMemo(() => quiz.questions || [], [quiz]);
  const totalQuestions = questions.length || 1;

  // --- STATE MANAGEMENT ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() =>
    Array(totalQuestions).fill(null)
  );

  // FIX BUG #4: Timer real untuk waktu pengerjaan
  const startTimeRef = useRef(Date.now());

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];

  const progressStep = currentIndex + 1;
  const progressPercent = Math.round((progressStep / totalQuestions) * 100);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // FIX BUG #2: Deklarasi firstLessonHref SEBELUM dipakai di handler
  const firstLessonHref = course.firstLessonId
    ? `/pelatihan/${course.id}/belajar?lesson=${encodeURIComponent(course.firstLessonId)}`
    : `/pelatihan/${course.id}/belajar`;

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      router.visit(firstLessonHref);
    }
  };

  const handlePrimary = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const timeTakenMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));

    const detailedResults = questions.map((q, idx) => {
      const chosenIndex = userAnswers[idx];
      const chosenOptionObj = chosenIndex !== null ? q.options[chosenIndex] : null;

      let chosenText = null;
      let isCorrect = false;

      if (chosenOptionObj !== null && chosenOptionObj !== undefined) {
        if (typeof chosenOptionObj === "object") {
          chosenText = chosenOptionObj.teks_opsi ?? chosenOptionObj.text ?? null;
          isCorrect = !!chosenOptionObj.is_correct;
        } else {
          chosenText = String(chosenOptionObj);
        }
      }

      return { question_id: q.id, user_answer: chosenText, is_correct: isCorrect };
    });

    router.post(`/pelatihan/${course.id}/kuis/selesai`, {
      quiz_id: quiz.id,
      answers_recap: detailedResults,
      time_taken_minutes: timeTakenMinutes,
    });
  };

  return (
    <LearningLayout>
      <Head title={`${quiz.title || "Kuis"} - Pensiun Mudah`} />
      <main className="mx-auto max-w-[1072px] px-8 pb-6 pt-9">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-3 text-lg font-extrabold text-[#007A3D] hover:opacity-80 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Pelatihan
        </button>

        {/* Breadcrumbs */}
        <div className="mt-5 flex items-center gap-2 text-base font-bold">
          <Link href="/dashboard" className="text-[#007A3D]">
            Beranda
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <Link href={firstLessonHref} className="text-[#007A3D]">
            Modul Saya
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <span className="font-medium text-[#3D4A3E]">
            {quiz.title || "Kuis"}
          </span>
        </div>

        {/* Header Kuis & Progress Bar */}
        <div className="mt-8 flex items-start justify-between gap-8">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight text-[#1F1F1F]">
              {quiz.title || "Kuis Evaluasi Modul"}
            </h1>
            <p className="mt-3 text-xl text-[#3D4A3E]">
              Pastikan Anda memilih jawaban yang paling tepat sesuai materi.
            </p>
          </div>
          <div className="mt-1 w-[216px] shrink-0 rounded-xl border border-[#BFD1C0] bg-[#F0EDED] p-4">
            <div className="flex justify-between items-center text-sm font-extrabold text-[#1F1F1F]">
              <span>Progres: {progressPercent}%</span>
              <span className="text-[#007A3D]">
                {progressStep} dari {totalQuestions}
              </span>
            </div>
            <div className="mt-3 h-4 rounded-full bg-[#E1DEDC] overflow-hidden">
              <div
                className="h-4 bg-[#007A3D] transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kotak Pertanyaan */}
        <section className="mt-9 rounded-xl border border-[#BFD1C0] bg-white p-10 shadow-[0_10px_30px_rgba(16,24,40,0.04)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF8928] text-2xl font-extrabold text-[#3A260A]">
              {progressStep}
            </div>
            <h2 className="max-w-[820px] text-2xl font-extrabold leading-snug text-[#1F1F1F]">
              {currentQuestion?.text}
            </h2>
          </div>

          {/* Opsi Pilihan Ganda */}
          <div className="mt-9 space-y-4 pl-1 md:pl-10">
            {(currentQuestion?.options || []).map((option, index) => {
              const active = selectedAnswer === index;

              // FIX BUG #3 + ROOT CAUSE: Tampilkan teks opsi dengan benar
              // baik berupa string maupun objek {teks_opsi, ...}
              const optionText =
                typeof option === "object"
                  ? (option?.teks_opsi ?? option?.text ?? "")
                  : String(option ?? "");

              // FIX BUG #3: Key unik menggunakan id dari DB jika tersedia
              const optionKey =
                typeof option === "object" && option?.id
                  ? option.id
                  : `option-${currentIndex}-${index}`;

              return (
                <button
                  type="button"
                  key={optionKey}
                  onClick={() => {
                    setUserAnswers((prev) => {
                      const updated = [...prev];
                      updated[currentIndex] = index;
                      return updated;
                    });
                  }}
                  className={`flex min-h-[84px] w-full items-center gap-6 rounded-xl border-2 px-6 text-left transition ${active
                    ? "border-[#007A3D] bg-[#F4FFF0]"
                    : "border-[#BFD1C0] bg-white hover:border-[#007A3D]/60"
                    }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${active
                      ? "border-[#007A3D] bg-white"
                      : "border-[#6C7B70] bg-white"
                      }`}
                  >
                    {active && (
                      <span className="h-3 w-3 rounded-full bg-[#007A3D]" />
                    )}
                  </span>
                  <span className="w-8 shrink-0 font-extrabold text-[#007A3D]">
                    {answerLetters[index]}
                  </span>
                  <span className="text-xl leading-7 text-[#1F1F1F]">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tombol Aksi Navigasi Bawah */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-16 min-w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-[#007A3D] px-8 text-lg font-extrabold text-[#007A3D] bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali
          </button>
          <button
            type="button"
            onClick={handlePrimary}
            disabled={selectedAnswer === null}
            className={`inline-flex h-16 min-w-[222px] items-center justify-center gap-2 rounded-xl px-8 text-lg font-extrabold transition ${selectedAnswer !== null
              ? "bg-[#FF8928] text-[#4B3009] hover:bg-[#E0761F] cursor-pointer"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isLastQuestion ? "Selesai" : "Lanjut"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </LearningLayout>
  );
}