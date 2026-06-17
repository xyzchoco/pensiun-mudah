import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";
import CountdownTimer from "@/Components/Payment/CountdownTimer";

export default function PembayaranVirtualAccount({ payment }) {
  const slug = payment?.slug || payment?.courseId || "manajemen-investasi-aman";
  const backHref = payment?.backHref || "/beli-pelatihan";

  // Detail tagihan VA (anggap dari backend, kasih default biar aman)
  const detail = payment?.detail || {
    bankName: "Bank Mandiri",
    courseName: "Perencanaan Keuangan Masa Pensiun",
    virtualAccount: "8801 0812 3456 7890",
    companyCode: "8801",
    totalAmount: 1500000,
    expiresInSeconds: 86397,
  };

  // Item ringkasan pesanan
  const summaryItems = [
    {
      label: "Kursus Perencanaan Keuangan",
      subLabel: "Batch Eksklusif Senior - 12 Minggu",
      value: 1450000,
    },
    { label: "Biaya Layanan", value: 50000 },
  ];

  // Langkah instruksi pembayaran ATM
  const instructionSteps = [
    "Masukkan kartu ATM dan PIN Anda.",
    "Pilih menu Bayar/Beli.",
    "Pilih Lainnya, lalu pilih Multipayment.",
    `Masukkan kode perusahaan ${detail.companyCode}.`,
    `Masukkan Nomor Virtual Account ${detail.virtualAccount}.`,
    "Masukkan nominal pembayaran tepat sesuai tagihan.",
    "Ikuti instruksi selanjutnya untuk menyelesaikan pembayaran.",
  ];

  // State tombol salin nomor VA
  const [copied, setCopied] = useState(false);
  // State accordion instruksi
  const [openInstruction, setOpenInstruction] = useState(true);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const handleCopy = () => {
    const plainNumber = detail.virtualAccount.replace(/\s/g, "");
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(plainNumber);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Pembayaran Virtual Account" />
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
              {/* Kartu Detail Pembayaran */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1B1C1C]">
                      Detail Pembayaran
                    </h1>
                    <p className="mt-2 text-[#6B7280] leading-relaxed">
                      Selesaikan pembayaran untuk mengaktifkan kursus "
                      {detail.courseName}".
                    </p>
                  </div>
                  <span className="shrink-0 bg-[#FF8928] text-white text-sm font-bold px-4 py-2 rounded-lg text-center leading-tight">
                    {detail.bankName}
                  </span>
                </div>

                {/* Nomor Virtual Account */}
                <div className="mt-6 rounded-xl border-2 border-dashed border-[#E4E2E1] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <p className="text-sm text-[#6B7280]">
                      Nomor Virtual Account
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#008740] tracking-wide">
                      {detail.virtualAccount}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#FF8928] px-5 py-3 text-sm font-bold text-white hover:bg-[#F57F1E] transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15V5a2 2 0 012-2h10"
                      />
                    </svg>
                    {copied ? "TERSALIN" : "SALIN NOMOR"}
                  </button>
                </div>

                {/* Total Tagihan + Batas Waktu */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E4E2E1] p-4">
                    <p className="text-sm text-[#6B7280]">Total Tagihan</p>
                    <p className="mt-1 text-xl font-bold text-[#008740]">
                      {formatRupiah(detail.totalAmount)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FEF2F2] p-4">
                    <p className="text-sm font-semibold text-[#BA1A1A]">
                      Batas Waktu Pembayaran
                    </p>
                    <CountdownTimer
                      initialSeconds={detail.expiresInSeconds}
                      className="mt-1 block text-xl font-bold text-[#BA1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Kartu Instruksi Pembayaran */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-white">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E4E2E1]">
                  <svg
                    className="w-5 h-5 text-[#008740]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11v5M12 8h.01"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-[#1B1C1C]">
                    Instruksi Pembayaran
                  </h2>
                </div>
                <div className="px-6">
                  <button
                    type="button"
                    onClick={() => setOpenInstruction((prev) => !prev)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="font-semibold text-[#1B1C1C]">
                      Transfer via ATM Mandiri
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#6B7280] transition-transform ${openInstruction ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openInstruction && (
                    <ol className="pb-6 space-y-3">
                      {instructionSteps.map((step, index) => (
                        <li
                          key={index}
                          className="text-sm text-[#6B7280] leading-relaxed pl-1"
                        >
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>

            {/* --- KANAN --- */}
            <div className="lg:col-span-5 space-y-6">
              <OrderSummaryCard
                variant="solid"
                title="Ringkasan Pesanan"
                items={summaryItems}
                totalLabel="Total"
                totalValue={detail.totalAmount}
              />

              {/* Butuh Bantuan */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-[#F3F4F6] p-6">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#008740] text-white shrink-0">
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
                        d="M5 13v-2a7 7 0 0114 0v2M5 13a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2zm14 0a2 2 0 00-2 2v2a2 2 0 002 2 2 2 0 002-2v-2a2 2 0 00-2-2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-[#1B1C1C]">Butuh Bantuan?</h3>
                    <p className="text-sm text-[#6B7280]">
                      Tim kami siap membantu Anda 24/7
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/6282112345678"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center rounded-xl border-2 border-[#008740] bg-white py-3 font-semibold text-[#008740] hover:bg-[#E5F0E9] transition-colors"
                >
                  Hubungi WhatsApp Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaymentFooter />
    </div>
  );
}
