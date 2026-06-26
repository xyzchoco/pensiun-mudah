import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import PaymentHeader from "@/Components/Payment/PaymentHeader";
import PaymentFooter from "@/Components/Payment/PaymentFooter";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";

export default function DetailPembelian({ course, transaction, snapToken, midtransClientKey }) {
  const slug = course?.slug || course?.id || "manajemen-investasi-aman";

  // Karena ini bisa diakses dari korporat, tombol kembalinya kita buat aman (bisa disesuaikan nanti)
  const backHref = "/beli-pelatihan";

  // ========================================================
  // TARIK DATA DINAMIS DARI TRANSAKSI (BUKAN CUMA DARI COURSE)
  // ========================================================
  const qty = transaction?.jumlah_peserta || 1;
  const hargaSatuan = transaction?.harga_per_peserta || course?.price || 0;
  const totalHargaKursus = transaction?.nominal || (hargaSatuan * qty);

  const courseUI = {
    badge: course?.category?.nama || "Kursus Populer",
    title: course?.title || "Judul Pelatihan",
    description: course?.description ? course.description.replace(/<[^>]*>?/gm, '') : "Deskripsi kursus.",
    image: course?.thumbnail ? `/storage/${course.thumbnail.replace(/^public\//, '')}` : "/images/course-preview.png",
  };

  const serviceFee = 0;

  const formatRupiah = (angka) => {
    if (!angka || angka === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // TOTAL BAYAR SEKARANG MENGGUNAKAN NOMINAL DARI DATABASE
  const totalBayar = totalHargaKursus + serviceFee;

  // Load Midtrans Snap
  useEffect(() => {
    if (!document.querySelector('script[src="https://app.sandbox.midtrans.com/snap/snap.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', midtransClientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, [midtransClientKey]);

  // Handle klik Bayar
  const handlePayNow = () => {
    if (snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          // KITA SUNTIK &flag=success DI SINI BOS, BIAR BACKEND TAU INI 100% VALID SUKSES
          router.get(`/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}&flag=success`);
        },
        onPending: function (result) {
          router.get(`/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
        },
        onError: function (result) {
          alert('Pembayaran gagal, silakan coba metode lain.');
        },
        onClose: function () {
          console.log('Pop-up ditutup oleh user');
        }
      });
    } else {
      alert('Token Midtrans tidak ditemukan, coba refresh halaman!');
    }
  };

  // ========================================================
  // RINGKASAN PESANAN DIBUAT DINAMIS MENAMPILKAN QUANTITY
  // ========================================================
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
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-4 font-bold text-white hover:bg-[#F57F1E] transition-colors"
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
                <img src={courseUI.image} alt={courseUI.title} className="w-full sm:w-44 h-32 object-cover rounded-xl" />
                <div className="flex-1">
                  <span className="inline-block bg-[#008740] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {courseUI.badge}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-[#1B1C1C] leading-snug line-clamp-2">
                    {courseUI.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                    {courseUI.description}
                  </p>

                  {/* Harga di kiri dimodif dikit biar keliatan breakdown-nya */}
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

              {/* Kotak Info Pembayaran (Pengganti Radio Button yang Ribet) */}
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
                      Silakan klik tombol <strong>"Lanjutkan ke Pembayaran"</strong> di sebelah kanan. Anda dapat memilih metode pembayaran (Virtual Account semua bank, GoPay, QRIS, atau Kartu Kredit) pada jendela aman yang akan muncul berikutnya.
                    </p>
                    <div className="mt-4 flex gap-2 opacity-70 grayscale">
                      {/* Logo kosmetik aja biar keliatan trust */}
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                    </div>
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