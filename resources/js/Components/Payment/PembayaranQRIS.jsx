// resources/js/Pages/Payment/PembayaranQRIS.jsx
import React, { useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PaymentTimer from "@/Components/Payment/PaymentTimer";

export default function PembayaranQRIS(props) {
	/* --- DATA & DEFAULTS --- */
	const payment = props?.payment || {};

	const paymentData = useMemo(() => {
		return {
			courseId: payment?.courseId || "persiapan-masa-pensiun-bahagia",
			backHref: payment?.backHref || "/pelatihan",
			orderNumber: payment?.orderNumber || "#PM-QRIS-20241029",
			courseTitle: payment?.courseTitle || "Persiapan Masa Pensiun Bahagia",
			totalAmount: typeof payment?.totalAmount === "number" ? payment.totalAmount : 450000,
			qrImageUrl:
				payment?.qrImageUrl ||
				"https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=PENSIUNMUDAH-QRIS-20241029-450000",
			deadlineSeconds: typeof payment?.deadlineSeconds === "number" ? payment.deadlineSeconds : 899,
		};
	}, [payment]);

	const instructionSteps = useMemo(
		() => [
			"Buka aplikasi e-wallet (Gopay, OVO, ShopeePay) atau Mobile Banking Anda.",
			"Pilih menu Scan QR atau Bayar.",
			"Arahkan kamera ke kode QR yang tersedia di layar ini.",
			"Periksa detail transaksi dan konfirmasi pembayaran.",
		],
		[]
	);

	const supportedWallets = useMemo(
		() => [
			{ id: "shopee", label: "Shopee" },
			{ id: "linkaja", label: "LinkAja" },
			{ id: "ovo", label: "OVO" },
			{ id: "mbanking", label: "M-Banking" },
		],
		[]
	);

	/* --- HELPERS --- */
	const formatRupiah = (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

	const handleDownloadQr = () => {
		const anchor = document.createElement("a");
		anchor.href = paymentData.qrImageUrl;
		anchor.download = `QRIS-${paymentData.orderNumber.replace(/[#\s]/g, "")}.png`;
		anchor.target = "_blank";
		anchor.rel = "noopener noreferrer";
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	};

	const handlePaymentConfirmed = () => {
		router.visit(`/payment/success/${paymentData.courseId}`, {
			method: "get",
			data: { method: "qris" },
		});
	};

	const WalletIcon = ({ walletId }) => {
		const baseClass = "h-7 w-7 text-[#475467]";
		if (walletId === "ovo" || walletId === "mbanking") {
			return (
				<svg className={baseClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M7 3h10v18H7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
					<path d="M10.5 18.2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
				</svg>
			);
		}
		return (
			<svg className={baseClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path d="M7 2.5h8c.8 0 1.5.7 1.5 1.5v16c0 .8-.7 1.5-1.5 1.5H7c-.8 0-1.5-.7-1.5-1.5V4c0-.8.7-1.5 1.5-1.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
				<path d="M10 18.5h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
			</svg>
		);
	};

	/* --- RENDER --- */
	return (
		<DashboardLayout>
			<Head title="Pembayaran QRIS" />

			<div className="min-h-screen bg-[#FBFAF8]">
				<div className="mx-auto w-full max-w-6xl px-6 py-8">
					{/* --- BACK NAV --- */}
					<Link
						href={paymentData.backHref}
						className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#00773A]"
					>
						<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M15.5 19L8.5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>Kembali ke Beli Pelatihan</span>
					</Link>

					{/* --- MAIN GRID --- */}
					<section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* --- LEFT: ORDER DETAIL + INSTRUCTIONS --- */}
						<div className="space-y-6 lg:col-span-7">
							{/* --- DETAIL CARD --- */}
							<article className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
								<header>
									<h1 className="text-2xl font-extrabold text-[#101828]">Detail Pembayaran</h1>
									<p className="mt-2 max-w-sm text-sm leading-6 text-[#667085]">
										Selesaikan pembayaran Anda sebelum waktu habis untuk mengaktifkan paket belajar.
									</p>
								</header>

								<div className="mt-6 border-t border-black/10 pt-5">
									<dl className="space-y-4">
										<div className="flex items-center justify-between">
											<dt className="text-sm font-semibold text-[#667085]">Nomor Pesanan</dt>
											<dd className="text-sm font-bold text-[#101828]">{paymentData.orderNumber}</dd>
										</div>
										<div className="flex items-center justify-between">
											<dt className="text-sm font-semibold text-[#667085]">Pelatihan</dt>
											<dd className="text-sm font-bold text-[#101828]">{paymentData.courseTitle}</dd>
										</div>
										<div className="flex items-center justify-between border-t border-black/10 pt-4">
											<dt className="text-lg font-extrabold text-[#101828]">Total Tagihan</dt>
											<dd className="text-lg font-extrabold text-[#008740]">
												{formatRupiah(paymentData.totalAmount)}
											</dd>
										</div>
									</dl>
								</div>
							</article>

							{/* --- INSTRUCTIONS --- */}
							<article className="rounded-2xl bg-[#F4F4F5] p-7 ring-1 ring-black/5">
								<header className="mb-5 flex items-center gap-2">
									<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E9F7EF] text-[#008740]">
										<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" stroke="currentColor" strokeWidth="1.8" />
											<path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
									</span>
									<h2 className="text-lg font-extrabold text-[#101828]">Instruksi Scan & Bayar</h2>
								</header>

								<ol className="space-y-4">
									{instructionSteps.map((step, index) => (
										<li key={index} className="flex items-start gap-3">
											<span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#008740] text-xs font-extrabold text-white">
												{index + 1}
											</span>
											<span className="pt-0.5 text-sm leading-6 text-[#475467]">{step}</span>
										</li>
									))}
								</ol>
							</article>
						</div>

						{/* --- RIGHT: QR PANEL --- */}
						<div className="lg:col-span-5">
							<div className="space-y-4 lg:sticky lg:top-6">
								<article className="rounded-2xl bg-white p-7 ring-1 ring-black/10">
									<div className="mb-4 flex justify-center">
										<PaymentTimer
											variant="badge"
											initialSeconds={paymentData.deadlineSeconds}
										/>
									</div>

									{/* --- QR FRAME --- */}
									<div className="mx-auto flex max-w-xs items-center justify-center rounded-2xl bg-[#1D2939] p-6">
										<div className="rounded-xl bg-white p-4">
											<img
												src={paymentData.qrImageUrl}
												alt="Kode QR pembayaran QRIS"
												className="h-48 w-48 object-contain"
											/>
										</div>
									</div>

									<div className="mt-5 text-center">
										<h2 className="text-xl font-extrabold text-[#101828]">Scan & Bayar</h2>
										<p className="mt-1 text-sm text-[#667085]">
											Berlaku untuk semua aplikasi pembayaran nasional
										</p>
									</div>

									{/* --- SUPPORTED WALLETS --- */}
									<div className="mt-5 grid grid-cols-4 gap-3 border-t border-black/10 pt-5">
										{supportedWallets.map((wallet) => (
											<div key={wallet.id} className="flex flex-col items-center gap-2">
												<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F4F5] ring-1 ring-black/5">
													<WalletIcon walletId={wallet.id} />
												</span>
												<span className="text-[11px] font-semibold text-[#475467]">{wallet.label}</span>
											</div>
										))}
									</div>
								</article>

								{/* --- WAITING STATUS (simulate poll -> confirm) --- */}
								<button
									type="button"
									onClick={handlePaymentConfirmed}
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-[#F57F1E]"
								>
									<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" stroke="currentColor" strokeWidth="1.8" />
										<path d="M8.5 12.2l2.4 2.4 4.6-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span>Menunggu Pembayaran</span>
								</button>

								{/* --- DOWNLOAD QR --- */}
								<button
									type="button"
									onClick={handleDownloadQr}
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#008740] bg-white px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#008740] transition hover:bg-[#E9F7EF]"
								>
									<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path d="M12 4v10M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
									</svg>
									<span>Simpan Kode QR</span>
								</button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</DashboardLayout>
	);
}