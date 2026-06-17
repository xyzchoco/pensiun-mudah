import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import CertificateCard from '@/Components/Certificate/CertificateCard';

export default function Sertifikat({ certificates }) {
    // DATA DUMMY: Daftar Sertifikat (fallback kalau backend belum ngirim)
    const list = certificates || [
        {
            id: 1,
            title: 'Literasi Keuangan Masa Pensiun',
            date: '12 Oktober 2023',
            image: '/images/cert-sample.png',
        },
        {
            id: 2,
            title: 'Psikologi Masa Pensiun',
            date: '05 November 2023',
            image: '/images/cert-sample.png',
        },
        {
            id: 3,
            title: 'Wellness & Kesehatan Senior',
            date: '29 Desember 2023',
            image: '/images/cert-sample.png',
        },
    ];

    return (
        <DashboardLayout title="Sertifikat" showSearch={false}>
            <Head title="Sertifikat Saya" />

            <div className="pb-10 max-w-7xl mx-auto">
                {/* --- HEADER SECTION --- */}
                <div className="mb-12 mt-2">
                    <h1 className="text-4xl font-bold text-[#006B32] mb-4">
                        Sertifikat Saya
                    </h1>
                    <p className="text-[#4B5563] text-base max-w-3xl leading-relaxed">
                        Selamat atas pencapaian Anda! Berikut adalah daftar
                        sertifikat yang telah Anda selesaikan selama perjalanan
                        pembelajaran di Pensiun Mudah.
                    </p>
                </div>

                {/* --- GRID SERTIFIKAT --- */}
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
            </div>
        </DashboardLayout>
    );
}
