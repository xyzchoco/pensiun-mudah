// resources/js/Pages/Pelatihan/DetailPelatihan.jsx
import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function DetailPelatihan(props) {
	/* --- DATA & DEFAULTS --- */
	const course = props?.course || {};
	const testimonialPeople = course?.testimonials || null;

	const courseData = useMemo(() => {
		return {
			backHref: course?.backHref || "/pelatihan",
			title: course?.title || "Manajemen Keuangan Masa Pensiun",
			ratingValue: typeof course?.ratingValue === "number" ? course.ratingValue : 4.8,
			ratingCount: typeof course?.ratingCount === "number" ? course.ratingCount : 124,
			durationLabel: course?.durationLabel || "Total Durasi: 12 Jam",
			previewTitle: course?.previewTitle || "Tonton Cuplikan Kursus: Strategi Alokasi Aset 2024",
			thumbnailUrl:
				course?.thumbnailUrl ||
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
			priceNow: typeof course?.priceNow === "number" ? course.priceNow : 249000,
			priceWas: typeof course?.priceWas === "number" ? course.priceWas : 499000,
			ctaHref: course?.ctaHref || `/pelatihan/${course?.slug || course?.id}/pembelian`,
			features: Array.isArray(course?.features) && course.features.length
				? course.features
				: [
						"24 Modul Video HD",
						"E-Book Perencanaan Keuangan",
						"Grup WA Eksklusif Pensiunan",
						"Sertifikat Kelulusan Resmi",
				  ],
			description:
				course?.description ||
				"Masa pensiun bukanlah akhir dari produktivitas finansial, melainkan awal dari fase pengelolaan kekayaan yang baru. Kursus ini dirancang khusus untuk membantu Anda memahami cara menjaga nilai aset, mengelola pengeluaran pasca-pensiun, dan memastikan dana Anda cukup untuk gaya hidup impian selamanya.",
			benefits:
				Array.isArray(course?.benefits) && course.benefits.length
					? course.benefits
					: [
							{
								title: "Proteksi Aset",
								desc: "Cara melindungi tabungan dari inflasi dan risiko pasar.",
								icon: "shield",
							},
							{
								title: "Arus Kas Pasif",
								desc: "Menentukan instrumen investasi yang aman untuk pendapatan rutin.",
								icon: "cash",
							},
							{
								title: "Perencanaan Waris",
								desc: "Panduan hukum dan praktis untuk distribusi aset keluarga.",
								icon: "doc",
							},
							{
								title: "Dana Kesehatan",
								desc: "Manajemen asuransi dan biaya medis di usia emas.",
								icon: "health",
							},
					  ],
			testimonials:
				testimonialPeople && Array.isArray(testimonialPeople) && testimonialPeople.length
					? testimonialPeople
					: [
							{
								name: "Ibu Sulastri",
								role: "Pensiunan Guru",
								quote:
									"Dahulu saya bingung bagaimana mengelola uang pensiunan. Setelah ikut kursus ini, saya lebih tenang karena punya rencana yang matang.",
								avatarUrl:
									"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
							},
							{
								name: "Bpk. Budi Santoso",
								role: "Mantan Manajer Bank",
								quote:
									"Meskipun saya latar belakang perbankan, strategi khusus masa pensiun di sini sangat relevan dengan kondisi ekonomi saat ini.",
								avatarUrl:
									"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
							},
							{
								name: "Bpk. Gunawan",
								role: "Wirausaha",
								quote:
									"Materi perihal perencanaan waris sangat membantu keluarga kami dalam menyusun masa depan yang adil bagi anak-cucu.",
								avatarUrl:
									"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
							},
					  ],
		};
	}, [course, testimonialPeople]);

	/* --- HELPERS --- */
	const formatRupiah = (value) => {
		const number = typeof value === "number" ? value : 0;
		return new Intl.NumberFormat("id-ID").format(number);
	};

	const clampText = (text, maxChars) => {
		if (!text) return "";
		const cleanText = String(text).trim();
		if (cleanText.length <= maxChars) return cleanText;
		return `${cleanText.slice(0, maxChars - 1)}…`;
	};

	const getBenefitIcon = (iconName) => {
		const baseClass =
			"inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F7EF] text-[#008740] ring-1 ring-[#008740]/10";
		const iconClass = "h-5 w-5";
		const common = {
			className: baseClass,
			children: null,
		};

		if (iconName === "shield") {
			return (
				<span {...common} aria-hidden="true">
					<svg className={iconClass} viewBox="0 0 24 24" fill="none">
						<path
							d="M12 2.5l7 3.5v6.6c0 4.9-3 9.1-7 10.9-4-1.8-7-6-7-10.9V6l7-3.5z"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinejoin="round"
						/>
						<path
							d="M9.2 12.2l1.8 1.9 3.8-4"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			);
		}

		if (iconName === "cash") {
			return (
				<span {...common} aria-hidden="true">
					<svg className={iconClass} viewBox="0 0 24 24" fill="none">
						<path
							d="M4.5 7.2h15c.9 0 1.6.7 1.6 1.6v6.4c0 .9-.7 1.6-1.6 1.6h-15c-.9 0-1.6-.7-1.6-1.6V8.8c0-.9.7-1.6 1.6-1.6z"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinejoin="round"
						/>
						<path
							d="M12 10.1c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
							stroke="currentColor"
							strokeWidth="1.8"
						/>
						<path
							d="M6.6 10.2h.1M17.3 14h.1"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</span>
			);
		}

		if (iconName === "doc") {
			return (
				<span {...common} aria-hidden="true">
					<svg className={iconClass} viewBox="0 0 24 24" fill="none">
						<path
							d="M7 3.8h7.5L19 8.3V20c0 1-0.8 1.8-1.8 1.8H7c-1 0-1.8-0.8-1.8-1.8V5.6C5.2 4.6 6 3.8 7 3.8z"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinejoin="round"
						/>
						<path
							d="M14.5 3.8v4.5H19"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinejoin="round"
						/>
						<path
							d="M8.5 12h7M8.5 15.2h7"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
						/>
					</svg>
				</span>
			);
		}

		return (
			<span {...common} aria-hidden="true">
				<svg className={iconClass} viewBox="0 0 24 24" fill="none">
					<path
						d="M12 21s7-3.7 7-10.2C19 6.4 16 3.8 12 3.8S5 6.4 5 10.8C5 17.3 12 21 12 21z"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinejoin="round"
					/>
					<path
						d="M12 8.2v4.4l3 1.7"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		);
	};

	const StarIcon = ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 17.3l-5.5 3 1.1-6.1-4.4-4.3 6.2-.9L12 3.4l2.7 5.6 6.2.9-4.4 4.3 1.1 6.1L12 17.3z" />
		</svg>
	);

	const CartIcon = ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M6.2 6.8h14l-1.6 7.6H8.2L6.2 6.8z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<path
				d="M8.2 14.4L7.4 4.8H4.5"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
			<path
				d="M9.2 19.2c.7 0 1.2-.6 1.2-1.2s-.6-1.2-1.2-1.2S8 17.3 8 18s.6 1.2 1.2 1.2zM17.2 19.2c.7 0 1.2-.6 1.2-1.2s-.6-1.2-1.2-1.2S16 17.3 16 18s.6 1.2 1.2 1.2z"
				fill="currentColor"
			/>
		</svg>
	);

	const formatRatingLabel = (value) => {
		const safeValue = typeof value === "number" ? value : 0;
		return safeValue.toFixed(1).replace(".", ",");
	};

	/* --- RENDER --- */
	return (
		<DashboardLayout>
			<Head title={courseData.title} />

			<div className="min-h-screen bg-[#F6F7F8]">
				<div className="mx-auto w-full max-w-6xl px-6 py-8">
					{/* --- PAGE HEADER --- */}
					<header className="mb-7">
						<div className="mb-4">
							<Link
								href={courseData.backHref}
								className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#00773A]"
							>
								<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-black/10">
									<svg
										className="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										aria-hidden="true"
									>
										<path
											d="M15.5 19L8.5 12l7-7"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
								<span>Kembali ke Beli Pelatihan</span>
							</Link>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
							<div>
								<h1 className="text-3xl font-extrabold tracking-tight text-[#101828]">
									{courseData.title}
								</h1>

								<div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
									<div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4EA] px-3 py-1 font-semibold text-[#101828] ring-1 ring-[#FF8928]/30">
										<StarIcon className="h-4 w-4 text-[#FF8928]" />
										<span>{formatRatingLabel(courseData.ratingValue)}</span>
										<span className="font-medium text-[#667085]">
											({courseData.ratingCount} Review)
										</span>
									</div>

									<div className="inline-flex items-center gap-2">
										<svg
											className="h-4 w-4 text-[#667085]"
											viewBox="0 0 24 24"
											fill="none"
											aria-hidden="true"
										>
											<path
												d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"
												stroke="currentColor"
												strokeWidth="1.8"
											/>
											<path
												d="M12 6.8v5.2l3.6 2.2"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="font-semibold">{courseData.durationLabel}</span>
									</div>
								</div>
							</div>
						</div>
					</header>

					{/* --- HERO CONTENT (2 COLUMNS) --- */}
					<section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* --- LEFT: VIDEO PREVIEW --- */}
						<article className="lg:col-span-8">
							<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
								<div className="relative aspect-[16/9] w-full bg-[#0B1220]">
									<img
										src={courseData.thumbnailUrl}
										alt="Preview pelatihan"
										className="h-full w-full object-cover opacity-95"
										loading="lazy"
									/>

									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

									<button
										type="button"
										className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#008740] shadow-lg shadow-black/20 ring-4 ring-white/40 transition hover:bg-[#00773A] focus:outline-none focus:ring-4 focus:ring-white/60"
										aria-label="Putar preview video"
									>
										<svg
											className="ml-1 h-7 w-7 text-white"
											viewBox="0 0 24 24"
											fill="currentColor"
											aria-hidden="true"
										>
											<path d="M9 7.5v9l8-4.5-8-4.5z" />
										</svg>
									</button>

									<div className="absolute bottom-4 left-4 right-4">
										<div className="inline-flex max-w-full items-center rounded-xl bg-black/45 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
											<span className="truncate">
												{clampText(courseData.previewTitle, 72)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</article>

						{/* --- RIGHT: STICKY PRICING CARD --- */}
						<aside className="lg:col-span-4">
							<div className="lg:sticky lg:top-6">
								<div className="rounded-2xl bg-white p-6 ring-1 ring-black/10">
									<div className="rounded-2xl border-2 border-[#008740] p-6">
										<p className="text-sm font-semibold text-[#344054]">Investasi Ilmu:</p>

										<div className="mt-2">
											<div className="text-4xl font-extrabold tracking-tight text-[#008740]">
												Rp
												<span className="ml-2">{formatRupiah(courseData.priceNow)}</span>
											</div>

											<div className="mt-1 text-sm font-semibold text-[#F04438] line-through">
												Rp {formatRupiah(courseData.priceWas)}
											</div>
										</div>

										<ul className="mt-5 space-y-3 text-sm font-semibold text-[#101828]">
											{courseData.features.map((item, index) => (
												<li key={`${item}-${index}`} className="flex items-start gap-3">
													<span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#E9F7EF] text-[#008740] ring-1 ring-[#008740]/10">
														<svg
															className="h-4 w-4"
															viewBox="0 0 24 24"
															fill="none"
															aria-hidden="true"
														>
															<path
																d="M20 6L9 17l-5-5"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</span>
													<span className="leading-6">{item}</span>
												</li>
											))}
										</ul>

										<div className="mt-6">
												<Link
													href={courseData.ctaHref}
													className="relative z-20 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-4 py-3 text-sm font-extrabold text-white shadow-sm shadow-black/10 transition hover:bg-[#F57F1E] focus:outline-none focus:ring-4 focus:ring-[#FF8928]/25 pointer-events-auto"
												>
													<span>Beli Sekarang</span>
													<CartIcon className="h-5 w-5" />
												</Link>
											<p className="mt-3 text-center text-xs font-medium text-[#667085]">
												Akses seumur hidup. Jaminan 7 hari uang kembali.
											</p>
										</div>
									</div>
								</div>
							</div>
						</aside>
					</section>

					{/* --- SECTION: ABOUT COURSE --- */}
					<section className="mt-10">
						<article className="rounded-2xl bg-white p-8 ring-1 ring-black/10">
							<header className="mb-4">
								<h2 className="text-xl font-extrabold text-[#008740]">Tentang Kursus Ini</h2>
							</header>

							<p className="max-w-3xl text-sm leading-7 text-[#475467]">
								{courseData.description}
							</p>

							<div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
								{courseData.benefits.map((benefit, index) => (
									<div
										key={`${benefit.title}-${index}`}
										className="flex items-start gap-4 rounded-2xl bg-[#F8FAFC] p-5 ring-1 ring-black/5"
									>
										{getBenefitIcon(benefit.icon)}
										<div>
											<p className="text-sm font-extrabold text-[#101828]">
												{benefit.title}
											</p>
											<p className="mt-1 text-sm leading-6 text-[#667085]">
												{benefit.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</article>
					</section>

					{/* --- SECTION: TESTIMONIALS --- */}
					<section className="mt-10">
						<header className="mb-5">
							<h2 className="text-xl font-extrabold text-[#008740]">Apa Kata Mereka?</h2>
						</header>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{courseData.testimonials.map((item, index) => (
								<article
									key={`${item.name}-${index}`}
									className="rounded-2xl bg-white p-6 ring-1 ring-black/10"
								>
									<header className="mb-4 flex items-center gap-3">
										<img
											src={item.avatarUrl}
											alt={item.name}
											className="h-11 w-11 rounded-full object-cover ring-1 ring-black/10"
											loading="lazy"
										/>
										<div>
											<p className="text-sm font-extrabold text-[#101828]">{item.name}</p>
											<p className="text-xs font-semibold text-[#667085]">{item.role}</p>
										</div>
									</header>

									<p className="text-sm leading-7 text-[#475467]">
										“{item.quote}”
									</p>
								</article>
							))}
						</div>
					</section>

					{/* --- FOOTER --- */}
					<footer className="mt-12">
						<div className="rounded-2xl bg-[#EDEDED] px-8 py-10 ring-1 ring-black/5">
							<div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start">
								<div>
									<p className="text-sm font-extrabold text-[#008740]">Pensiun Mudah</p>
									<p className="mt-3 text-sm leading-7 text-[#475467]">
										Membimbing profesional berpengalaman menuju masa pensiun yang lebih bermakna,
										sehat, dan sejahtera melalui ekosistem belajar yang ramah senior.
									</p>
								</div>

								<div>
									<p className="text-sm font-extrabold text-[#101828]">Kontak</p>
									<ul className="mt-3 space-y-2 text-sm font-semibold text-[#475467]">
										<li className="flex items-center gap-2">
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-black/10">
												<svg className="h-4 w-4 text-[#667085]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
													<path d="M4 6.8h16v10.4H4V6.8z" stroke="currentColor" strokeWidth="1.8" />
													<path d="M4.8 7.6l7.2 6 7.2-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
												</svg>
											</span>
											<span>info@pensiunmudah.id</span>
										</li>
										<li className="flex items-center gap-2">
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-black/10">
												<svg className="h-4 w-4 text-[#667085]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
													<path
														d="M8.6 11.2c1.6 3.1 4.1 5.6 7.2 7.2l2.4-2.4c.3-.3.8-.4 1.2-.2 1.3.5 2.7.8 4.1.8.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C10.5 22.2 1.8 13.5 1.8 2.9 1.8 2.2 2.3 1.7 3 1.7h3.6c.7 0 1.2.5 1.2 1.2 0 1.4.3 2.8.8 4.1.1.4.1.9-.2 1.2l-2.4 2.4z"
														stroke="currentColor"
														strokeWidth="1.4"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
											<span>+62 21 1234 5678</span>
										</li>
										<li className="flex items-center gap-2">
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-black/10">
												<svg className="h-4 w-4 text-[#667085]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
													<path
														d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"
														stroke="currentColor"
														strokeWidth="1.8"
														strokeLinejoin="round"
													/>
													<path
														d="M12 10.5a2 2 0 100-4 2 2 0 000 4z"
														stroke="currentColor"
														strokeWidth="1.8"
													/>
												</svg>
											</span>
											<span>Jakarta, Indonesia</span>
										</li>
									</ul>
								</div>

								<div>
									<p className="text-sm font-extrabold text-[#101828]">Ikuti Kami</p>
									<div className="mt-3 flex items-center gap-3">
										<a
											href="#"
											className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101828] ring-1 ring-black/10 hover:bg-[#F8FAFC]"
											aria-label="Website"
										>
											<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
												<path
													d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"
													stroke="currentColor"
													strokeWidth="1.8"
												/>
												<path
													d="M2 12h20"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
												/>
												<path
													d="M12 2c2.6 2.7 4 6.2 4 10s-1.4 7.3-4 10c-2.6-2.7-4-6.2-4-10s1.4-7.3 4-10z"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinejoin="round"
												/>
											</svg>
										</a>

										<a
											href="#"
											className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101828] ring-1 ring-black/10 hover:bg-[#F8FAFC]"
											aria-label="Bagikan"
										>
											<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
												<path
													d="M16 8a3 3 0 10-2.8-4H13a3 3 0 003 3zM6 14a3 3 0 10-2.8-4H3a3 3 0 003 3zM16 20a3 3 0 10-2.8-4H13a3 3 0 003 3z"
													fill="currentColor"
													opacity="0.18"
												/>
												<path
													d="M15 6a2 2 0 11-4 0 2 2 0 014 0zM7 12a2 2 0 11-4 0 2 2 0 014 0zM15 18a2 2 0 11-4 0 2 2 0 014 0z"
													stroke="currentColor"
													strokeWidth="1.8"
												/>
												<path
													d="M7 12l4-4M7 12l4 4"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</a>
									</div>
								</div>
							</div>

							<div className="mt-10 border-t border-black/10 pt-6 text-center text-xs font-semibold text-[#667085]">
								© {new Date().getFullYear()} Pensiun Mudah. Seluruh hak cipta dilindungi. Investasi Masa Tua yang Bermakna.
							</div>
						</div>
					</footer>
				</div>
			</div>
		</DashboardLayout>
	);
}