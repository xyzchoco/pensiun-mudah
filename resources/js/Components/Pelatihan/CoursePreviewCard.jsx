import { useState } from 'react';

export default function CoursePreviewCard({ thumbnail, videoUrl, label }) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Fungsi konverter link YouTube menjadi embed
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    return (
        <div className="relative w-full h-[280px] sm:h-[420px] rounded-[24px] border border-[#E4E2E1] bg-black overflow-hidden shadow-sm">

            {isPlaying && videoUrl ? (
                // --- TAMPILAN IFRAME SAAT PLAY ---
                <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(videoUrl)}
                    title="Preview Kursus"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                // --- TAMPILAN THUMBNAIL SAAT BELUM PLAY ---
                <div className="group relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
                    <img
                        src={thumbnail || '/images/course-preview.png'}
                        alt={label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay & Tombol Play */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 text-[#008740] shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(0,135,64,0.7)]">
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Label Preview */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#FF8928] px-3 py-1 text-xs font-bold text-white">
                            PREVIEW
                        </span>
                        <p className="mt-3 text-lg sm:text-xl font-bold text-white leading-snug">
                            {label}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}