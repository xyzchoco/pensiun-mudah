import { Link } from '@inertiajs/react';

// Kartu sertifikat buat grid di halaman "Sertifikat Saya" (klik -> halaman detail)
export default function CertificateCard({ id, title, date, image }) {
    return (
        <Link
            href={`/sertifikat/${id}`}
            className="group bg-white border border-[#E4E2E1] rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
        >
            {/* --- BINGKAI GAMBAR SERTIFIKAT --- */}
            <div className="w-full overflow-hidden rounded-2xl border border-[#E4E2E1] bg-[#FBF9F8]">
                <img
                    src={image || '/images/cert-sample.png'}
                    alt={title}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* --- JUDUL --- */}
            <h3 className="mt-5 text-lg font-bold text-[#1B1C1C] leading-snug">
                {title}
            </h3>

            {/* --- TANGGAL TERBIT --- */}
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[#6B7280]">
                <svg
                    className="w-4 h-4 text-[#008740]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                    />
                </svg>
                Diterbitkan pada {date}
            </p>

            {/* --- AKSI --- */}
            <span className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#008740] py-3 font-bold text-white group-hover:bg-[#006B32] transition-colors">
                Lihat Sertifikat
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </span>
        </Link>
    );
}
