import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const paymentMethods = ['va', 'gopay', 'qris'];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function RingkasanPesananCard({
    course,
    transaction,
    snapToken,
    midtransClientKey,
    quantity = 1,
    orderId = 'IND-0001-2025',
    updateEndpoint, // '/instansi/pelatihan/{slug}/pembelian-online' atau '/korporat/...'
}) {
    const [qty, setQty] = useState(
        transaction?.jumlah_peserta || Math.max(1, Number(quantity) || 1),
    );
    const [isUpdating, setIsUpdating] = useState(false); // FIX: loading state

    const activeToken = snapToken || transaction?.snap_token;

    useEffect(() => {
        if (!midtransClientKey || !activeToken) return;
        const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
        let script = document.querySelector(`script[src="${snapScript}"]`);
        if (!script) {
            script = document.createElement('script');
            script.src = snapScript;
            script.setAttribute('data-client-key', midtransClientKey);
            script.async = true;
            document.body.appendChild(script);
        }
    }, [midtransClientKey, activeToken]);

    const updateQuantityInBackend = (newQty) => {
        if (!updateEndpoint) return;
        setQty(newQty);
        setIsUpdating(true); // FIX: kunci tombol bayar
        router.get(
            updateEndpoint,
            { qty: newQty },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['transaction', 'snapToken'],
                showProgress: false,
                onFinish: () => setIsUpdating(false), // FIX: buka kunci setelah token baru datang
            },
        );
    };

    const increment = () => updateQuantityInBackend(qty + 1);
    const decrement = () => { if (qty > 1) updateQuantityInBackend(qty - 1); };

    const handlePay = () => {
        if (window.snap && activeToken) {
            window.snap.pay(activeToken, {
                onSuccess(result) {
                    router.get(
                        `/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}&flag=success`,
                    );
                },
                onPending(result) {
                    router.get(
                        `/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`,
                    );
                },
                onError() { alert('Pembayaran gagal.'); },
                onClose() { console.log('Popup ditutup'); },
            });
        } else {
            alert('Sistem pembayaran belum siap atau token kedaluwarsa. Mohon tunggu sebentar.');
        }
    };

    const coursePrice = transaction?.harga_per_peserta || course?.price || 199000;
    const subtotal = coursePrice * qty;
    const totalLabel = formatRupiah(subtotal);
    const coursePriceLabel = formatRupiah(coursePrice);

    const summaryRows = [
        { id: 'harga', label: 'Harga Kursus', value: coursePriceLabel, accent: false },
        { id: 'layanan', label: 'Biaya Layanan', value: 'Gratis', accent: true },
    ];

    return (
        <div className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
            <h2 className="text-xl font-bold text-[#1B1C1C]">Ringkasan Pesanan</h2>
            <div className="mt-5 space-y-4">
                {summaryRows.map((row) => (
                    <div key={row.id}>
                        <div className="flex items-center justify-between">
                            <span className="text-[#3D4A3E]">{row.label}</span>
                            <span className={row.accent ? 'font-bold text-[#006B32]' : 'font-bold text-[#1B1C1C]'}>
                                {row.value}
                            </span>
                        </div>
                        <hr className="mt-4 border-[#E4E2E1]" />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-start justify-between">
                <span className="text-lg font-bold text-[#1B1C1C]">Total Bayar</span>
                <span className="text-2xl font-bold text-[#FF8928]">{totalLabel}</span>
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#E5F0E9] p-4">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="9" />
                </svg>
                <p className="text-xs font-semibold text-[#006B32]">
                    Setiap penambahan kuota akan menambah kode lisensi (`max_uses`) yang dapat langsung dibagikan ke karyawan Anda.
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
                Invoice: {transaction?.nomor_transaksi || orderId}
            </p>
            {/* FIX: tombol disable saat token sedang di-update */}
            <button
                type="button"
                onClick={handlePay}
                disabled={isUpdating}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white transition-colors ${isUpdating
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-[#FF8928] hover:bg-[#F57F1E]'
                    }`}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 018 0v3" />
                </svg>
                {isUpdating ? 'Memperbarui harga...' : 'Bayar Sekarang'}
            </button>
        </div>
    );
}