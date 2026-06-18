import { Head, Link, router } from "@inertiajs/react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import CountdownTimer from "@/Components/Payment/CountdownTimer";

// QR statis buat tampilan (kode asli digenerate backend)
function QrPattern() {
  const size = 25;
  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isFinder =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7);
      if (!isFinder && (x * 7 + y * 13) % 3 === 0) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            fill="#1B1C1C"
          />,
        );
      }
    }
  }

  const finder = (fx, fy) => (
    <g key={`f-${fx}-${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" fill="#1B1C1C" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#FFFFFF" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#1B1C1C" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width={size} height={size} fill="#FFFFFF" />
      {cells}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  );
}

export default function PembayaranQRIS({ payment }) {
  const slug = payment?.slug || payment?.courseId || "manajemen-investasi-aman";
  const backHref = payment?.backHref || "/beli-pelatihan";

  // Detail tagihan QRIS (anggap dari backend)
  const detail = payment?.detail || {
    orderNumber: "#PM-QRIS-20241029",
    courseName: "Persiapan Masa Pensiun Bahagia",
    totalAmount: 450000,
    expiresInSeconds: 899,
  };

  // Langkah scan & bayar
  const scanSteps = [
    "Buka aplikasi e-wallet (Gopay, OVO, ShopeePay) atau Mobile Banking Anda.",
    "Pilih menu Scan QR atau Bayar.",
    "Arahkan kamera ke kode QR yang tersedia di layar ini.",
    "Periksa detail transaksi dan konfirmasi pembayaran.",
  ];

  const supportedApps = ["Shopee", "LinkAja", "OVO", "M-Banking"];

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // Konfirmasi pembayaran -> halaman berhasil
  const handleConfirm = () => {
    router.get(`/pelatihan/${slug}/pembayaran/berhasil`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Pembayaran QRIS" />
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
                <h1 className="text-3xl font-bold text-[#1B1C1C]">
                  Detail Pembayaran
                </h1>
                <p className="mt-2 text-[#6B7280] leading-relaxed">
                  Selesaikan pembayaran Anda sebelum waktu habis untuk
                  mengaktifkan paket belajar.
                </p>

                <div className="border-t border-[#E4E2E1] my-6" />

                <dl className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#6B7280]">Nomor Pesanan</dt>
                    <dd className="font-semibold text-[#1B1C1C]">
                      {detail.orderNumber}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#6B7280]">Pelatihan</dt>
                    <dd className="font-semibold text-[#1B1C1C] text-right">
                      {detail.courseName}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-lg font-bold text-[#1B1C1C]">
                    Total Tagihan
                  </span>
                  <span className="text-lg font-bold text-[#008740]">
                    {formatRupiah(detail.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Kartu Instruksi Scan & Bayar */}
              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
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
                    Instruksi Scan & Bayar
                  </h2>
                </div>
                <ol className="mt-5 space-y-4">
                  {scanSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#008740] text-white text-sm font-bold shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-sm text-[#6B7280] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* --- KANAN --- */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 flex flex-col items-center">
                {/* Timer */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#BA1A1A] px-4 py-1.5 text-sm font-bold text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="13" r="8" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4l2 2M9 3h6"
                    />
                  </svg>
                  <CountdownTimer initialSeconds={detail.expiresInSeconds} />
                </span>

                {/* QR */}
                <div className="mt-5 rounded-2xl bg-[#1B2B2B] p-5">
                  <div className="w-56 h-56 rounded-xl bg-white p-3">
                    <QrPattern />
                  </div>
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#1B1C1C]">
                  Scan & Bayar
                </h2>
                <p className="mt-1 text-sm text-[#6B7280] text-center">
                  Berlaku untuk semua aplikasi pembayaran nasional
                </p>

                <div className="w-full border-t border-[#E4E2E1] my-5" />

                <div className="w-full grid grid-cols-4 gap-3">
                  {supportedApps.map((app) => (
                    <div key={app} className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg border border-[#E4E2E1] text-[#6B7280]">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          viewBox="0 0 24 24"
                        >
                          <rect x="7" y="3" width="10" height="18" rx="2" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 18h2"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-[#6B7280]">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Status + Simpan */}
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-4 font-bold text-white hover:bg-[#F57F1E] transition-colors"
              >
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
                    d="M8.5 12.5l2.5 2.5 4.5-5"
                  />
                </svg>
                MENUNGGU PEMBAYARAN
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#008740] bg-white py-3.5 font-bold text-[#008740] hover:bg-[#E5F0E9] transition-colors"
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
                    d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
                  />
                </svg>
                SIMPAN KODE QR
              </button>
            </div>
          </div>
        </div>
      </main>

      <PaymentFooter />
    </div>
  );
}
