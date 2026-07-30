<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sertifikat {{ $course->title }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
        }
        
        .certificate-title {
            font-family: 'Playfair Display', serif;
        }
        
        .signature-font {
            font-family: 'Alex Brush', cursive;
        }
        
        @page {
            size: A4 landscape;
            margin: 0;
        }
        
        .page {
            width: 297mm;
            height: 210mm;
            padding: 0;
            margin: 0;
        }
    </style>
</head>
<body class="m-0 p-0 antialiased">
    <div class="page relative bg-gradient-to-br from-[#FAF6F0] via-white to-[#F0F5F2] flex flex-col justify-between p-12 overflow-hidden box-border">
        
        <!-- Outer Border Frame -->
        <div class="absolute inset-0 m-6 border-[3px] border-[#D4AF37] rounded-[28px] pointer-events-none"></div>
        <!-- Inner Border Frame (Green Emerald) -->
        <div class="absolute inset-0 m-8 border-[6px] border-[#004B23] rounded-[24px] pointer-events-none"></div>
        <!-- Accent Fine Inner Border -->
        <div class="absolute inset-0 m-11 border border-[#D4AF37]/40 rounded-[20px] pointer-events-none"></div>
        
        <!-- Classic Gold Corner Ornaments -->
        <!-- Top Left -->
        <div class="absolute top-12 left-12 w-12 h-12 border-t-[3px] border-l-[3px] border-[#D4AF37] pointer-events-none"></div>
        <div class="absolute top-14 left-14 w-8 h-8 border-t border-l border-[#D4AF37]/50 pointer-events-none"></div>
        <!-- Top Right -->
        <div class="absolute top-12 right-12 w-12 h-12 border-t-[3px] border-r-[3px] border-[#D4AF37] pointer-events-none"></div>
        <div class="absolute top-14 right-14 w-8 h-8 border-t border-r border-[#D4AF37]/50 pointer-events-none"></div>
        <!-- Bottom Left -->
        <div class="absolute bottom-12 left-12 w-12 h-12 border-b-[3px] border-l-[3px] border-[#D4AF37] pointer-events-none"></div>
        <div class="absolute bottom-14 left-14 w-8 h-8 border-b border-l border-[#D4AF37]/50 pointer-events-none"></div>
        <!-- Bottom Right -->
        <div class="absolute bottom-12 right-12 w-12 h-12 border-b-[3px] border-r-[3px] border-[#D4AF37] pointer-events-none"></div>
        <div class="absolute bottom-14 right-14 w-8 h-8 border-b border-r border-[#D4AF37]/50 pointer-events-none"></div>

        <!-- Watermark Background -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <svg class="w-[450px] h-[450px] text-[#004B23]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
        </div>

        <!-- HEADER SECTION (Logo & Platform Brand) -->
        <div class="relative z-10 flex items-center justify-between w-full px-8">
            <div class="flex items-center gap-4">
                <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="h-12 w-auto">
                <div class="text-left border-l-2 border-[#004B23]/25 pl-4">
                    <h1 class="text-lg font-extrabold text-[#004B23] tracking-wide leading-none">PENSIUN MUDAH</h1>
                    <p class="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase mt-1">Platform Edukasi Pensiun Terpercaya</p>
                </div>
            </div>
            
            <div class="text-right">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest leading-none">No. Sertifikat</p>
                <p class="text-xs font-mono font-bold text-gray-800 mt-1">
                    PM-{{ str_pad($course->id, 4, '0', STR_PAD_LEFT) }}-{{ str_pad($user->user_id, 6, '0', STR_PAD_LEFT) }}
                </p>
            </div>
        </div>

        <!-- MIDDLE CONTENT AREA (Award Info) -->
        <div class="relative z-10 flex flex-col items-center justify-center text-center px-12 -mt-4">
            
            <h2 class="certificate-title text-5xl font-black text-[#004B23] tracking-[0.1em] uppercase leading-none">
                SERTIFIKAT
            </h2>
            <p class="text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase mt-2.5">
                Penyelesaian Pelatihan Resmi
            </p>

            <!-- Decorative Gold Accented Bar -->
            <div class="flex items-center justify-center gap-2 w-64 my-6">
                <div class="h-[1px] bg-[#D4AF37] flex-1"></div>
                <div class="w-2.5 h-2.5 bg-[#D4AF37] rotate-45"></div>
                <div class="h-[1px] bg-[#D4AF37] flex-1"></div>
            </div>

            <p class="text-sm font-medium text-gray-500 tracking-wide uppercase">Dengan bangga diberikan kepada</p>
            <h3 class="certificate-title text-4xl font-extrabold text-[#1b1c1c] my-3 leading-snug">
                {{ $user->name }}
            </h3>

            <div class="max-w-2xl">
                <p class="text-sm text-gray-600 leading-relaxed">
                    Atas keberhasilan menyelesaikan seluruh modul, ujian kompetensi, dan persyaratan kurikulum pembelajaran pada pelatihan terakreditasi:
                </p>
                <h4 class="text-xl font-bold text-[#004B23] mt-2 mb-3 tracking-wide">
                    "{{ $course->title }}"
                </h4>
                <p class="text-xs text-gray-400 italic">
                    Sebagai bukti nyata kesiapan diri dalam merencanakan purnabakti yang sehat, produktif, dan sejahtera.
                </p>
            </div>
        </div>

        <!-- FOOTER SECTION (Date, Wax Seal, & Signatures) -->
        <div class="relative z-10 flex items-end justify-between w-full px-8">
            <!-- Completion Date -->
            <div class="text-left w-1/3 pb-2">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Tanggal Kelulusan</p>
                <p class="text-sm font-bold text-gray-800 mt-1">
                    {{ \Carbon\Carbon::parse($enrollment->tanggal_selesai)->locale('id')->isoFormat('D MMMM YYYY') }}
                </p>
                <p class="text-[10px] text-gray-400 italic mt-0.5">Jakarta, Indonesia</p>
            </div>

            <!-- CSS Pure Gold Wax Seal -->
            <div class="flex justify-center items-center w-1/3">
                <div class="relative flex items-center justify-center w-20 h-20 -mb-2">
                    <!-- Ribbon tail 1 (Emerald) -->
                    <div class="absolute w-5 h-16 bg-[#004B23] rotate-[15deg] origin-top mt-6 rounded-b shadow-sm"></div>
                    <!-- Ribbon tail 2 (Gold) -->
                    <div class="absolute w-5 h-16 bg-[#D4AF37] -rotate-[15deg] origin-top mt-6 rounded-b shadow-sm"></div>
                    <!-- Gold starburst circle -->
                    <div class="absolute w-16 h-16 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 rounded-full border-[3px] border-amber-200 shadow-md flex items-center justify-center">
                        <div class="w-12 h-12 rounded-full border border-amber-300/40 flex flex-col items-center justify-center text-center">
                            <span class="text-[6px] font-bold text-amber-950 uppercase tracking-widest leading-none">Pensiun</span>
                            <span class="text-[6px] font-bold text-amber-950 uppercase tracking-widest leading-none">Mudah</span>
                            <svg class="w-3 h-3 text-amber-950 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signature -->
            <div class="text-center w-1/3 flex flex-col items-center">
                <div class="h-12 flex items-end justify-center mb-1">
                    <img src="{{ public_path('images/signature.png') }}" alt="Tanda Tangan" class="h-14 w-auto object-contain mix-blend-multiply">
                </div>
                <div class="w-48 border-t border-gray-300 pt-1">
                    <p class="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">M. Alvin Dzaky, M.M.</p>
                    <p class="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Direktur Pensiun Mudah</p>
                </div>
            </div>
        </div>

    </div>
</body>
</html>