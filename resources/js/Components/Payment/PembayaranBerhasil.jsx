// resources/js/Pages/Payment/PembayaranBerhasil.jsx
import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import SuccessCard from "@/Components/Payment/SuccessCard";

export default function PembayaranBerhasil(props) {
	/* --- DATA & DEFAULTS --- */
	const receipt = props?.receipt || {};

	const receiptData = useMemo(() => {
		return {
			courseId: receipt?.courseId || "perencanaan-keuangan-masa-pensiun",
			backHref: receipt?.backHref || "/pelatihan",
			courseTitle: receipt?.courseTitle || "Perencanaan Keuangan Masa Pensiun",
			courseBatch: receipt?.courseBatch || "Batch: Eksklusif Senior - 12 Minggu",
			courseThumbnail:
				receipt?.courseThumbnail ||
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
			orderId: receipt?.orderId || "#PM-VA-20241029",
			transactionDate: receipt?.transactionDate || "29 Oktober 2024",
			paymentMethod: receipt?.paymentMethod || "Transfer Bank Virtual Account",
			totalPaid: typeof receipt?.totalPaid === "number" ? receipt.totalPaid : 1500000,
			accessHref: receipt?.accessHref || "/pelatihan/perencanaan-keuangan-masa-pensiun/belajar",
		};
	}, [receipt]);

	/* --- HELPERS --- */
	const formatRupiah = (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

	/* --- RENDER --- */
	return (
		<DashboardLayout>
			<Head title="Pembayaran Berhasil" />

			<div className="min-h-screen bg-[#FBFAF8]">
				<div className="mx-auto w-full max-w-5xl px-6 py-8">
					{/* --- BACK NAV --- */}
					<Link
						href={receiptData.backHref}
						className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#00773A]"
					>
						<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M15.5 19L8.5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>Kembali ke Beli Pelatihan</span>
					</Link>

					{/* --- SUCCESS HERO --- */}
					<SuccessCard
						heading="Pembayaran Berhasil!"
						description="Terima kasih, pembayaran Anda telah kami terima. Pelatihan Anda kini telah aktif."
					/>

					{/* --- DETAIL GRID --- */}
					<section className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
						{/* --- ACTIVE COURSE CARD --- */}
						<article className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
							<div className="relative aspect-[16/10] w-full bg-[#0B1220]">
								<img
									src={receiptData.courseThumbnail}
									alt={receiptData.courseTitle}
									className="h-full w-full object-cover"
									loading="lazy"
								/>
								<span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#008740] px-3 py-1 text-xs font-bold text-white">
									Kursus Aktif
								</span>
							</div>

							<div className="p-6">
								<h2 className="text-xl font-extrabold leading-tight text-[#101828]">
									{receiptData.courseTitle}
								</h2>
								<div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#667085]">
									<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path d="M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" />
										<path d="M2.5 19c.6-2.8 2.8-4.5 5.5-4.5M21.5 19c-.6-2.8-2.8-4.5-5.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
									</svg>
									<span>{receiptData.courseBatch}</span>
								</div>

								<Link
									href={receiptData.accessHref}
									className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#F57F1E] focus:outline-none focus:ring-4 focus:ring-[#FF8928]/25"
								>
									<span>Lihat Pelatihan Sekarang</span>
									<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 6l6 4-6 4V8z" />
									</svg>
								</Link>
							</div>
						</article>

						{/* --- TRANSACTION SUMMARY --- */}
						<article className="rounded-2xl bg-white p-6 ring-1 ring-black/10">
							<header className="mb-4 border-b border-black/10 pb-4">
								<h2 className="text-lg font-extrabold text-[#101828]">Ringkasan Transaksi</h2>
							</header>

							<dl className="space-y-4">
								<div className="flex items-center justify-between">
									<dt className="text-sm font-semibold text-[#667085]">Order ID</dt>
									<dd className="text-sm font-bold text-[#101828]">{receiptData.orderId}</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-sm font-semibold text-[#667085]">Tanggal</dt>
									<dd className="text-sm font-bold text-[#101828]">{receiptData.transactionDate}</dd>
								</div>
								<div className="flex items-start justify-between gap-4">
									<dt className="text-sm font-semibold text-[#667085]">Metode Pembayaran</dt>
									<dd className="text-right text-sm font-bold text-[#101828]">{receiptData.paymentMethod}</dd>
								</div>
								<div className="flex items-center justify-between border-t border-black/10 pt-4">
									<dt className="text-sm font-semibold text-[#667085]">Total Dibayar</dt>
									<dd className="text-lg font-extrabold text-[#008740]">{formatRupiah(receiptData.totalPaid)}</dd>
								</div>
							</dl>

							<div className="mt-5 flex items-start gap-2 rounded-xl bg-[#E9F7EF] p-3">
								<svg className="mt-0.5 h-4 w-4 shrink-0 text-[#008740]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path d="M12 2.5l7 3.5v6.6c0 4.9-3 9.1-7 10.9-4-1.8-7-6-7-10.9V6l7-3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
									<path d="M9.2 12.2l1.8 1.9 3.8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<p className="text-xs font-semibold leading-5 text-[#027A48]">
									Transaksi ini aman dan terverifikasi secara otomatis oleh sistem kami.
								</p>
							</div>
						</article>
					</section>
				</div>
			</div>
		</DashboardLayout>
	);
}