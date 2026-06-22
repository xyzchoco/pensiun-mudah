import { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";
import { firstQuiz, normalizeLearning } from "./learningContent";

const answerLetters = ["A.", "B.", "C.", "D."];

export default function Kuis({ learning }) {
  const { url } = usePage();
  const { course, modules } = normalizeLearning(learning);
  const quiz = firstQuiz(modules);
  const params = new URLSearchParams(url.split("?")[1] || "");
  const initialQuestionNumber = Number(params.get("q")) || 2;
  const [questionNumber, setQuestionNumber] = useState(initialQuestionNumber);
  const [selected, setSelected] = useState(3);
  const firstLessonHref = course.firstLessonId
    ? `/pelatihan/${course.id}/belajar?lesson=${encodeURIComponent(course.firstLessonId)}`
    : `/pelatihan/${course.id}/belajar`;

  const question = useMemo(() => {
    return (
      quiz.questions?.[(questionNumber - 1) % quiz.questions.length] ||
      quiz.questions?.[0]
    );
  }, [questionNumber, quiz.questions]);

  const totalQuestions = quiz.totalQuestions || 10;
  const progressStep = Math.min(Math.max(questionNumber, 3), totalQuestions);
  const isFinishStep = questionNumber >= 3;

  const handlePrimary = () => {
    if (isFinishStep) {
      router.visit(`/pelatihan/${course.id}/kuis/hasil`);
      return;
    }
    const next = questionNumber + 1;
    setQuestionNumber(next);
    router.visit(`/pelatihan/${course.id}/kuis?q=${next}`, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <LearningLayout>
      <Head title={`${quiz.title || "Kuis"} - Pensiun Mudah`} />

      <main className="mx-auto max-w-[1072px] px-8 pb-6 pt-9">
        <Link
          href={firstLessonHref}
          className="inline-flex items-center gap-3 text-lg font-extrabold text-[#007A3D]"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Pelatihan
        </Link>

        <div className="mt-5 flex items-center gap-2 text-base font-bold">
          <Link href="/dashboard" className="text-[#007A3D]">
            Beranda
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <Link href={firstLessonHref} className="text-[#007A3D]">
            Modul Saya
          </Link>
          <ChevronRight className="h-4 w-4 text-[#007A3D]" />
          <span className="font-medium text-[#3D4A3E]">{quiz.title || "Kuis Modul 1"}</span>
        </div>

        <div className="mt-8 flex items-start justify-between gap-8">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight text-[#1F1F1F]">
              Kuis Modul 1: Persiapan Mental
            </h1>
            <p className="mt-3 text-xl text-[#3D4A3E]">
              Pastikan Anda memilih jawaban yang paling tepat sesuai materi.
            </p>
          </div>

          <div className="mt-1 w-[216px] shrink-0 rounded-xl border border-[#BFD1C0] bg-[#F0EDED] p-4">
            <div className="flex items-center gap-1 text-base font-extrabold text-[#1F1F1F]">
              <span>Progres: 30%</span>
              <span className="text-[#007A3D]">
                {progressStep} dari {totalQuestions}
              </span>
            </div>
            <div className="mt-3 h-4 rounded-full bg-[#E1DEDC]">
              <div className="h-4 w-[30%] rounded-full bg-[#007A3D]" />
            </div>
          </div>
        </div>

        <section className="mt-9 rounded-xl border border-[#BFD1C0] bg-white p-10 shadow-[0_10px_30px_rgba(16,24,40,0.04)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF8928] text-2xl font-extrabold text-[#3A260A]">
              {questionNumber}
            </div>
            <h2 className="max-w-[820px] text-2xl font-extrabold leading-snug text-[#1F1F1F]">
              {question?.text}
            </h2>
          </div>

          <div className="mt-9 space-y-4 pl-1 md:pl-10">
            {(question?.options || []).map((option, index) => {
              const active = selected === index;
              return (
                <button
                  type="button"
                  key={`${option}-${index}`}
                  onClick={() => setSelected(index)}
                  className={`flex min-h-[84px] w-full items-center gap-6 rounded-xl border-2 px-6 text-left transition ${
                    active
                      ? "border-[#007A3D] bg-[#F4FFF0]"
                      : "border-[#BFD1C0] bg-white hover:border-[#007A3D]/60"
                  }`}
                >
                  <span className="h-8 w-8 rounded-full border-2 border-[#6C7B70] bg-white" />
                  <span className="w-8 shrink-0 font-extrabold text-[#007A3D]">
                    {answerLetters[index]}
                  </span>
                  <span className="text-xl leading-7 text-[#1F1F1F]">{option}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href={
              questionNumber > 1
                ? `/pelatihan/${course.id}/kuis?q=${questionNumber - 1}`
                : firstLessonHref
            }
            className="inline-flex h-16 min-w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-[#007A3D] px-8 text-lg font-extrabold text-[#007A3D]"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali
          </Link>

          <button
            type="button"
            onClick={handlePrimary}
            className="inline-flex h-16 min-w-[222px] items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-8 text-lg font-extrabold text-[#4B3009]"
          >
            {isFinishStep ? "Selesai" : "Lanjut"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </LearningLayout>
  );
}
