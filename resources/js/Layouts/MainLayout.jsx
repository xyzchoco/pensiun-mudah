import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import useFlashToast from '../Hooks/useFlashToast';

export default function MainLayout({ children }) {
    useFlashToast();

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

            {/* Toast Notifications */}
            <Toaster position="top-right" />
        </div>
    );
}