<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Bukti Pendaftaran</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: { DEFAULT: '#006B32', light: '#00904A', dark: '#005228' },
                        accent:  { DEFAULT: '#FF8928', light: '#FFB347' },
                    }
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer utilities {
            .gradient-header { background: linear-gradient(135deg,#005228 0%,#00904A 100%); }
            .gradient-accent { background: linear-gradient(90deg,#FF8928 0%,#FFB347 100%); }
            .gradient-card   { background: linear-gradient(135deg,#f0faf3 0%,#ffffff 100%); }
        }
    </style>
</head>
<body class="bg-gray-100 p-3">
<div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">

    {{-- HEADER --}}
    <div class="gradient-header text-white px-6 py-4 text-center relative">
        <div class="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style="background:rgba(255,255,255,0.18);border:3px solid rgba(255,255,255,0.55);">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 13l4 4L19 7"/>
            </svg>
        </div>
        <h1 class="text-xl font-bold tracking-wide mb-0.5">Bukti Pendaftaran Berhasil</h1>
        <p class="text-xs opacity-90">Pelatihan Persiapan Pensiun</p>
        <div class="gradient-accent absolute bottom-0 left-0 right-0 h-1"></div>
    </div>

    {{-- PESERTA --}}
    <div class="mx-4 mt-3 bg-amber-50 border-l-4 border-accent rounded-r-lg px-3 py-2">
        <p class="text-xs font-bold uppercase tracking-widest text-primary mb-2">Informasi Peserta</p>
        <div class="flex items-center gap-2 mb-1.5">
            <svg class="w-4 h-4 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="text-sm font-semibold text-gray-700">{{ $userName }}</span>
        </div>
        <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span class="text-sm font-semibold text-gray-700">{{ $userEmail }}</span>
        </div>
    </div>



    {{-- CONTENT --}}
    <div class="px-4 pt-3 pb-2">

        <h2 class="text-xs font-bold text-primary border-b-2 border-gray-200 pb-2 mb-3 uppercase tracking-wider">Detail Pelatihan</h2>

        <div class="grid grid-cols-2 gap-1.5 mb-3">
            <div class="gradient-card border-l-4 border-primary rounded-r-lg px-3 py-2.5">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Judul Pelatihan</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ $title }}</p>
            </div>
            <div class="gradient-card border-l-4 border-primary rounded-r-lg px-3 py-2.5">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Pemateri / Instruktur</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ $instruktur }}</p>
            </div>
            <div class="gradient-card border-l-4 border-primary rounded-r-lg px-3 py-2.5">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Penyelenggara</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ $perusahaan }}</p>
            </div>
            <div class="gradient-card border-l-4 border-primary rounded-r-lg px-3 py-2.5">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Durasi Pelatihan</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ $durasi }}</p>
            </div>
        </div>

        <h2 class="text-xs font-bold text-primary border-b-2 border-gray-200 pb-2 mb-3 uppercase tracking-wider">Jadwal &amp; Lokasi</h2>

        <div class="gradient-card border border-gray-200 rounded-xl p-2 space-y-1.5 mb-2">

            <div class="flex items-center gap-3 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-100">
                <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Tanggal Pelaksanaan</p>
                    <p class="text-sm font-bold text-gray-900">{{ $tanggal }}</p>
                </div>
            </div>

            <div class="flex items-center gap-3 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-100">
                <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Waktu Pelaksanaan</p>
                    <p class="text-sm font-bold text-gray-900">{{ $jadwal }} WIB</p>
                </div>
            </div>

            <div class="flex items-center gap-3 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-100">
                <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Lokasi Pelatihan</p>
                    <p class="text-sm font-bold text-gray-900">{{ $tempat }}</p>
                </div>
            </div>

        </div>
    </div>

    {{-- FOOTER --}}
    <div class="bg-gray-50 border-t-2 border-gray-100 text-center px-6 py-2.5">
        <p class="text-xs text-gray-500">Dokumen ini digenerate pada {{ $generatedAt }}</p>
        <div class="border-t border-gray-200 pt-2 mt-2">
            <p class="text-sm font-bold tracking-widest text-primary">PENSIUN MUDAH</p>
            <p class="text-xs text-gray-400">Platform Edukasi Persiapan Pensiun Indonesia</p>
        </div>
    </div>

</div>
</body>
</html>