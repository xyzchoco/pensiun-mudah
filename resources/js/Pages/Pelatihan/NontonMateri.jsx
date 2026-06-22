import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FileText,
  Maximize,
  Play,
  Settings,
  Volume2,
} from "lucide-react";
import LearningLayout from "@/Components/Pelatihan/LearningLayout";
import KurikulumSidebar from "@/Components/Pelatihan/KurikulumSidebar";
import { flattenMaterials, normalizeLearning } from "./learningContent";

export default function NontonMateri({ learning }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { url } = usePage();
  const { course, modules, progress } = normalizeLearning(learning);
  const params = new URLSearchParams(url.split("?")[1] || "");
  const materials = flattenMaterials(modules);
  const requestedLesson = params.get("lesson");
  const activeMaterial =
    materials.find((item) => String(item.id) === String(requestedLesson)) ||
    materials[0];
  const activeIndex = Math.max(
    materials.findIndex(
      (item) => String(item.id) === String(activeMaterial?.id),
    ),
    0,
  );
  const nextMaterial = materials[activeIndex + 1];
  const nextHref = nextMaterial
    ? `/pelatihan/${course.id}/belajar?lesson=${nextMaterial.id}`
    : `/pelatihan/${course.id}/kuis`;

  return (
    <LearningLayout showHeaderBack alignHeaderContentLeft backHref="/pelatihan">
      <Head title={`${activeMaterial?.title || "Materi"} - Pensiun Mudah`} />

      <div
        className={`flex min-h-[1030px] border-b border-[#BFD1C0] transition-[padding] duration-300 ${
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[320px]"
        }`}
      >
        <KurikulumSidebar
          modules={modules}
          progress={progress}
          courseId={course.id}
          activeMaterialId={activeMaterial?.id}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />

        <main className="flex-1 bg-white">
          <section className="relative border-b-4 border-black bg-[#183B28]">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="absolute inset-0 h-full w-full object-cover opacity-45"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,.14),transparent_32%),linear-gradient(135deg,#1B5036,#10251B)]" />
            )}
            <div className="relative flex aspect-video min-h-[420px] items-center justify-center overflow-hidden">
              <button
                type="button"
                className="flex h-24 w-24 items-center justify-center rounded-full bg-[#008740] text-white shadow-xl transition hover:scale-105"
                aria-label="Putar video"
              >
                <Play className="ml-1 h-12 w-12 fill-current" />
              </button>

              <div className="absolute inset-x-6 bottom-5">
                <div className="h-1.5 rounded-full bg-white/25">
                  <div className="relative h-1.5 w-[45%] rounded-full bg-[#FF8928]">
                    <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-5">
                    <Play className="h-5 w-5 fill-current" />
                    <Volume2 className="h-5 w-5" />
                    <span className="text-sm font-medium">10:45 / 32:00</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <Settings className="h-5 w-5" />
                    <Maximize className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <article className="mx-auto max-w-[910px] px-8 py-16">
            <h1 className="text-[32px] font-extrabold leading-tight text-[#111827]">
              {activeMaterial?.title ||
                "Materi 1: Menemukan Ikigai Baru di Masa Pensiun"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#667085]">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" /> Durasi:{" "}
                {activeMaterial?.duration || "24 Menit"}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> PDF Tersedia
              </span>
            </div>

            <hr className="my-8 border-[#E4E7EC]" />

            <div className="space-y-7 text-lg leading-8 text-[#344054]">
              <p className="text-[22px] font-medium leading-9 text-[#1F2937]">
                Pensiun bukanlah akhir dari produktivitas, melainkan awal dari
                babak baru untuk mengejar apa yang benar-benar Anda cintai.
              </p>
              <p>
                Konsep Ikigai berasal dari Jepang yang berarti "alasan untuk
                bangun di pagi hari". Bagi banyak pensiunan, tantangan terbesar
                adalah kehilangan rutinitas kerja yang selama ini mendefinisikan
                identitas mereka. Dalam materi ini, kita akan mempelajari
                bagaimana memetakan kembali empat elemen kunci:
              </p>
              <div className="pl-6">
                <p>Apa yang Anda cintai (Passion)</p>
                <p>Apa yang Anda kuasai (Mission)</p>
                <p>Apa yang dunia butuhkan (Vocation)</p>
                <p>Apa yang membuat Anda tetap berdaya (Profession/Value)</p>
              </div>
              <p>
                Dengan menemukan titik temu di antara keempatnya, masa pensiun
                Anda tidak hanya akan diisi dengan istirahat, tetapi dengan
                kegembiraan yang bermakna bagi diri sendiri dan lingkungan
                sekitar.
              </p>
            </div>

            <hr className="my-10 border-[#E4E7EC]" />

            <div className="flex items-center justify-between gap-4">
              <Link
                href={
                  activeIndex > 0
                    ? `/pelatihan/${course.id}/belajar?lesson=${materials[activeIndex - 1].id}`
                    : "/pelatihan"
                }
                className="inline-flex min-w-[245px] items-center justify-center gap-3 rounded-lg border-2 border-[#00A553] px-6 py-4 font-extrabold text-[#00A553]"
              >
                <ArrowLeft className="h-5 w-5" />
                Materi Sebelumnya
              </Link>
              <Link
                href={nextHref}
                className="inline-flex min-w-[240px] items-center justify-center gap-3 rounded-lg bg-[#FF9200] px-6 py-4 font-extrabold text-white"
              >
                Materi Selanjutnya
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </main>
      </div>
    </LearningLayout>
  );
}
