import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";
import CountdownTimer from "@/Components/Payment/CountdownTimer";

export default function PembayaranEWallet({ payment }) {
  const slug = payment?.slug || payment?.courseId || "manajemen-investasi-aman";
  const backHref = payment?.backHref || "/beli-pelatihan";

  // Detail tagihan E-Wallet (anggap dari backend)
  const detail = payment?.detail || {
    courseName: "Perencanaan Keuangan Masa Pensiun 101",
    courseSubtitle: "Sertifikasi Keanggotaan Premium",
    courseImage: "/images/course-thumb.png",
    coursePrice: 850000,
    discount: -100000,
    serviceFee: 2500,
    totalAmount: 752500,
    expiresInSeconds: 86397,
  };

  // Pilihan dompet digital
  const wallets = [
    { id: "gopay", name: "GoPay", color: "text-[#00AAE4]" },
    { id: "ovo", name: "OVO", color: "text-[#4C2A86]" },
    { id: "dana", name: "DANA", color: "text-[#108EE9]" },
  ];
  const [selectedWallet, setSelectedWallet] = useState("gopay");

  // Langkah pembayaran
  const steps = [
    {
      number: "1",
      title: "Verifikasi Nomor",
      desc: "Klik tombol di atas dan sistem kami akan mengirimkan permintaan pembayaran langsung ke aplikasi ponsel Anda.",
    },
    {
      number: "2",
      title: "Konfirmasi di Ponsel",
      desc: "Buka notifikasi di ponsel Anda, periksa detail transaksi, lalu masukkan PIN keamanan E-Wallet Anda.",
    },
    {
      number: "3",
      title: "Selesai",
      desc: "Setelah pembayaran sukses, halaman ini akan otomatis diperbarui dan kursus Anda akan segera aktif.",
    },
  ];

  // Buka aplikasi e-wallet -> halaman berhasil
  const handleOpenEwallet = () => {
    router.get(`/pelatihan/${slug}/pembayaran/berhasil`);
  };

  // Item ringkasan pesanan
  const summaryItems = [
    { label: "Harga Kursus", value: detail.coursePrice },
    { label: "Diskon Member Baru", value: detail.discount, isDiscount: true },
    { label: "Biaya Layanan", value: detail.serviceFee },
  ];

  // Header ringkasan: thumbnail + nama kursus
  const summaryHeader = (
    <div className="flex items-center gap-3 pb-5 border-b border-[#E4E2E1]">
      <img
        src={detail.courseImage}
        alt={detail.courseName}
        className="w-14 h-14 rounded-lg object-cover"
      />
      <div>
        <p className="font-bold text-[#008740] leading-snug">
          {detail.courseName}
        </p>
        <p className="text-sm text-[#6B7280]">{detail.courseSubtitle}</p>
      </div>
    </div>
  );

  // Footer ringkasan: timer batas pembayaran
  const summaryFooter = (
    <div className="flex items-center gap-3 rounded-xl bg-[#008740] p-4 text-white">
      <svg
        className="w-6 h-6 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="13" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4l2 2M9 3h6"
        />
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Selesaikan Pembayaran Dalam
        </p>
        <CountdownTimer
          initialSeconds={detail.expiresInSeconds}
          className="block text-lg font-bold"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Pembayaran E-Wallet" />
      <PaymentHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
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

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- KIRI --- */}
            <div className="lg:col-span-7 space-y-6">
              {/* Kartu Detail Pembayaran E-Wallet */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-[#1B1C1C]">
                  Detail Pembayaran E-Wallet
                </h1>
                <p className="mt-2 text-[#6B7280] leading-relaxed">
                  Silakan masukkan nomor telepon yang terdaftar pada aplikasi
                  E-Wallet pilihan Anda untuk melanjutkan transaksi.
                </p>

                {/* Pilihan Dompet */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setSelectedWallet(wallet.id)}
                      className={`flex items-center justify-center h-20 rounded-xl border-2 transition-all ${selectedWallet === wallet.id ? "border-[#008740] bg-[#F4FAF6]" : "border-[#E4E2E1] bg-white hover:border-[#008740]/40"}`}
                    >
                      <span
                        className={`text-lg font-extrabold ${wallet.color}`}
                      >
                        {wallet.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Input Nomor Telepon */}
                <div className="mt-6">
                  <label className="block font-bold text-[#1B1C1C] mb-2">
                    Nomor Telepon Terdaftar
                  </label>
                  <div className="flex items-center rounded-xl border border-[#E4E2E1] overflow-hidden focus-within:border-[#008740]">
                    <span className="px-4 py-3 text-[#1B1C1C] font-semibold border-r border-[#E4E2E1] bg-[#FBF9F8]">
                      +62
                    </span>
                    <input
                      type="tel"
                      defaultValue="812 3456 7890"
                      placeholder="812 3456 7890"
                      className="flex-1 px-4 py-3 outline-none text-[#1B1C1C]"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#6B7280] italic">
                    Pastikan saldo Anda cukup untuk membayar tagihan ini.
                  </p>
                </div>

                {/* Tombol Buka E-Wallet */}
                <button
                  type="button"
                  onClick={handleOpenEwallet}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-4 font-bold text-white hover:bg-[#F57F1E] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="7" y="3" width="10" height="18" rx="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 18h2"
                    />
                  </svg>
                  BUKA APLIKASI E-WALLET
                </button>
              </div>

              {/* Langkah Pembayaran + Keamanan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-[#E4E2E1] bg-white p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#008740] text-white text-sm font-bold">
                        {step.number}
                      </span>
                      <h3 className="font-bold text-[#1B1C1C]">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}

                <div className="rounded-2xl border border-[#CDE8D8] bg-[#ECF7F0] p-5">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#008740]"
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
                    <h3 className="font-bold text-[#008740]">
                      Keamanan Terjamin
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-[#3D4A3E] leading-relaxed">
                    Transaksi Anda dilindungi dengan enkripsi tingkat tinggi
                    sesuai standar perbankan nasional.
                  </p>
                </div>
              </div>
            </div>

            {/* --- KANAN --- */}
            <div className="lg:col-span-5">
              <OrderSummaryCard
                variant="light"
                title="Ringkasan Pesanan"
                header={summaryHeader}
                items={summaryItems}
                totalLabel="Total Bayar"
                totalValue={detail.totalAmount}
                dashedDivider={true}
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
