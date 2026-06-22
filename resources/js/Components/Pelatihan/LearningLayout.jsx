import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Bell, Globe2, Mail, MapPin, Phone, Share2 } from "lucide-react";

function initials(name) {
  return (name || "PM")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LearningHeader({
  backHref = "/pelatihan",
  showHeaderBack = false,
  alignContentLeft = false,
}) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || "Budi Santoso";
  const containerClass = alignContentLeft
    ? "flex h-full w-full items-center"
    : "mx-auto flex h-full max-w-[1188px] items-center justify-between px-8";
  const logoClass = alignContentLeft
    ? "flex h-full w-[320px] shrink-0 items-center px-8"
    : "flex items-center";
  const backLinkClass = alignContentLeft
    ? "hidden min-w-[300px] items-center gap-4 self-stretch border-x border-[#F0EDED] pl-8 pr-10 text-lg font-bold text-[#007A3D] md:flex"
    : "hidden min-w-[346px] items-center gap-4 self-stretch border-x border-[#F0EDED] px-16 text-lg font-bold text-[#007A3D] md:flex";
  const userClass = alignContentLeft
    ? "ml-auto flex items-center gap-4 px-8"
    : "flex items-center gap-4";

  return (
    <header className="h-[72px] border-b border-[#C9D8C9] bg-white">
      <div className={containerClass}>
        <Link href="/" className={logoClass}>
          <img src="/images/logo.png" alt="Pensiun Mudah" className="h-12 w-auto" />
        </Link>

        {showHeaderBack ? (
          <Link
            href={backHref}
            className={backLinkClass}
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali Pelatihan
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className={userClass}>
          <button
            type="button"
            className="relative rounded-full p-2 text-[#6F7A70] transition hover:bg-[#F4F2F1]"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
          </button>
          <div className="h-8 w-px bg-[#E4E2E1]" />
          <div className="text-right">
            <p className="text-sm font-extrabold text-[#1F1F1F]">{userName}</p>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#007A3D]">
              Premium Member
            </p>
          </div>
          {auth?.user?.avatar ? (
            <img
              src={auth.user.avatar}
              alt={userName}
              className="h-10 w-10 rounded-full border-2 border-[#007A3D]/30 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#007A3D]/30 bg-[#007A3D] text-sm font-bold text-white">
              {initials(userName)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function LearningFooter() {
  return (
    <footer className="border-t border-[#BFD1C0] bg-[#E7E4E2]">
      <div className="mx-auto max-w-[1188px] px-8 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-bold text-[#007A3D]">Pensiun Mudah</h3>
            <p className="mt-6 max-w-[230px] text-base leading-7 text-[#3D4A3E]">
              Membimbing profesional berpengalaman menuju masa pensiun yang lebih
              bermakna, sehat, dan sejahtera melalui ekosistem belajar yang ramah
              senior.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1F1F1F]">Kontak</h3>
            <div className="mt-7 space-y-5 text-base text-[#3D4A3E]">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@pensiunmudah.id
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +62 21 1234 5678
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Jakarta, Indonesia
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-[#1F1F1F]">Ikuti Kami</h3>
            <div className="mt-7 flex gap-4">
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFD1C0] bg-white text-[#1F1F1F]"
                aria-label="Website Pensiun Mudah"
              >
                <Globe2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFD1C0] bg-white text-[#1F1F1F]"
                aria-label="Bagikan Pensiun Mudah"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#BFD1C0] pt-8">
          <p className="text-base text-[#3D4A3E]">
            © 2026 Pensiun Mudah. Seluruh hak cipta dilindungi. Investasi Masa
            Tua yang Bermakna.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LearningLayout({
  children,
  backHref = "/pelatihan",
  showHeaderBack = false,
  alignHeaderContentLeft = false,
  withFooter = true,
}) {
  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#1F1F1F]">
      <LearningHeader
        backHref={backHref}
        showHeaderBack={showHeaderBack}
        alignContentLeft={alignHeaderContentLeft}
      />
      {children}
      {withFooter ? <LearningFooter /> : null}
    </div>
  );
}
