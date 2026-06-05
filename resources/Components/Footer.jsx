export default function Footer() {
    return (
        <footer className="bg-[#1B1C1C] text-white py-12 mt-auto border-t border-gray-800">
            <div className="max-w-[1200px] mx-auto px-10 flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="max-w-[400px]">
                    <div className="font-['Public_Sans'] font-bold text-2xl text-white mb-4">
                        Pensiun Mudah
                    </div>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#E4E2E1] text-base leading-[24px] opacity-80">
                        Platform persiapan masa pensiun komprehensif. Memberdayakan profesional untuk transisi kehidupan yang lebih baik, stabil, dan bermakna.
                    </p>
                </div>
                
                <div className="flex gap-16">
                    <div className="flex flex-col gap-3">
                        <span className="font-['Public_Sans'] font-bold text-[#FF8928] mb-2">Layanan</span>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">LMS Pelatihan</a>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">Webinar & Event</a>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">Program Korporat</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="font-['Public_Sans'] font-bold text-[#FF8928] mb-2">Bantuan</span>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">Hubungi Kami</a>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">Syarat & Ketentuan</a>
                        <a href="#" className="font-['Atkinson_Hyperlegible'] text-gray-300 hover:text-white transition-colors">Kebijakan Privasi</a>
                    </div>
                </div>
            </div>
            
            <div className="max-w-[1200px] mx-auto px-10 mt-12 pt-8 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500 font-['Atkinson_Hyperlegible']">
                <span>&copy; {new Date().getFullYear()} Pensiun Mudah. Seluruh hak cipta dilindungi.</span>
            </div>
        </footer>
    );
}