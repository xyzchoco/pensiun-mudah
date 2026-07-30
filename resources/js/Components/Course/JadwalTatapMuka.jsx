import React from 'react';
import { format, isToday, isPast, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

const JadwalTatapMuka = ({ sesiSeminar }) => {
    if (!sesiSeminar || sesiSeminar.length === 0) {
        return (
            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">📍</span> Jadwal Tatap Muka
                </h2>
                <p className="text-gray-600 text-lg">
                    Jadwal tatap muka belum ditentukan, tunggu info dari admin ya.
                </p>
            </section>
        );
    }

    const getCountdown = (tanggal) => {
        const today = new Date();
        const sessionDate = new Date(tanggal);
        sessionDate.setHours(0, 0, 0, 0); // Normalize to start of day

        if (isToday(sessionDate)) {
            return <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">Hari ini!</span>;
        } else if (isPast(sessionDate)) {
            return <span className="bg-gray-500 text-white text-sm font-semibold px-3 py-1 rounded-full">Selesai</span>;
        } else {
            const diff = differenceInDays(sessionDate, today);
            return <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">H-{diff}</span>;
        }
    };

    const getStatusBadge = (status) => {
        let colorClass = '';
        let text = '';
        switch (status) {
            case 'hadir':
                colorClass = 'bg-green-600';
                text = 'Hadir';
                break;
            case 'tidak_hadir':
                colorClass = 'bg-red-600';
                text = 'Tidak Hadir';
                break;
            default:
                colorClass = 'bg-yellow-500';
                text = 'Belum Absen';
                break;
        }
        return <span className={`${colorClass} text-white text-sm font-semibold px-3 py-1 rounded-full`}>{text}</span>;
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3 text-3xl">📍</span> Jadwal Tatap Muka
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sesiSeminar.map((sesi) => (
                    <div key={sesi.id} className="border border-gray-200 rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{sesi.judul}</h3>
                                {getCountdown(sesi.tanggal)}
                            </div>
                            <p className="text-gray-700 text-lg mb-2">
                                <span className="font-medium">Tanggal:</span> {format(new Date(sesi.tanggal), 'EEEE, d MMMM yyyy', { locale: id })}
                            </p>
                            <p className="text-gray-700 text-lg mb-2">
                                <span className="font-medium">Jam:</span> {format(new Date(`2000-01-01T${sesi.jam}`), 'HH:mm')} WIB
                            </p>
                            <p className="text-gray-700 text-lg mb-4">
                                <span className="font-medium">Lokasi:</span> {sesi.lokasi}
                            </p>
                            {sesi.catatan && (
                                <p className="text-gray-600 text-base mb-4 italic">
                                    Catatan: {sesi.catatan}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            {sesi.link_maps ? (
                                <a
                                    href={sesi.link_maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Buka Peta
                                </a>
                            ) : (
                                <span className="text-gray-500 text-lg">Peta tidak tersedia</span>
                            )}
                            {sesi.absensi_status && getStatusBadge(sesi.absensi_status)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JadwalTatapMuka;