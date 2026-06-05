import React from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8] text-[#1B1C1C] font-['Atkinson_Hyperlegible']">
            {/* Bagian Atas: Navbar */}
            <Navbar />

            {/* Bagian Tengah: Konten Halaman (Beranda, dll akan masuk ke sini) */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Bagian Bawah: Footer */}
            <Footer />
        </div>
    );
}