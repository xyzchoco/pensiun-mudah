// resources/js/Pages/Pelatihan/KelasSaya.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function KelasSaya(props) {
    /* --- DATA & DEFAULTS --- */
    const enrollment = props?.enrollment || {};

    const course = useMemo(() => {
        const c = enrollment?.course || {};
        return {
            id: c?.id || "pola-hidup-sehat-usia-50",
            title: c?.title || "Pola Hidup Sehat di Usia 50+",
            description:
                c?.description ||
                "Panduan komprehensif bagi Anda untuk menjaga kebugaran fisik, kesehatan mental, dan nutrisi optimal di masa purnabakti.",
            badge: c?.badge || "Terdaftar Secara Gratis",
            thumbnailUrl: c?.thumbnailUrl || undefined,
        };
    }, [enrollment]);

    const modules = useMemo(() => {
        if (
            Array.isArray(enrollment?.modules) &&
            enrollment.modules.length > 0
        ) {
            return enrollment.modules;
        }
        return [
            {
                id: "modul-1",
                title: "Modul 1 — Fondasi Hidup Sehat",
                subtitle:
                    "Memahami perubahan tubuh dan pola pikir sehat di usia 50+.",
                lessons: [
                    {
                        id: "1-1",
                        type: "video",
                        title: "Pengantar: Sehat di Masa Pensiun",
                        duration: "08:24",
                        done: true,
                    },
                    {
                        id: "1-2",
                        type: "video",
                        title: "Mitos & Fakta Kesehatan Lansia",
                        duration: "11:10",
                        done: true,
                    },
                    {
                        id: "1-3",
                        type: "reading",
                        title: "Bacaan: Checklist Gaya Hidup Sehat",
                        duration: "5 mnt",
                        done: false,
                    },
                    {
                        id: "1-4",
                        type: "resource",
                        title: "E-Book: Panduan Awal (PDF)",
                        duration: "2.4 MB",
                        done: false,
                    },
                ],
            },
            {
                id: "modul-2",
                title: "Modul 2 — Nutrisi & Pola Makan",
                subtitle:
                    "Menyusun menu seimbang dan kebiasaan makan yang menjaga energi.",
                lessons: [
                    {
                        id: "2-1",
                        type: "video",
                        title: "Gizi Seimbang untuk Usia 50+",
                        duration: "13:45",
                        done: false,
                    },
                    {
                        id: "2-2",
                        type: "reading",
                        title: "Bacaan: Daftar Makanan Ramah Jantung",
                        duration: "7 mnt",
                        done: false,
                    },
                    {
                        id: "2-3",
                        type: "resource",
                        title: "Template: Rencana Menu Mingguan",
                        duration: "1.1 MB",
                        done: false,
                    },
                ],
            },
            {
                id: "modul-3",
                title: "Modul 3 — Kebugaran & Keseimbangan Mental",
                subtitle:
                    "Olahraga ringan, manajemen stres, dan tidur berkualitas.",
                lessons: [
                    {
                        id: "3-1",
                        type: "video",
                        title: "Latihan Ringan Harian di Rumah",
                        duration: "15:02",
                        done: false,
                    },
                    {
                        id: "3-2",
                        type: "reading",
                        title: "Bacaan: Teknik Relaksasi & Mindfulness",
                        duration: "6 mnt",
                        done: false,
                    },
                    {
                        id: "3-3",
                        type: "resource",
                        title: "Audio: Panduan Meditasi Tidur",
                        duration: "9.8 MB",
                        done: false,
                    },
                ],
            },
        ];
    }, [enrollment]);

    const enrolledAt = enrollment?.enrolledAt || "17 Juni 2026";
    const estimatedDuration = enrollment?.estimatedDuration || "3 jam 20 menit";

    /* --- DERIVED STATS --- */
    const allLessons = useMemo(
        () => modules.flatMap((m) => m.lessons || []),
        [modules],
    );
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) => l.done).length;
    const remainingLessons = totalLessons - completedLessons;
    const totalVideos = allLessons.filter((l) => l.type === "video").length;
    const totalModules = modules.length;
    const progressPercent =
        typeof enrollment?.progressPercent === "number"
            ? enrollment.progressPercent
            : totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;
    const isCompleted = progressPercent >= 100;

    /* --- STATE --- */
    const [openModuleId, setOpenModuleId] = useState(modules[0]?.id || null);

    /* --- HELPERS --- */
    const toggleModule = (id) =>
        setOpenModuleId((prev) => (prev === id ? null : id));

    const moduleProgress = (mod) => {
        const lessons = mod?.lessons || [];
        if (lessons.length === 0) return 0;
        return Math.round(
            (lessons.filter((l) => l.done).length / lessons.length) * 100,
        );
    };

    const nextLesson = useMemo(
        () => allLessons.find((l) => !l.done) || allLessons[0],
        [allLessons],
    );

    const handleContinueLearning = () => {
        const lessonId = nextLesson?.id ? `?lesson=${nextLesson.id}` : "";
        router.visit(`/pelatihan/${course.id}/belajar${lessonId}`);
    };

    const handleDownloadModule = () => {
        router.visit(`/pelatihan/${course.id}/unduh`);
    };

    const handleCommunity = () => {
        router.visit(`/pelatihan/${course.id}/diskusi`);
    };

    const badgeLabel = isCompleted
        ? "Lulus"
        : progressPercent > 0
          ? "Sedang Belajar"
          : "Baru Mulai";

    const lessonTypeMeta = (type) => {
        if (type === "video")
            return { label: "Video", tone: "text-[#008740] bg-[#E9F7EF]" };
        if (type === "reading")
            return { label: "Bacaan", tone: "text-[#B54708] bg-[#FFF4E8]" };
        return { label: "Unduhan", tone: "text-[#475467] bg-[#F4F4F5]" };
    };

    /* --- ICONS --- */
    const LessonIcon = ({ type, done }) => {
        const base = "h-5 w-5";
        if (done) {
            return (
                <svg
                    className={`${base} text-[#027A48]`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" fill="#E9F7EF" />
                    <path
                        d="M8 12.5l2.5 2.5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        }
        if (type === "video") {
            return (
                <svg
                    className={`${base} text-[#008740]`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    />
                    <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
            );
        }
        if (type === "reading") {
            return (
                <svg
                    className={`${base} text-[#B54708]`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 5h9a2 2 0 012 2v12H7a2 2 0 01-2-2V5z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 9h6M8 12h6M8 15h4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            );
        }
        return (
            <svg
                className={`${base} text-[#475467]`}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5 19h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    /* --- RENDER --- */
    return (
        <DashboardLayout>
            <Head title={`Kelas Saya — ${course.title}`} />

            <div className="min-h-screen bg-[#FBFAF8]">
                <div className="mx-auto w-full max-w-6xl px-6 py-8">
                    {/* --- BACK NAV --- */}
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#00773A]"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M15.5 19L8.5 12l7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Kembali ke Dashboard</span>
                    </Link>

                    {/* --- 1. COURSE HEADER --- */}
                    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
                        <div className="grid grid-cols-1 md:grid-cols-12">
                            <div className="md:col-span-4">
                                <div className="relative h-48 w-full md:h-full">
                                    {course.thumbnailUrl ? (
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#008740] to-[#00773A]">
                                            <svg
                                                className="h-16 w-16 text-white/90"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M3 7l9-4 9 4-9 4-9-4z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M7 9.5V15c0 1.1 2.24 2.5 5 2.5s5-1.4 5-2.5V9.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-8">
                                <div className="flex h-full flex-col p-7">
                                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E9F7EF] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#027A48]">
                                        <span className="h-2 w-2 rounded-full bg-[#12B76A]" />
                                        {course.badge}
                                    </span>

                                    <h1 className="mt-4 text-2xl font-extrabold text-[#101828]">
                                        {course.title}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                                        {course.description}
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
                                                Progres Belajar
                                            </p>
                                            <p className="text-2xl font-extrabold text-[#008740]">
                                                {progressPercent}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
                                                Status
                                            </p>
                                            <p className="text-sm font-bold text-[#101828]">
                                                {badgeLabel}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={handleContinueLearning}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#F57F1E] focus:outline-none focus:ring-4 focus:ring-[#FF8928]/25"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M8 6l10 6-10 6V6z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            {progressPercent > 0
                                                ? "Lanjutkan Belajar"
                                                : "Mulai Belajar Sekarang"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- MAIN GRID --- */}
                    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* --- LEFT COLUMN --- */}
                        <div className="space-y-8 lg:col-span-8">
                            {/* --- 2. LEARNING PROGRESS --- */}
                            <section className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-lg font-extrabold text-[#101828]">
                                        Progres Pembelajaran
                                    </h2>
                                    <span className="text-sm font-extrabold text-[#008740]">
                                        {progressPercent}%
                                    </span>
                                </div>

                                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#F4F4F5]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#008740] to-[#12B76A] transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-xl bg-[#E9F7EF] p-4">
                                        <p className="text-xs font-semibold text-[#027A48]">
                                            Materi Selesai
                                        </p>
                                        <p className="mt-1 text-xl font-extrabold text-[#027A48]">
                                            {completedLessons}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#FFF4E8] p-4">
                                        <p className="text-xs font-semibold text-[#B54708]">
                                            Materi Tersisa
                                        </p>
                                        <p className="mt-1 text-xl font-extrabold text-[#B54708]">
                                            {remainingLessons}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#F4F4F5] p-4">
                                        <p className="text-xs font-semibold text-[#475467]">
                                            Estimasi Durasi
                                        </p>
                                        <p className="mt-1 text-xl font-extrabold text-[#101828]">
                                            {estimatedDuration}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* --- 3. COURSE CURRICULUM --- */}
                            <section className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
                                <h2 className="text-lg font-extrabold text-[#101828]">
                                    Kurikulum Kursus
                                </h2>
                                <p className="mt-1 text-sm text-[#667085]">
                                    {totalModules} modul · {totalLessons} materi
                                    belajar
                                </p>

                                <div className="mt-5 space-y-3">
                                    {modules.map((mod, index) => {
                                        const isOpen = openModuleId === mod.id;
                                        const modPercent = moduleProgress(mod);
                                        return (
                                            <div
                                                key={mod.id}
                                                className="overflow-hidden rounded-2xl border border-[#E4E7EC]"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleModule(mod.id)
                                                    }
                                                    aria-expanded={isOpen}
                                                    className="flex w-full items-center gap-4 bg-white px-5 py-4 text-left transition hover:bg-[#FBFAF8]"
                                                >
                                                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E9F7EF] text-sm font-extrabold text-[#008740]">
                                                        {index + 1}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-extrabold text-[#101828]">
                                                            {mod.title}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs text-[#667085]">
                                                            {mod.subtitle}
                                                        </span>
                                                    </span>
                                                    <span className="hidden shrink-0 text-xs font-bold text-[#008740] sm:inline">
                                                        {modPercent}%
                                                    </span>
                                                    <svg
                                                        className={`h-5 w-5 shrink-0 text-[#98A2B3] transition-transform ${isOpen ? "rotate-180" : ""}`}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M6 9l6 6 6-6"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </button>

                                                {isOpen ? (
                                                    <ul className="divide-y divide-[#F2F4F7] border-t border-[#E4E7EC] bg-[#FBFAF8]">
                                                        {(
                                                            mod.lessons || []
                                                        ).map((lesson) => {
                                                            const meta =
                                                                lessonTypeMeta(
                                                                    lesson.type,
                                                                );
                                                            return (
                                                                <li
                                                                    key={
                                                                        lesson.id
                                                                    }
                                                                    className="flex items-center gap-4 px-5 py-3"
                                                                >
                                                                    <LessonIcon
                                                                        type={
                                                                            lesson.type
                                                                        }
                                                                        done={
                                                                            lesson.done
                                                                        }
                                                                    />
                                                                    <span className="min-w-0 flex-1">
                                                                        <span className="block truncate text-sm font-semibold text-[#101828]">
                                                                            {
                                                                                lesson.title
                                                                            }
                                                                        </span>
                                                                        <span className="mt-0.5 inline-flex items-center gap-2">
                                                                            <span
                                                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${meta.tone}`}
                                                                            >
                                                                                {
                                                                                    meta.label
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-[#98A2B3]">
                                                                                {
                                                                                    lesson.duration
                                                                                }
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                `/pelatihan/${course.id}/belajar?lesson=${lesson.id}`,
                                                                            )
                                                                        }
                                                                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-[#008740] transition hover:bg-[#E9F7EF]"
                                                                    >
                                                                        {lesson.done
                                                                            ? "Ulangi"
                                                                            : "Buka"}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* --- 4. LEARNING ACTIONS --- */}
                            <section className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
                                <h2 className="text-lg font-extrabold text-[#101828]">
                                    Aksi Belajar
                                </h2>
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <button
                                        type="button"
                                        onClick={handleContinueLearning}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008740] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#00773A] focus:outline-none focus:ring-4 focus:ring-[#008740]/25"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M8 6l10 6-10 6V6z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Lanjutkan Belajar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownloadModule}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#008740] px-4 py-3 text-sm font-extrabold text-[#008740] transition hover:bg-[#E9F7EF]"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 19h14"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Unduh Modul
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCommunity}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#FF8928] px-4 py-3 text-sm font-extrabold text-[#B54708] transition hover:bg-[#FFF4E8]"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M5 6h14a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3a2 2 0 01-2-2V8a2 2 0 012-2z"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Diskusi Komunitas
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* --- RIGHT COLUMN (SIDEBAR) --- */}
                        <div className="space-y-6 lg:col-span-4">
                            {/* --- 5. ACHIEVEMENT SECTION --- */}
                            <section className="rounded-2xl bg-gradient-to-br from-[#008740] to-[#00773A] p-7 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                        <svg
                                            className="h-7 w-7"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M8 4h8v5a4 4 0 11-8 0V4z"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M9 20h6M12 14v6M6 6H4v1a3 3 0 003 3M18 6h2v1a3 3 0 01-3 3"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                                            Pencapaian
                                        </p>
                                        <p className="text-lg font-extrabold">
                                            {badgeLabel}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-white/80">
                                            Penyelesaian
                                        </span>
                                        <span className="font-extrabold">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                                        <div
                                            className="h-full rounded-full bg-[#FF8928] transition-all duration-500"
                                            style={{
                                                width: `${progressPercent}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/10 p-4">
                                    <svg
                                        className="h-6 w-6 text-[#FFD7B5]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="4"
                                            y="5"
                                            width="16"
                                            height="12"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                        <path
                                            d="M8 20l4-2 4 2"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="11"
                                            r="2.5"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-extrabold">
                                            Sertifikat
                                        </p>
                                        <p className="text-xs text-white/70">
                                            {isCompleted
                                                ? "Siap diunduh"
                                                : "Selesaikan semua materi untuk membuka sertifikat"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* --- 6. SIDEBAR SUMMARY --- */}
                            <section className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
                                <h2 className="text-lg font-extrabold text-[#101828]">
                                    Ringkasan Kelas
                                </h2>
                                <dl className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-[#667085]">
                                            Total Video
                                        </dt>
                                        <dd className="text-sm font-bold text-[#101828]">
                                            {totalVideos} video
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-[#667085]">
                                            Total Modul
                                        </dt>
                                        <dd className="text-sm font-bold text-[#101828]">
                                            {totalModules} modul
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-[#667085]">
                                            Total Durasi
                                        </dt>
                                        <dd className="text-sm font-bold text-[#101828]">
                                            {estimatedDuration}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-[#667085]">
                                            Tanggal Pendaftaran
                                        </dt>
                                        <dd className="text-sm font-bold text-[#101828]">
                                            {enrolledAt}
                                        </dd>
                                    </div>
                                </dl>

                                <Link
                                    href="/beli-pelatihan"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#FBFAF8] px-4 py-3 text-sm font-bold text-[#008740] ring-1 ring-[#008740]/20 transition hover:bg-[#E9F7EF]"
                                >
                                    Jelajahi Kursus Lain
                                </Link>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
