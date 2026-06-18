import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function DetailPelatihan({ course }) {

	// Fungsi format harga (tanpa 'Rp' bawaan karena di UI dipisah)
	const formatAngka = (angka) => {
		if (!angka || angka == 0) return 'GRATIS';
		return new Intl.NumberFormat('id-ID').format(angka);
	};

	return (
		<DashboardLayout title="Detail Pelatihan">
			<Head title={course.title} />

			<div className="min-h-screen bg-[#FBF9F8] pb-24">
				<div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">

					{/* Button Kembali */}
					<Link
						href={route('beli-pelatihan')}
						className="inline-flex items-center gap-2 text-[#006B32] font-['Atkinson_Hyperlegible_Next'] font-bold text-lg mb-8 hover:opacity-80 transition-opacity"
					>
						<span>&larr;</span> Kembali ke Beli Pelatihan
					</Link>

					{/* Judul & Meta Info (Dipindah ke atas video) */}
					<div className="mb-8">
						<h1 className="font-['Public_Sans'] font-bold text-[32px] md:text-[40px] leading-tight text-[#1B1C1C] mb-4">
							{course.title}
						</h1>
						<div className="flex flex-wrap items-center gap-6">
							{/* Rating Bintang */}
							<div className="flex items-center gap-2 bg-[#FFDCC6] px-3 py-1.5 rounded-full">
								<svg className="w-4 h-4 text-[#311300]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span className="font-['Atkinson_Hyperlegible_Next'] font-bold text-[#311300] text-sm">
									{course.rating_average || '4.8'} ({course.total_reviewer || '124'} Review)
								</span>
							</div>

							{/* Total Durasi */}
							<div className="flex items-center gap-2 text-[#3D4A3E]">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span className="font-['Atkinson_Hyperlegible_Next'] font-semibold text-sm">
									Total Durasi: {course.total_duration || '12 Jam'}
								</span>
							</div>
						</div>
					</div>

					{/* Layout 2 Kolom */}
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

						{/* --- KOLOM KIRI (Konten) --- */}
						<div className="w-full lg:flex-1 flex flex-col gap-10">

							{/* Video Preview */}
							<div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-[#E4E2E1]">
								<img
									src={course.thumbnail ? `/storage/${course.thumbnail.replace(/^public\//, '')}` : "/images/course-1.png"}
									className="absolute inset-0 w-full h-full object-cover"
									alt="Thumbnail"
								/>
								{/* Play Button */}
								<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
									<div className="w-20 h-20 bg-[#006B32] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
										<svg className="w-8 h-8 text-white ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z" /></svg>
									</div>
								</div>
								<div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/80 to-transparent">
									<p className="font-['Atkinson_Hyperlegible_Next'] text-white font-bold text-lg">
										Tonton Cuplikan Kursus: {course.title}
									</p>
								</div>
							</div>

							{/* Deskripsi */}
							<div>
								<h2 className="font-['Public_Sans'] font-semibold text-2xl text-[#1B1C1C] mb-4">
									Tentang Kursus Ini
								</h2>
								{/* INI KODE BUAT NGEHINDARI TAG <P> BOCOR */}
								<div
									className="prose prose-lg text-[#3D4A3E] font-['Atkinson_Hyperlegible_Next'] leading-relaxed max-w-none"
									dangerouslySetInnerHTML={{ __html: course.description }}
								/>
							</div>
						</div>

						{/* --- KOLOM KANAN (Sidebar Harga) --- */}
						<div className="w-full lg:w-[380px] shrink-0">
							<div className="sticky top-10 bg-white border-2 border-[#006B32] rounded-[24px] p-8 shadow-sm">

								<p className="font-['Atkinson_Hyperlegible_Next'] text-[#3D4A3E] font-medium text-sm mb-4">Investasi Ilmu:</p>

								<div className="mb-6">
									{/* Harga Asli dengan style Rp di atas */}
									<div className="flex flex-col text-[#006B32]">
										<span className="font-['Public_Sans'] font-bold text-3xl leading-none">Rp</span>
										<span className="font-['Public_Sans'] font-bold text-[56px] leading-tight tracking-tight">
											{formatAngka(course.price)}
										</span>
									</div>

									{course.price > 0 && (
										<p className="font-['Atkinson_Hyperlegible_Next'] font-bold text-lg text-[#C77C8A] line-through mt-1">
											Rp {formatAngka(course.price * 2)}
										</p>
									)}
								</div>

								{/* List Benefit */}
								<ul className="flex flex-col gap-4 mb-8">
									<li className="flex items-center gap-3">
										<svg className="w-6 h-6 text-[#006B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										<span className="font-['Atkinson_Hyperlegible_Next'] font-bold text-[#1B1C1C] text-sm">24 Modul Video HD</span>
									</li>
									<li className="flex items-center gap-3">
										<svg className="w-6 h-6 text-[#006B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
										<span className="font-['Atkinson_Hyperlegible_Next'] font-bold text-[#1B1C1C] text-sm">E-Book Perencanaan Keuangan</span>
									</li>
									<li className="flex items-center gap-3">
										<svg className="w-6 h-6 text-[#006B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
										<span className="font-['Atkinson_Hyperlegible_Next'] font-bold text-[#1B1C1C] text-sm">Grup WA Eksklusif Pensiunan</span>
									</li>
									<li className="flex items-center gap-3">
										<svg className="w-6 h-6 text-[#006B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
										<span className="font-['Atkinson_Hyperlegible_Next'] font-bold text-[#1B1C1C] text-sm">Sertifikat Kelulusan Resmi</span>
									</li>
								</ul>

								{/* Tombol Beli */}
								<Link
									href={`/pelatihan/${course.slug || course.id}/pembelian`}
									className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-[#311300] font-['Atkinson_Hyperlegible_Next'] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors mb-6"
								>
									Beli Sekarang
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
								</Link>

								<div className="border-t border-[#E4E2E1] pt-6">
									<p className="font-['Atkinson_Hyperlegible_Next'] text-[#3D4A3E] text-sm text-center px-4 leading-relaxed">
										Akses seumur hidup. Jaminan 7 hari uang kembali.
									</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}