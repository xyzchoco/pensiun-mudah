import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const accessCodeTips = [
    'Pastikan kode terdiri dari 8 karakter alfanumerik.',
    'Perhatikan penggunaan huruf besar dan kecil.',
    'Kode biasanya dikirimkan melalui email resmi korporat.',
];

export default function GabungKelas({
    status = 'success',
    courseName = 'Strategi Perencanaan Keuangan Masa Pensiun',
    transactionId = 'PM-2023-88210',
    learnHref = '/pelatihan',
    retryHref = '/gabung-kelas',
}) {
    const isSuccess = status === 'success';

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head
                title={
                    isSuccess
                        ? 'Berhasil Bergabung - Pensiun Mudah'
                        : 'Gagal Bergabung - Pensiun Mudah'
                }
            />
            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 12H5M12 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali ke Dashboard
                    </Link>

                    <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[#E4E2E1] bg-white p-8 text-center shadow-sm sm:p-10">
                        {isSuccess ? (
                            <>
                                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                                    <span className="absolute inset-0 rounded-full bg-[#006B32]/15" />
                                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#006B32]">
                                        <svg
                                            className="h-9 w-9 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                </div>

                                <h1 className="mt-6 font-['Atkinson_Hyperlegible'] text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                                    Selamat! Anda Berhasil Bergabung
                                </h1>
                                <p className="mx-auto mt-3 max-w-md font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                                    Kelas [{courseName}] kini tersedia di menu
                                    Pelatihanku. Mari mulai perjalanan belajar
                                    Anda.
                                </p>

                                <div className="mt-8 space-y-3">
                                    <Link
                                        href={learnHref}
                                        className="block w-full rounded-lg bg-[#FF8928] px-6 py-3.5 text-center font-['Atkinson_Hyperlegible'] font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                    >
                                        Mulai Belajar
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="block w-full rounded-lg border-2 border-[#006B32] px-6 py-3.5 text-center font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                                    >
                                        Kembali ke Dashboard
                                    </Link>
                                </div>

                                <hr className="my-6 border-[#E4E2E1]" />
                                <p className="font-['Atkinson_Hyperlegible'] text-sm text-[#6B7280]">
                                    ID Transaksi: {transactionId}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2]">
                                    <svg
                                        className="h-10 w-10 text-[#DC2626]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 7v6"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 17h.01"
                                        />
                                    </svg>
                                </div>

                                <h1 className="mt-6 font-['Atkinson_Hyperlegible'] text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                                    Gagal Bergabung
                                </h1>
                                <p className="mx-auto mt-3 max-w-md font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                                    Kode akses yang Anda masukkan tidak valid
                                    atau sudah kedaluwarsa. Silakan periksa
                                    kembali kode Anda atau hubungi HRD
                                    perusahaan.
                                </p>

                                <div className="mt-8">
                                    <Link
                                        href={retryHref}
                                        className="block w-full rounded-lg bg-[#FF8928] px-6 py-3.5 text-center font-['Atkinson_Hyperlegible'] font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                    >
                                        Coba Lagi
                                    </Link>
                                </div>

                                <div className="mt-6 rounded-xl border border-[#E4E2E1] bg-[#F6F3F2] p-5 text-left">
                                    <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                        <svg
                                            className="h-5 w-5 shrink-0 text-[#006B32]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 11v5M12 8h.01"
                                            />
                                        </svg>
                                        Tips Cepat:
                                    </p>
                                    <ul className="mt-3 space-y-2">
                                        {accessCodeTips.map((tip) => (
                                            <li
                                                key={tip}
                                                className="flex items-start gap-2 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]"
                                            >
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#006B32]" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
