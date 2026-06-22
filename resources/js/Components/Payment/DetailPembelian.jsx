// resources/js/Pages/Payment/DetailPembelian.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import CoursePurchaseCard from "@/Components/Payment/CoursePurchaseCard";
import PaymentMethodCard from "@/Components/Payment/PaymentMethodCard";
import OrderSummaryCard from "@/Components/Payment/OrderSummaryCard";

export default function DetailPembelian(props) {
	/* --- DATA & DEFAULTS --- */
	const order = props?.order || {};

	const orderData = useMemo(() => {
		return {
			courseId: order?.courseId || "manajemen-investasi-aman",
			backHref: order?.backHref || "/pelatihan",
			course: order?.course || {
				title: "Manajemen Investasi Aman untuk Pensiunan",
				tagline: "Mulai bangun portofolio rendah risiko yang stabil untuk masa tua yang tenang.",
				badge: "Kursus Populer",
				price: 199000,
				thumbnailUrl:
					"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
			},
			coursePrice: typeof order?.coursePrice === "number" ? order.coursePrice : 199000,
			serviceFee: typeof order?.serviceFee === "number" ? order.serviceFee : 0,
		};
	}, [order]);

	const paymentMethods = useMemo(
		() => [
			{ id: "va", title: "Virtual Account", subtitle: "BCA, Mandiri, BNI", icon: "bank" },
			{ id: "ewallet", title: "E-Wallet", subtitle: "GoPay, OVO, Dana", icon: "ewallet" },
			{ id: "qris", title: "QRIS", subtitle: "Scan QR Semua Bank", icon: "qris" },
		],
		[]
	);

	/* --- STATE --- */
	const [selectedMethod, setSelectedMethod] = useState("qris");

	/* --- HELPERS --- */
	const totalAmount = orderData.coursePrice + orderData.serviceFee;

	const buildSummaryItems = () => [
		{ label: "Harga Kursus", amount: orderData.coursePrice },
		{ label: "Biaya Layanan", amount: orderData.serviceFee, isFree: orderData.serviceFee === 0 },
	];

	const resolvePaymentRoute = (methodId) => {
		const routesByMethod = {
			va: `/payment/va/${orderData.courseId}`,
			qris: `/payment/qris/${orderData.courseId}`,
			ewallet: `/payment/ewallet/${orderData.courseId}`,
		};
		return routesByMethod[methodId] || routesByMethod.qris;
	};

	const handlePayNow = () => {
		router.visit(resolvePaymentRoute(selectedMethod), {
			method: "get",
			data: { method: selectedMethod },
		});
	};

	/* --- RENDER --- */
	return (
		<DashboardLayout>
			<Head title="Detail Pembelian" />

			<div className="min-h-screen bg-[#FBFAF8]">
				<div className="mx-auto w-full max-w-6xl px-6 py-8">
					{/* --- PAGE HEADER --- */}
					<header className="mb-6">
						<Link
							href={orderData.backHref}
							className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#00773A]"
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M15.5 19L8.5 12l7-7"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>Kembali ke Beli Pelatihan</span>
						</Link>

						<h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#101828]">
							Detail Pembelian
						</h1>
					</header>

					{/* --- MAIN GRID --- */}
					<section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* --- LEFT: COURSE + METHODS --- */}
						<div className="space-y-6 lg:col-span-8">
							<CoursePurchaseCard course={orderData.course} variant="wide" />

							{/* --- PAYMENT METHOD PICKER --- */}
							<article className="rounded-2xl bg-white p-6 ring-1 ring-black/10">
								<header className="mb-2 flex items-center gap-2">
									<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9F7EF] text-[#008740]">
										<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
											<path d="M4 9.5h16" stroke="currentColor" strokeWidth="1.8" />
										</svg>
									</span>
									<h2 className="text-lg font-extrabold text-[#101828]">Pilih Metode Pembayaran</h2>
								</header>

								<p className="text-sm leading-6 text-[#667085]">
									Pilih salah satu metode pembayaran di bawah ini untuk melanjutkan transaksi.
								</p>

								<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
									{paymentMethods.map((method) => (
										<PaymentMethodCard
											key={method.id}
											id={method.id}
											title={method.title}
											subtitle={method.subtitle}
											icon={method.icon}
											isSelected={selectedMethod === method.id}
											onSelect={setSelectedMethod}
										/>
									))}
								</div>
							</article>
						</div>

						{/* --- RIGHT: ORDER SUMMARY --- */}
						<div className="lg:col-span-4">
							<div className="lg:sticky lg:top-6">
								<OrderSummaryCard
									title="Ringkasan Pesanan"
									variant="light"
									lineItems={buildSummaryItems()}
									totalLabel="Total Bayar"
									totalAmount={totalAmount}
									note="Transaksi aman & terenkripsi. Akses kursus selamanya setelah pembayaran."
								>
									<button
										type="button"
										onClick={handlePayNow}
										className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#F57F1E] focus:outline-none focus:ring-4 focus:ring-[#FF8928]/25"
									>
										<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<path
												d="M7 10V8a5 5 0 0110 0v2"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
											/>
											<path
												d="M5.5 10h13l-.8 9.2H6.3L5.5 10z"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinejoin="round"
											/>
										</svg>
										<span>Bayar Sekarang</span>
									</button>
								</OrderSummaryCard>
							</div>
						</div>
					</section>
				</div>
			</div>
		</DashboardLayout>
	);
}