import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import CertificateCard from '@/Components/Certificate/CertificateCard';
import { Award } from 'lucide-react';

export default function Sertifikat({ certificates = [] }) {
    const list = Array.isArray(certificates) ? certificates : [];

    return (
        <DashboardLayout title="Sertifikat" showSearch={false}>
            <Head title="Sertifikat Saya" />
            <div className="pb-10 max-w-7xl mx-auto">
                <div className="mb-12 mt-2">
                    <h1 className="text-4xl font-bold text-[#006B32] mb-4">Sertifikat Saya</h1>
                    <p className="text-[#4B5563] text-base max-w-3xl leading-relaxed">
                        Selamat atas pencapaian Anda! Berikut sertifikat dari kursus yang
                        telah Anda beli/klaim dan selesaikan di Pensiun Mudah.
                    </p>
                </div>

                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#BFD1C0] bg-[#F7FBF8] py-20 text-center">
                        <Award className="h-14 w-14 text-[#9CB3A2] mb-4" />
                        <h2 className="text-xl font-bold text-[#1F2937]">Belum ada sertifikat</h2>
                        <p className="mt-2 max-w-md text-[#6B7280]">
                            Selesaikan seluruh modul dan lulus kuis final pada kursus yang kamu
                            miliki untuk membuka sertifikat.
                        </p>
                        <Link
                            href="/pelatihan"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#006B32] px-6 py-3 font-extrabold text-white hover:bg-[#00552A]"
                        >
                            Jelajahi Pelatihan
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {list.map((cert) => (
                            <CertificateCard
                                key={cert.id}
                                id={cert.id}
                                title={cert.title}
                                date={cert.date}
                                image={cert.image}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}