import { Head, Link } from "@inertiajs/react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import SuccessCard from "@/Components/Payment/SuccessCard";

export default function PembayaranBerhasil({ receipt }) {
  const slug = receipt?.slug || receipt?.courseId || "manajemen-investasi-aman";
  const backHref = receipt?.backHref || "/beli-pelatihan";

  // Data transaksi (anggap dari backend, kasih default biar aman)
  const data = receipt?.data || {
    orderId: "#PM-VA-20241029",
    date: "29 Oktober 2024",
    method: "Transfer Bank Virtual Account",
    totalPaid: 1500000,
    courseTitle: "Perencanaan Keuangan Masa Pensiun",
    courseBatch: "Batch: Eksklusif Senior - 12 Minggu",
    courseImage: "/images/course-preview.png",
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Pembayaran Berhasil" />
      <PaymentHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
          {/* --- BACK --- */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Beli Pelatihan
          </Link>

          {/* --- IKON + PESAN SUKSES --- */}
          <div className="mt-8">
            <SuccessCard
              title="Pembayaran Berhasil!"
              description="Terima kasih, pembayaran Anda telah kami terima. Pelatihan Anda kini telah aktif."
            />
          </div>

          {/* --- DETAIL --- */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Kartu Kursus Aktif */}
            <div className="rounded-2xl border border-[#E4E2E1] bg-white overflow-hidden">
              <div className="relative">
                <img
                  src={data.courseImage}
                  alt={data.courseTitle}
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#008740] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Kursus Aktif
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1B1C1C] leading-snug">
                  {data.courseTitle}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 8a3 3 0 106 0 3 3 0 00-6 0zm12 12v-2a4 4 0 00-3-3.8"
                    />
                  </svg>
                  {data.courseBatch}
                </p>
                <Link
                  href={`/pelatihan/${slug}/kelas`}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-3.5 font-bold text-white hover:bg-[#F57F1E] transition-colors"
                >
                  Lihat Pelatihan Sekarang
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 9l5 3-5 3V9z"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Ringkasan Transaksi */}
            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6">
              <h3 className="text-lg font-bold text-[#1B1C1C]">
                Ringkasan Transaksi
              </h3>
              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#6B7280]">Order ID</dt>
                  <dd className="font-semibold text-[#1B1C1C]">
                    {data.orderId}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#6B7280]">Tanggal</dt>
                  <dd className="font-semibold text-[#1B1C1C]">{data.date}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#6B7280]">Metode Pembayaran</dt>
                  <dd className="font-semibold text-[#1B1C1C] text-right">
                    {data.method}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-[#E4E2E1] my-5" />

              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Total Dibayar</span>
                <span className="text-xl font-bold text-[#008740]">
                  {formatRupiah(data.totalPaid)}
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#ECF7F0] p-4">
                <svg
                  className="w-5 h-5 text-[#008740] shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l7 3v6c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V6l7-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.5 12l1.8 1.8 3.2-3.6"
                  />
                </svg>
                <p className="text-xs text-[#3D4A3E] leading-relaxed">
                  Transaksi ini aman dan terverifikasi secara otomatis oleh
                  sistem kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaymentFooter />
    </div>
  );
}
