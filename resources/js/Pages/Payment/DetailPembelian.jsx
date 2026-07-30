import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";

export default function DetailPembelian({
  course,
  transaction,
  snapToken,
  midtransClientKey,
  isProduction = false, // dikirim dari controller: config('midtrans.is_production')
}) {
  // Tombol kembali: arahkan ke detail kursusnya kalau slug ada, fallback ke daftar beli
  const backHref = course?.slug
    ? `/pelatihan/${course.slug}`
    : "/beli-pelatihan";

  // URL Snap dinamis (sandbox vs production)
  const snapUrl = isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  // ========================================================
  // DATA TRANSAKSI (SUMBER KEBENARAN DARI DB, BUKAN FRONTEND)
  // ========================================================
  const qty = transaction?.jumlah_peserta || 1;
  const hargaSatuan = transaction?.harga_per_peserta || course?.price || 0;
  const totalHargaKursus = transaction?.nominal || hargaSatuan * qty;
  const serviceFee = 0;
  const totalBayar = totalHargaKursus + serviceFee;

  // ========================================================
  // DATA TAMPILAN KURSUS (fallback netral, tanpa dummy)
  // ========================================================
  const courseUI = {
    badge: course?.category?.nama || null, // null => badge tidak dirender
    title: course?.title || "Judul Pelatihan",
    description: course?.description
      ? course.description.replace(/<[^>]*>?/gm, "")
      : "",
    image: course?.thumbnail
      ? `/storage/${course.thumbnail.replace(/^public\//, "")}`
      : "/images/course-preview.png",
  };

  const formatRupiah = (angka) => {
    if (!angka || angka === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // Load script Midtrans Snap (dinamis sesuai environment)
  useEffect(() => {
    if (!midtransClientKey) return;
    if (!document.querySelector(`script[src="${snapUrl}"]`)) {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.setAttribute("data-client-key", midtransClientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, [midtransClientKey, snapUrl]);

  // Handle klik Bayar
  const handlePayNow = () => {
    if (!snapToken) {
      alert("Token Midtrans tidak ditemukan, coba refresh halaman!");
      return;
    }
    if (!window.snap) {
      alert("Modul pembayaran belum siap, tunggu sebentar lalu coba lagi.");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        // flag=success sebagai penanda callback client valid.
        // CATATAN: finalisasi asli (lunas + generate voucher) TETAP lewat webhook, bukan ini.
        router.get(
          `/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}&flag=success`
        );
      },
      onPending: function (result) {
        router.get(
          `/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`
        );
      },
      onError: function () {
        alert("Pembayaran gagal, silakan coba metode lain.");
      },
      onClose: function () {
        console.log("Pop-up ditutup oleh user");
      },
    });
  };

  // Ringkasan pesanan (dinamis)
  const summaryItems = [
    { label: `Harga Kursus (x${qty})`, value: totalHargaKursus },
    {
      label: "Biaya Layanan",
      value: serviceFee,
      display: serviceFee === 0 ? "Gratis" : undefined,
    },
  ];

  const summaryFooter = (
    <>
      <div className="flex items-start gap-3 rounded-xl bg-[#E5F0E9] p-4">
        <svg className="w-5 h-5 text-[#008740] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V6l7-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8 3.2-3.6" />
        </svg>
        <p className="text-xs font-semibold text-[#008740] leading-relaxed">
          Transaksi aman & terenkripsi. Akses kursus selamanya setelah pembayaran.
        </p>
      </div>

      {transaction?.nomor_transaksi && (
        <p className="text-xs text-center text-[#6B7280] font-mono mt-3">
          ID: {transaction.nomor_transaksi}
        </p>
      )}

      <button
        type="button"
        onClick={handlePayNow}
        disabled={!snapToken}
        className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition-colors ${snapToken
            ? "bg-[#FF8928] hover:bg-[#F57F1E]"
            : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V8a5 5 0 0110 0v2" />
          <rect x="5" y="10" width="14" height="10" rx="2" />
        </svg>
        Lanjutkan ke Pembayaran
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
      <Head title="Detail Pembelian" />
      <PaymentHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Detail Pelatihan
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#1B1C1C]">Detail Pembelian</h1>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-[#E4E2E1] bg-white p-4">
                <img
                  src={courseUI.image}
                  alt={courseUI.title}
                  className="w-full sm:w-44 h-32 object-cover rounded-xl"
                />
                <div className="flex-1">
                  {courseUI.badge && (
                    <span className="inline-block bg-[#008740] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {courseUI.badge}
                    </span>
                  )}
                  <h2 className="mt-3 text-xl font-bold text-[#1B1C1C] leading-snug line-clamp-2">
                    {courseUI.title}
                  </h2>
                  {courseUI.description && (
                    <p className="mt-2 text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                      {courseUI.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-lg font-bold text-[#008740]">
                      {formatRupiah(totalHargaKursus)}
                    </p>
                    {qty > 1 && (
                      <p className="text-xs font-semibold text-[#6B7280]">
                        ({formatRupiah(hargaSatuan)} / lisensi)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E5F0E9] text-[#008740] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1C1C] mb-2">
                      Pembayaran Diproses oleh Midtrans
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      Silakan klik tombol <strong>"Lanjutkan ke Pembayaran"</strong> di
                      sebelah kanan. Anda dapat memilih metode pembayaran (Virtual
                      Account semua bank, GoPay, QRIS, atau Kartu Kredit) pada jendela
                      aman yang akan muncul berikutnya.
                    </p>
                  </div>
                </div>
              </div>
            </div>

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