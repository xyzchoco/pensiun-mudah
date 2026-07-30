import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

const paymentMethods = ['va', 'gopay', 'qris'];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>?/gm, '');
}

export default function DetailPembelianHybridInstansi({
    course = null,
    transaction = null,   // Prop dari controller — dibutuhkan untuk nomor_transaksi
    badge = 'Kursus Populer',
    title = 'Manajemen Investasi Aman untuk Pensiunan',
    description = 'Mulai bangun portofolio rendah risiko yang stabil untuk masa tua yang tenang.',
    price = 'Rp 199.000',
    total = 'Rp 999.000',
    quantity = 5,
    orderId = 'IND-0001-2025',
    backHref = '/beli-pelatihan',
    snapToken = null,
    midtransClientKey = null,
}) {
    const [qty, setQty] = useState(Math.max(1, Number(quantity) || 1));
    const courseTitle = course?.title || title;
    const badgeLabel = course?.category?.nama ?? badge;
    const badgeBg = course?.category?.warna_bg_icon ?? '#006B32';
    const badgeTextColor = course?.category?.warna_teks_icon ?? '#FFFFFF';
    const courseDescription = stripHtml(course?.description) || description;
    const coursePrice = course?.price ?? 199000;
    const subtotal = coursePrice * qty;
    const coursePriceLabel = course ? formatRupiah(coursePrice) : price;
    const totalLabel = course ? formatRupiah(subtotal) : total;
    const thumbnail = course?.thumbnail
        ? `/storage/${String(course.thumbnail).replace(/^public\//, '')}`
        : null;

    // Load Midtrans Snap script
    useEffect(() => {
        const scriptId = 'midtrans-snap-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute('data-client-key', midtransClientKey || '');
            document.body.appendChild(script);

            script.onload = () => {
                console.log('Midtrans Snap script loaded.');
            };
            script.onerror = () => {
                console.error('Failed to load Midtrans Snap script.');
            };
        }

        // Cleanup script on unmount
        return () => {
            const script = document.getElementById(scriptId);
            if (script) {
                // script.remove(); // Be cautious with removing scripts if other components rely on it
            }
        };
    }, [midtransClientKey]);

    const summaryRows = [
        {
            id: 'harga',
            label: 'Harga Kursus',
            value: coursePriceLabel,
            accent: false,
        },
        {
            id: 'layanan',
            label: 'Biaya Layanan',
            value: 'Gratis',
            accent: true,
        },
    ];

    const decrement = async () => {
        const newQty = qty > 1 ? qty - 1 : 1;
        setQty(newQty);
        await updateSnapToken(newQty);
    };

    const increment = async () => {
        const newQty = qty + 1;
        setQty(newQty);
        await updateSnapToken(newQty);
    };

    const updateSnapToken = async (newQty) => {
        try {
            const courseSlug = course?.slug || window.location.pathname.split('/')[3];
            const response = await fetch(
                `/korporat/pelatihan-hybrid/${courseSlug}/snap-token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                    },
                    body: JSON.stringify({ qty: newQty }),
                }
            );

            if (!response.ok) {
                console.error('Failed to update snap token:', response.status);
                return;
            }

            const data = await response.json();
            window.snapToken = data.snapToken;
            window.transaction = data.transaction;
        } catch (error) {
            console.error('Error updating snap token:', error);
        }
    };

    const handlePayment = () => {
        const currentSnapToken = window.snapToken || snapToken;
        if (!window.snap) {
            console.error('Midtrans Snap is not available. Script might not be loaded.');
            alert('Midtrans belum siap. Silakan coba lagi nanti atau periksa koneksi Anda.');
            return;
        }
        if (!currentSnapToken) {
            console.error('Snap token is missing.');
            alert('Token pembayaran tidak ditemukan. Silakan coba lagi.');
            return;
        }

        const currentTransaction = window.transaction || transaction;
        window.snap.pay(currentSnapToken, {
            // onSuccess: verifikasi ke server (jalan di lokal TANPA ngrok)
            onSuccess: function () {
                const nomorTransaksi = currentTransaction?.nomor_transaksi;
                if (nomorTransaksi) {
                    router.visit(`/pembayaran/${nomorTransaksi}/cek`);
                } else {
                    router.visit(backHref);
                }
            },
            onPending: function () {
                alert('Pembayaran sedang diproses. Voucher akan tersedia setelah konfirmasi bank.');
                router.visit(backHref);
            },
            onError: function () {
                // Hanya alert — JANGAN redirect ke route yang tidak ada
                alert('Pembayaran gagal. Silakan coba lagi atau hubungi support.');
            },
            onClose: function () {
                // User menutup popup — tidak perlu redirect (akan bikin 404)
                console.log('Pembayaran dibatalkan oleh user.');
            },
        });
    };

    return (
        <InstansiLayout showSidebar={false} title={`${courseTitle} - Detail Pembelian`} activeNav="dashboard">
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
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
                        Kembali ke Beli Pelatihan
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold text-[#1B1C1C]">
                        Detail Pembelian
                    </h1>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#1B3326] to-[#0C1A12] sm:w-64">
                                        {thumbnail && (
                                            <img
                                                src={thumbnail}
                                                alt={courseTitle}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        {badgeLabel && (
                                            <span
                                                className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                                                style={{ backgroundColor: badgeBg, color: badgeTextColor }}
                                            >
                                                {badgeLabel}
                                            </span>
                                        )}
                                        <h2 className="mt-3 text-2xl font-bold text-[#1B1C1C]">
                                            {courseTitle}
                                        </h2>
                                        <p className="mt-2 text-[#3D4A3E]">
                                            {courseDescription}
                                        </p>
                                        <p className="mt-4 text-2xl font-bold text-[#006B32]">
                                            {coursePriceLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F0E9] text-[#006B32]">
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
                                                d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12l2 2 4-4"
                                            />
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-[#1B1C1C]">
                                            Pembayaran Diproses oleh Midtrans
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-[#3D4A3E]">
                                            Silakan klik tombol "Lanjutkan ke
                                            Pembayaran" di sebelah kanan. Anda
                                            dapat memilih metode pembayaran
                                            (Virtual Account semua bank, GoPay,
                                            QRIS, atau Kartu Kredit) pada
                                            jendela aman yang akan muncul
                                            berikutnya.
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {paymentMethods.map((method) => (
                                                <span
                                                    key={method}
                                                    className="h-7 w-14 rounded bg-[#F0EDED]"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                                <h2 className="text-xl font-bold text-[#1B1C1C]">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="mt-5 space-y-4">
                                    {summaryRows.map((row) => (
                                        <div key={row.id}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#3D4A3E]">
                                                    {row.label}
                                                </span>
                                                <span
                                                    className={
                                                        row.accent
                                                            ? 'font-bold text-[#006B32]'
                                                            : 'font-bold text-[#1B1C1C]'
                                                    }
                                                >
                                                    {row.value}
                                                </span>
                                            </div>
                                            <hr className="mt-4 border-[#E4E2E1]" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-start justify-between">
                                    <span className="text-lg font-bold text-[#1B1C1C]">
                                        Total Bayar
                                    </span>
                                    <span className="text-2xl font-bold text-[#FF8928]">
                                        {totalLabel}
                                    </span>
                                </div>

                                <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#E5F0E9] p-4">
                                    <svg
                                        className="mt-0.5 h-5 w-5 shrink-0 text-[#006B32]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4"
                                        />
                                        <circle cx="12" cy="12" r="9" />
                                    </svg>
                                    <p className="text-sm font-semibold text-[#006B32]">
                                        Transaksi aman & terenkripsi. Akses
                                        kursus selamanya setelah pembayaran.
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={decrement}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32] text-xl font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Kurangi jumlah"
                                    >
                                        -
                                    </button>
                                    <span className="flex h-10 w-12 items-center justify-center rounded-lg bg-[#FF8928] text-lg font-bold text-white">
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={increment}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32] text-xl font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Tambah jumlah"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="mt-3 text-center text-sm text-[#6B7280]">
                                    ID: {orderId}
                                </p>

                                <button
                                    type="button"
                                    onClick={handlePayment} // Added onClick handler
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect
                                            x="5"
                                            y="11"
                                            width="14"
                                            height="9"
                                            rx="2"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 11V8a4 4 0 018 0v3"
                                        />
                                    </svg>
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}