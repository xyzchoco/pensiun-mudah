import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    // Ngambil data user dari Inertia
    const { auth } = usePage().props;

    return (
        <nav className="...">
            {/* ... logo dll ... */}

            <div className="flex items-center gap-4">
                {auth.user ? (
                    // JIKA SUDAH LOGIN, TAMPILKAN TOMBOL DASHBOARD
                    <Link href="/dashboard" className="text-[#006B32] font-bold">
                        Dashboard
                    </Link>
                ) : (
                    // JIKA BELUM LOGIN, TAMPILKAN TOMBOL MASUK/DAFTAR
                    <>
                        <Link href="/login" className="text-[#006B32] font-bold">Masuk</Link>
                        <Link href="/register" className="bg-[#FF8928] text-white px-6 py-3 rounded-lg">Daftar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}