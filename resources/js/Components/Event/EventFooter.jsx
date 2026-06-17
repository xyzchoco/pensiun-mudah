// Footer reusable buat modul event (samain brand Pensiun Mudah)
export default function EventFooter() {
    return (
        <footer className="bg-[#F3F2F0] border-t border-[#E4E2E1] mt-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* --- 1. TENTANG --- */}
                    <div>
                        <h3 className="font-bold text-[#008740] mb-4">
                            Pensiun Mudah
                        </h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
                            Membimbing profesional berpengalaman menuju masa
                            pensiun yang lebih bermakna, sehat, dan sejahtera
                            melalui ekosistem belajar yang ramah senior.
                        </p>
                    </div>

                    {/* --- 2. KONTAK --- */}
                    <div>
                        <h3 className="font-bold text-[#1B1C1C] mb-4">
                            Kontak
                        </h3>
                        <ul className="space-y-3 text-sm text-[#6B7280]">
                            <li className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                info@pensiunmudah.id
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.5 1.2l-1.7.85a11 11 0 005.5 5.5l.85-1.7a1 1 0 011.2-.5l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C8.6 21 3 15.4 3 8V5z"
                                    />
                                </svg>
                                +62 21 1234 5678
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
                                    />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                Jakarta, Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* --- 3. SOSIAL --- */}
                    <div>
                        <h3 className="font-bold text-[#1B1C1C] mb-4">
                            Ikuti Kami
                        </h3>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E4E2E1] text-[#6B7280] hover:text-[#008740] transition-colors"
                                aria-label="Website"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E4E2E1] text-[#6B7280] hover:text-[#008740] transition-colors"
                                aria-label="Bagikan"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="6" cy="12" r="2.5" />
                                    <circle cx="18" cy="6" r="2.5" />
                                    <circle cx="18" cy="18" r="2.5" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- COPYRIGHT --- */}
                <div className="border-t border-[#E4E2E1] mt-10 pt-6">
                    <p className="text-center text-sm text-[#6B7280]">
                        © 2026 Pensiun Mudah. Seluruh hak cipta dilindungi.
                        Investasi Masa Tua yang Bermakna.
                    </p>
                </div>
            </div>
        </footer>
    );
}
