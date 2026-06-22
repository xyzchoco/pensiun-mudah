import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { ImageIcon, Play } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Footer from "@/Components/Footer";

const ongoingFallback = [
  {
    id: 1,
    category: "Keuangan",
    title: "Literasi Keuangan Masa Pensiun",
    progress: 65,
    image: "",
  },
  {
    id: 2,
    category: "Kesehatan",
    title: "Kesehatan Fisik di Usia Emas",
    progress: 30,
    image: "",
  },
  {
    id: 3,
    category: "Hobi",
    title: "Berkebun Organik di Rumah",
    progress: 85,
    image: "",
  },
  {
    id: 4,
    category: "Sosial",
    title: "Membangun Komunitas di Masa",
    progress: 15,
    image: "",
  },
];

const completedFallback = [
  {
    id: 5,
    category: "Keuangan",
    title: "Literasi Keuangan Masa Pensiun",
    image: "",
  },
  {
    id: 6,
    category: "Kesehatan",
    title: "Kesehatan Fisik di Usia Emas",
    image: "",
  },
  {
    id: 7,
    category: "Hobi",
    title: "Berkebun Organik di Rumah",
    image: "",
  },
  {
    id: 8,
    category: "Sosial",
    title: "Membangun Komunitas di Masa",
    image: "",
  },
  {
    id: 9,
    category: "Sosial",
    title: "Membangun Komunitas di Masa",
    image: "",
  },
  {
    id: 10,
    category: "Sosial",
    title: "Membangun Komunitas di Masa",
    image: "",
  },
];

function normalizeCourse(course) {
  const image = course.image || course.thumbnail || "";
  return {
    ...course,
    category: course.category || course.kategori || "Umum",
    image: image.includes("course-preview.png") ? "" : image,
    progress: Number(course.progress || 0),
  };
}

function CourseThumb({ src, alt }) {
  if (src) {
    return <img src={src} alt={alt} className="h-[176px] w-full object-cover" />;
  }

  return (
    <div className="flex h-[176px] w-full items-center justify-center bg-[#F3F2F0] text-[#B8B4B2]">
      <ImageIcon className="h-9 w-9" />
    </div>
  );
}

function CourseCard({ course, tab }) {
  const isOngoing = tab === "berjalan";

  return (
    <article className="overflow-hidden rounded-lg border border-[#E4E2E1] bg-white shadow-sm">
      <div className="relative">
        <CourseThumb src={course.image} alt={course.title} />
        <span className="absolute left-4 top-4 rounded-full bg-[#007A3D] px-4 py-2 text-xs font-extrabold text-white">
          {course.category}
        </span>
      </div>

      <div className="p-6">
        <h2 className="min-h-[76px] text-[26px] font-extrabold leading-tight text-[#1F1F1F]">
          {course.title}
        </h2>

        {isOngoing ? (
          <>
            <div className="mt-4 flex items-center justify-between text-base font-extrabold">
              <span className="text-[#3D4A3E]">Progres Belajar</span>
              <span className="text-[#007A3D]">{course.progress}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-[#E7E4E2]">
              <div
                className="h-3 rounded-full bg-[#007A3D]"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <Link
              href={`/pelatihan/${course.id}/kelas`}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] text-lg font-extrabold text-[#4B3009] transition hover:bg-[#F57F1E]"
            >
              <Play className="h-5 w-5" />
              Lanjutkan Belajar
            </Link>
          </>
        ) : (
          <div className="mt-3 space-y-4">
            <Link
              href="/sertifikat"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] text-lg font-extrabold text-[#4B3009] transition hover:bg-[#F57F1E]"
            >
              <Play className="h-5 w-5" />
              Unduh Sertifikat
            </Link>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-[#007A3D] text-lg font-extrabold text-[#007A3D]"
            >
              Beri Penilaian
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Pelatihan({ ongoingCourses = [], completedCourses = [] }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || "Budi Santoso";
  const [tab, setTab] = useState("berjalan");
  const ongoing = (ongoingCourses.length ? ongoingCourses : ongoingFallback).map(
    normalizeCourse,
  );
  const completed = (
    completedCourses.length ? completedCourses : completedFallback
  ).map(normalizeCourse);
  const list = tab === "berjalan" ? ongoing : completed;

  return (
    <DashboardLayout title="Pelatihan" showSearch={false}>
      <Head title="Pelatihan" />

      <div className="mx-auto max-w-[908px] pb-8">
        <h1 className="text-[34px] font-extrabold leading-tight text-[#1F1F1F]">
          Halo, {userName}
        </h1>
        <p className="mt-3 max-w-[640px] text-xl leading-8 text-[#3D4A3E]">
          Lanjutkan Pelatihan Anda hari ini untuk masa pensiun yang lebih
          bermakna.
        </p>

        <div className="mt-9 border-b border-[#E1DEDC]">
          <div className="flex gap-16">
            <button
              type="button"
              onClick={() => setTab("berjalan")}
              className={`px-6 pb-4 text-lg font-extrabold ${
                tab === "berjalan"
                  ? "border-b-4 border-[#007A3D] text-[#007A3D]"
                  : "text-[#3D4A3E]"
              }`}
            >
              Sedang Berjalan ({ongoing.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("selesai")}
              className={`px-6 pb-4 text-lg font-extrabold ${
                tab === "selesai"
                  ? "border-b-4 border-[#007A3D] text-[#007A3D]"
                  : "text-[#3D4A3E]"
              }`}
            >
              Selesai ({completed.length})
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((course) => (
            <CourseCard key={course.id} course={course} tab={tab} />
          ))}
        </div>
      </div>

      <div className="-mx-8 -mb-8 mt-8">
        <Footer />
      </div>
    </DashboardLayout>
  );
}
