import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import PaymentMethodCard from "@/Components/Payment/PaymentMethodCard";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";

export default function DetailPembelian({ order }) {
  // Slug kursus dipakai buat semua link navigasi pembayaran
  const slug = order?.slug || order?.courseId || "manajemen-investasi-aman";
  const backHref = order?.backHref || "/beli-pelatihan";

  // Data kursus (anggap dari backend, kasih default biar aman dirender)
  const course = order?.course || {
    badge: "Kursus Populer",
    title: "Manajemen Investasi Aman untuk Pensiunan",
    description:
      "Mulai bangun portofolio rendah risiko yang stabil untuk masa tua yang tenang.",
    price: 199000,
    image: "/images/course-preview.png",
  };
  const serviceFee = order?.serviceFee ?? 0;

  // Daftar metode pembayaran + tujuan navigasinya
  const paymentMethods = [
    {
      id: "va",
      icon: "va",
      title: "Virtual Account",
      subtitle: "BCA, Mandiri, BNI",
      target: "virtual-account",
    },
    {
      id: "ewallet",
      icon: "ewallet",
      title: "E-Wallet",
      subtitle: "GoPay, OVO, Dana",
      target: "e-wallet",
    },
    {
      id: "qris",
      icon: "qris",
      title: "QRIS",
      subtitle: "Scan QR Semua Bank",
      target: "qris",
    },
  ];

  const [selectedMethod, setSelectedMethod] = useState("qris");

  // Format harga ke Rupiah
  const formatRupiah = (angka) => {
    if (!angka || angka === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const totalBayar = (course.price || 0) + serviceFee;

  // Pindah ke halaman pembayaran sesuai metode yang dipilih
  const handlePayNow = () => {
    const method = paymentMethods.find((item) => item.id === selectedMethod);
    router.get(`/pelatihan/${slug}/pembayaran/${method.target}`);
  };

  // Item ringkasan pesanan
  const summaryItems = [
    { label: "Harga Kursus", value: course.price },
    {
      label: "Biaya Layanan",
      value: serviceFee,
      display: serviceFee === 0 ? "Gratis" : undefined,
    },
  ];

  // Footer ringkasan: catatan keamanan + tombol bayar
  const summaryFooter = (
    <>
      <div className="flex items-start gap-3 rounded-xl bg-[#E5F0E9] p-4">
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
        <p className="text-xs font-semibold text-[#008740] leading-relaxed">
          Transaksi aman & terenkripsi. Akses kursus selamanya setelah
          pembayaran.
        </p>
      </div>
      <button
        type="button"
        onClick={handlePayNow}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-4 font-bold text-white hover:bg-[#F57F1E] transition-colors"
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
            d="M7 10V8a5 5 0 0110 0v2"
          />
          <rect x="5" y="10" width="14" height="10" rx="2" />
        </svg>
        Bayar Sekarang
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Detail Pembelian" />
      <PaymentHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
          {/* --- BACK + JUDUL --- */}
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
          <h1 className="mt-4 text-3xl font-bold text-[#1B1C1C]">
            Detail Pembelian
          </h1>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- KIRI --- */}
            <div className="lg:col-span-7 space-y-6">
              {/* Kartu Kursus */}
              <div className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-[#E4E2E1] bg-white p-4">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full sm:w-44 h-32 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <span className="inline-block bg-[#008740] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {course.badge}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-[#1B1C1C] leading-snug">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                    {course.description}
                  </p>
                  <p className="mt-3 text-lg font-bold text-[#008740]">
                    {formatRupiah(course.price)}
                  </p>
                </div>
              </div>

              {/* Kartu Pilih Metode */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#E5F0E9] text-[#008740] shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 5h16v4H4V5zm0 10h16v4H4v-4z"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1C1C]">
                      Pilih Metode Pembayaran
                    </h3>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Pilih salah satu metode pembayaran di bawah ini untuk
                      melanjutkan transaksi.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      id={method.id}
                      icon={method.icon}
                      title={method.title}
                      subtitle={method.subtitle}
                      selected={selectedMethod === method.id}
                      onSelect={setSelectedMethod}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* --- KANAN --- */}
            <div className="lg:col-span-5">
              <OrderSummaryCard
                variant="light"
                title="Ringkasan Pesanan"
                items={summaryItems}
                totalLabel="Total Bayar"
                totalValue={totalBayar}
                footer={summaryFooter}
              />
            </div>
          </div>
        </div>
      </main>

      <PaymentFooter />
    </div>
  );
}
