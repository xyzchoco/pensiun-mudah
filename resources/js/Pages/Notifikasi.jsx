import { Link, router, Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import KorporatLayout from "@/Layouts/KorporatLayout";
import InstansiLayout from "@/Layouts/InstansiLayout";

/* ===== Konfigurasi tampilan per-type ===== */
const typeStyles = {
    success: {
        border: "border-l-[#006B32]",
        iconBorder: "border-[#006B32]",
        iconBg: "bg-[#E5F0E9]",
        iconColor: "text-[#006B32]",
        titleColor: "text-[#1B1C1C]",
        btn: "bg-[#006B32] hover:bg-green-800 text-white",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    },
    danger: {
        border: "border-l-[#DC2626]",
        iconBorder: "border-[#DC2626]",
        iconBg: "bg-[#FEE2E2]",
        iconColor: "text-[#DC2626]",
        titleColor: "text-[#DC2626]",
        btn: "bg-[#DC2626] hover:bg-red-700 text-white",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        ),
    },
    warning: {
        border: "border-l-[#FF8928]",
        iconBorder: "border-[#FF8928]",
        iconBg: "bg-[#FFF3E8]",
        iconColor: "text-[#FF8928]",
        titleColor: "text-[#B45309]",
        btn: "bg-[#FF8928] hover:bg-orange-600 text-white",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        ),
    },
    info: {
        border: "border-l-[#FF8928]",
        iconBorder: "border-[#FF8928]",
        iconBg: "bg-[#FFF3E8]",
        iconColor: "text-[#FF8928]",
        titleColor: "text-[#1B1C1C]",
        btn: "bg-[#FF8928] hover:bg-orange-600 text-white",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        ),
    },
    reminder: {
        border: "border-l-[#FF8928]",
        iconBorder: "border-[#FF8928]",
        iconBg: "bg-[#FFF3E8]",
        iconColor: "text-[#FF8928]",
        titleColor: "text-[#1B1C1C]",
        btn: "bg-[#FF8928] hover:bg-orange-600 text-white",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
};

export default function Notifikasi({ notifications = [] }) {
    const { auth } = usePage().props;
    const kategori = auth?.user?.kategori_pensiun;

    // ✅ Pilih layout sesuai kategori user
    const Layout =
        kategori === "korporat" ? KorporatLayout :
            kategori === "asn" ? InstansiLayout :
                DashboardLayout;

    // ✅ Tujuan tombol "Kembali" sesuai kategori
    const dashboardUrl =
        kategori === "korporat" ? "/korporat/dashboard" :
            kategori === "asn" ? "/instansi/dashboard" :
                "/dashboard";

    const markAllRead = () => {
        router.post(route("notifikasi.baca-semua"), {}, { preserveScroll: true });
    };

    const handleAction = (notif) => {
        router.post(
            route("notifikasi.baca", notif.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    if (notif.actionUrl) router.visit(notif.actionUrl);
                },
            }
        );
    };

    return (
        <Layout title="Notifikasi" showSearch={false} activeNav="">
            <Head title="Notifikasi - Pensiun Mudah" />

            <div className="max-w-4xl mx-auto w-full p-6 sm:p-8">
                {/* Tombol Kembali (dinamis) */}
                <Link
                    href={dashboardUrl}
                    className="flex items-center gap-2 text-[#006B32] font-semibold mb-8 hover:opacity-80 transition w-fit"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Dashboard
                </Link>

                {/* Breadcrumb + Header */}
                <div className="flex flex-col gap-1 mb-6">
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <Link href={dashboardUrl} className="text-[#1B1C1C] hover:text-[#006B32]">Dashboard</Link>
                        <span className="text-[#6B7280]">{">"}</span>
                        <span className="text-[#006B32]">Notifikasi</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-2">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1B1C1C] mb-2">Notifikasi Anda</h1>
                            <p className="text-[#6B7280]">Tetap terinformasi dengan aktivitas terbaru akun Anda.</p>
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex shrink-0 items-center gap-2 px-4 py-2.5 border-2 border-[#006B32] text-[#006B32] font-semibold rounded-lg hover:bg-green-50 transition"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7M5 18l4 4l10-10" />
                                </svg>
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>
                </div>

                {/* Daftar Kartu Notifikasi */}
                <div className="space-y-4">
                    {notifications.length === 0 && (
                        <div className="bg-white rounded-xl border border-[#E4E2E1] p-12 text-center text-[#6B7280]">
                            Belum ada notifikasi untuk saat ini.
                        </div>
                    )}

                    {notifications.map((notif) => {
                        const style = typeStyles[notif.type] ?? typeStyles.info;
                        return (
                            <div
                                key={notif.id}
                                className={`bg-white rounded-xl shadow-sm border border-[#E4E2E1] border-l-[6px] ${style.border} p-6 flex items-start gap-4 relative ${notif.is_read ? "opacity-70" : ""
                                    }`}
                            >
                                <div className="absolute right-6 top-6 text-xs text-[#6B7280]">{notif.time}</div>

                                <div className={`shrink-0 w-12 h-12 rounded-full border ${style.iconBorder} ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        {style.icon}
                                    </svg>
                                </div>

                                <div className="flex-1 pr-16">
                                    <h3 className={`text-lg font-bold mb-1 ${style.titleColor}`}>{notif.title}</h3>
                                    <p className="text-[#6B7280] text-sm mb-4">{notif.body}</p>

                                    {(notif.actionLabel || notif.type === "danger") && (
                                        <div className="flex flex-wrap gap-3">
                                            {notif.actionLabel && notif.actionUrl && (
                                                <button
                                                    onClick={() => handleAction(notif)}
                                                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${style.btn}`}
                                                >
                                                    {notif.actionLabel}
                                                </button>
                                            )}
                                            {notif.type === "danger" && (
                                                <a
                                                    href="/bantuan"
                                                    className="border-2 border-[#E4E2E1] text-[#4B5563] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition"
                                                >
                                                    Hubungi Bantuan
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {notifications.length > 0 && (
                    <p className="text-center text-[#6B7280] mt-10 text-sm font-medium">
                        Menampilkan {notifications.length} notifikasi terbaru
                    </p>
                )}
            </div>
        </Layout>
    );
}