// Info sertifikat di bawah preview (judul + tanggal terbit + deskripsi)
export default function CertificateInfo({ title, issueDate, description }) {
    return (
        <div className="mt-8 text-center">
            {/* --- JUDUL --- */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#008740]">
                {title}
            </h1>

            {/* --- TANGGAL TERBIT --- */}
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-[#6B7280]">
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
                Diterbitkan pada {issueDate}
            </p>

            {/* --- DESKRIPSI --- */}
            <p className="mt-5 mx-auto max-w-xl text-[#6B7280] leading-relaxed">
                {description}
            </p>
        </div>
    );
}
