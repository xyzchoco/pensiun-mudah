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

export default function NontonMateri({ learning }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { url } = usePage();

  const { course, modules, progress } = learning;

  const materials = modules.flatMap((modul) => modul.materials || []);

  const params = new URLSearchParams(url.split("?")[1] || "");
  const requestedLesson = params.get("lesson");

  const activeMaterial =
    materials.find((item) => String(item.id) === String(requestedLesson)) ||
    materials[0];

  const activeIndex = Math.max(
    materials.findIndex(
      (item) => String(item.id) === String(activeMaterial?.id)
    ),
    0
  );

  const prevMaterial = materials[activeIndex - 1];
  const nextMaterial = materials[activeIndex + 1];

  const prevHref = prevMaterial
    ? `/pelatihan/${course.id}/belajar?lesson=${prevMaterial.id}`
    : `/pelatihan/${course.id}/kelas`;

  const nextHref = nextMaterial
    ? `/pelatihan/${course.id}/belajar?lesson=${nextMaterial.id}`
    : `/pelatihan/${course.id}/kuis`;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // DETEKTOR SAKTI: Cek aja kalau URL video-nya ada isinya, anggep itu video!
  const isVideo = activeMaterial?.type?.toLowerCase().includes('video') || activeMaterial?.video_url;

  // Cari tau materi ini ada di modul mana (Buat nampilin Deskripsi Modul lu)
  const activeModule = modules.find(m => m.materials?.some(mat => mat.id === activeMaterial?.id));

  return (
    <LearningLayout
      showHeaderBack
      alignHeaderContentLeft
      backHref="/pelatihan"
      footerWrapperClassName={`transition-[padding] duration-300 ${
        sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[320px]"
      }`}
    >
      <Head title={`${activeMaterial?.title || "Materi"} - Pensiun Mudah`} />

      <div
        className={`flex min-h-[1030px] border-b border-[#BFD1C0] transition-[padding] duration-300 ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[320px]"}`}
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
            <div className="relative flex aspect-video min-h-[420px] items-center justify-center overflow-hidden">
              {isVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {activeMaterial?.video_url ? (
                    <iframe
                      className="w-full h-full aspect-video"
                      src={getYouTubeEmbedUrl(activeMaterial.video_url)}
                      title={activeMaterial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-white text-center">
                      <Play className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm text-gray-400">Link video belum di-input di admin panel</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,.14),transparent_32%),linear-gradient(135deg,#1B5036,#10251B)] flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 mb-4 text-[#FF8928]" />
                  <p className="text-xl font-bold text-white">Mode Membaca Artikel</p>
                  <p className="text-sm text-gray-300 mt-1">Silakan baca materi lengkap di bawah</p>
                </div>
              )}
            </div>
          </section>

          <article className="mx-auto max-w-[910px] px-8 py-16">
            <h1 className="text-[32px] font-extrabold leading-tight text-[#111827]">
              {activeMaterial?.title || "Judul Materi"}
            </h1>

            {/* MUNCULIN DESKRIPSI MODUL DI SINI BIAR KELIATAN */}
            {activeModule?.subtitle && (
              <p className="text-[#007A3D] font-medium mt-2 text-lg">
                Modul: {activeModule.subtitle}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#667085]">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" /> Durasi: {activeMaterial?.duration || "0 Menit"}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> {isVideo ? 'Video Materi' : 'PDF / Teks Tersedia'}
              </span>
            </div>

            <hr className="my-8 border-[#E4E7EC]" />

            <div className="space-y-7 text-lg leading-8 text-[#344054]">
              {activeMaterial?.konten ? (
                <div
                  className="prose max-w-none text-[#344054]"
                  dangerouslySetInnerHTML={{ __html: activeMaterial.konten }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-[22px] font-medium leading-9 text-gray-400">
                    Belum ada artikel pendamping untuk materi ini.
                  </p>
                  <p className="text-sm text-gray-300 mt-2">(Kolom "Konten/Artikel" di Filament masih kosong)</p>
                </div>
              )}
            </div>

            <hr className="my-10 border-[#E4E7EC]" />

            <div className="flex items-center justify-between gap-4">
              <Link
                href={prevHref}
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
