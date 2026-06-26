import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  HelpCircle,
  List,
  Lock,
  Play,
  X,
} from "lucide-react";

function materialIcon(material, active) {
  if (material.done) return <CheckCircle2 className="h-4 w-4 text-[#00A96B]" />;
  if (active) return <Play className="h-4 w-4 text-[#00A96B]" />;
  return <Circle className="h-4 w-4 text-[#B7C2BB]" />;
}

export default function KurikulumSidebar({
  modules,
  progress,
  courseId,
  activeMaterialId,
  collapsed = false,
  onToggleCollapsed,
}) {
  const [open, setOpen] = useState(false);

  const body = (
    <>
      <div className="px-4 py-5">
        <h2 className="text-xl font-extrabold text-[#1F2937]">
          Kurikulum Kursus
        </h2>
        <p className="mt-1 text-base text-[#6B7280]">
          Progress: {progress}% selesai
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-[#E7E4E2]">
          <div
            className="h-2 rounded-full bg-[#00A96B]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <nav>
        {modules.map((module, index) => {
          const isFirst = index === 0;
          return (
            <section key={module.id} className="border-t border-[#ECEDEA]">
              <div
                className={`flex min-h-[82px] items-center justify-between px-4 py-4 font-bold ${isFirst ? "bg-[#E9F7EF] text-[#00A553]" : "text-[#344054]"
                  }`}
              >
                <span className="max-w-[230px] leading-7">{module.title}</span>
                {isFirst ? (
                  <ChevronDown className="h-5 w-5 text-[#00A553]" />
                ) : (
                  <Lock className="h-4 w-4 text-[#9AA6A0]" />
                )}
              </div>

              {isFirst ? (
                <div className="border-l-4 border-[#00A553]">
                  {(module.materials || []).map((material) => {
                    const active = String(material.id) === String(activeMaterialId);

                    // Logika penguncian materi
                    const isLocked = !material.is_accessible;

                    return (
                      <Link
                        key={material.id}
                        // Kalau terkunci, arahkan ke '#' saja biar link-nya mati
                        href={isLocked ? '#' : `/pelatihan/${courseId}/belajar?lesson=${material.id}`}
                        // Tambahin class cursor-not-allowed & opacity kalau terkunci
                        className={`flex items-start gap-3 px-8 py-3 text-sm leading-6 transition-all ${active
                            ? "bg-[#F4FFF7] font-semibold text-[#00A553]"
                            : "text-[#475467] hover:bg-[#FBFAF8]"
                          } ${isLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        onClick={(e) => isLocked && e.preventDefault()}
                      >
                        <span className="mt-1">
                          {/* Kalau terkunci, ganti ikon jadi Lock, kalau nggak, pakai fungsi icon lu */}
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-[#9AA6A0]" />
                          ) : (
                            materialIcon(material, active)
                          )}
                        </span>
                        <span className="flex-1 flex items-center justify-between">
                          {material.title}
                          {isLocked && <Lock className="h-3 w-3 ml-2 text-[#9AA6A0]" />}
                        </span>
                      </Link>
                    );
                  })}

                  {/* Tombol Quiz juga bisa lu kunci kalau mau */}
                  {module.quiz ? (
                    <Link
                      href={`/pelatihan/${courseId}/kuis`}
                      className="flex items-center gap-3 px-8 py-3 text-sm font-semibold text-[#FF8A00] hover:bg-[#FFF4E8]"
                    >
                      <HelpCircle className="h-4 w-4" />
                      {module.quiz.title || "Quiz Modul"}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside
        className={`hidden shrink-0 border-r border-[#E1E2DF] bg-white transition-all duration-300 lg:fixed lg:bottom-0 lg:left-0 lg:top-[72px] lg:z-20 lg:block lg:h-[calc(100vh-72px)] ${collapsed ? "lg:w-[72px]" : "lg:w-[320px] lg:overflow-y-auto"
          }`}
      >
        <div className="sticky top-0 z-10 flex justify-end border-b border-[#ECEDEA] bg-white px-4 py-3">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            aria-expanded={!collapsed}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#475467] transition hover:bg-[#F0EDED] hover:text-[#00A553]"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {collapsed ? (
          <div className="flex h-[calc(100%-65px)] flex-col items-center gap-4 px-3 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F7EF] text-[#00A553]">
              <List className="h-5 w-5" />
            </div>
            <div className="h-28 w-2 overflow-hidden rounded-full bg-[#E7E4E2]">
              <div
                className="w-full rounded-full bg-[#00A96B]"
                style={{ height: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          body
        )}
      </aside>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#00A553] px-5 py-3 font-bold text-white shadow-lg lg:hidden"
      >
        <List className="h-5 w-5" />
        Daftar Materi
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[85%] overflow-y-auto bg-white shadow-xl">
            <div className="flex justify-end border-b border-[#ECEDEA] px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="rounded-lg p-1 text-[#475467] hover:bg-[#F0EDED]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {body}
          </aside>
        </div>
      ) : null}
    </>
  );
}
