import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function SearchDropdown({ placeholder = 'Cari kursus, konsultan, webinar...' }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    const fetchResults = useCallback(async (q) => {
        if (q.trim().length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get('/search/live', { params: { q } });
            setResults(data);
            setOpen(true);
        } catch {
            setResults([]);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchResults(val);
        }, 300);
    };

    const handleFocus = () => {
        if (results.length > 0) setOpen(true);
    };

    const handleBlur = () => {
        // Delay biar klik item keburu terdeteksi
        setTimeout(() => setOpen(false), 200);
    };

    const handleSelect = () => {
        setOpen(false);
        setQuery('');
        setResults([]);
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <div className="relative w-48 sm:w-72 lg:w-96 max-w-[384px]">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D4A3E]/60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 bg-[#F0EDED] rounded-lg text-sm font-['Atkinson_Hyperlegible'] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#006B32]/30"
            />

            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-4 w-4 text-[#3D4A3E]/40" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {/* Dropdown Popup */}
            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E4E2E1] z-50 max-h-[400px] overflow-y-auto">
                    <div className="p-2">
                        {results.map((item) => (
                            <Link
                                key={item.id}
                                href={`/pelatihan/${item.slug}`}
                                onClick={handleSelect}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F0EDED] transition-colors"
                            >
                                {/* Thumbnail */}
                                <div className="w-12 h-12 rounded-lg bg-[#E4E2E1] flex-shrink-0 overflow-hidden">
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-[#3D4A3E]/40">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#1B1C1C] truncate">
                                        {item.title}
                                    </p>
                                    <p className={`text-xs font-semibold mt-0.5 ${item.isFree ? 'text-[#006B32]' : 'text-[#BA1A1A]'}`}>
                                        {item.price}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state — query >= 2 tapi ga ada hasil */}
            {open && query.trim().length >= 2 && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E4E2E1] z-50 p-6 text-center">
                    <p className="text-sm text-[#6B7280] font-['Atkinson_Hyperlegible']">
                        Tidak ditemukan hasil untuk "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}