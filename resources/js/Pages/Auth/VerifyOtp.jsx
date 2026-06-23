import { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function VerifikasiOtp({
    whatsapp,
    backHref = '/register',
}) {
    // 1. Setup Form Inertia untuk Submit OTP
    const { data, setData, post, processing, errors } = useForm({
        whatsapp: whatsapp || '',
        otp: '',
    });

    // 2. Setup Timer Kirim Ulang (120 detik = 2 menit)
    const [timeLeft, setTimeLeft] = useState(120);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    // Format waktu ke MM:SS
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    // 3. Setup Kotak OTP
    const [otpArray, setOtpArray] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    // --- Logika Input Kotak ---
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otpArray];
        newOtp[index] = element.value;
        setOtpArray(newOtp);
        setData('otp', newOtp.join(''));
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otpArray[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
        if (pastedData.some(isNaN)) return;
        const newOtp = [...otpArray];
        pastedData.forEach((value, i) => newOtp[i] = value);
        setOtpArray(newOtp);
        setData('otp', newOtp.join(''));
        const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
        inputRefs.current[focusIndex].focus();
    };

    // --- Eksekusi Submit OTP ---
    const submit = (e) => {
        e.preventDefault();
        post(route('verify-otp.store'));
    };

    // --- Eksekusi Kirim Ulang WA ---
    const handleResend = () => {
        if (timeLeft > 0 || isResending) return;

        setIsResending(true);
        // Tembak route resend tanpa mengganggu state form OTP
        router.post(route('verify-otp.resend'), { whatsapp: data.whatsapp }, {
            onSuccess: () => {
                setTimeLeft(120); // Reset waktu ke 2 menit lagi
                setIsResending(false);
            },
            onError: () => {
                setIsResending(false);
            }
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Verifikasi OTP - Pensiun Mudah" />

            <div className="px-6 py-6 sm:px-10">
                <Link href="/" className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B32] text-sm font-extrabold text-white">PM</span>
                    <span className="text-lg font-extrabold">
                        <span className="text-[#006B32]">PENSIUN</span>
                        <span className="text-[#FF8928]">MUDAH</span>
                    </span>
                </Link>
            </div>

            <main className="flex flex-1 items-center justify-center px-4 pb-10">
                <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E4E2E1] bg-white shadow-sm md:grid-cols-2">
                    <div className="hidden min-h-[28rem] bg-gradient-to-br from-[#C7E0A8] via-[#7CB05A] to-[#3D7A2E] md:block" />

                    <div className="p-8 sm:p-12">
                        <h1 className="text-center text-2xl font-bold text-[#1B1C1C] sm:text-3xl">Verifikasi Kode OTP</h1>
                        <p className="mt-3 text-center text-sm text-[#3D4A3E] leading-relaxed">
                            Masukkan 6 digit kode yang telah kami kirimkan ke WhatsApp Anda <br />
                            <span className="font-bold text-[#1B1C1C] text-base">
                                {whatsapp || 'Nomor tidak ditemukan'}
                            </span>
                        </p>

                        <form onSubmit={submit}>
                            <div className="mt-8 flex justify-center gap-2 sm:gap-3">
                                {otpArray.map((dataValue, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={dataValue}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        className="h-12 w-12 rounded-lg border border-[#E4E2E1] bg-[#FBF9F8] text-center text-xl font-bold text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/30 sm:h-14 sm:w-14 transition-colors"
                                    />
                                ))}
                            </div>

                            {errors.otp && <p className="mt-3 text-center text-sm font-semibold text-red-600">{errors.otp}</p>}

                            <button
                                type="submit"
                                disabled={processing || data.otp.length < 6}
                                className={`mt-8 w-full rounded-lg py-3.5 font-bold text-white transition-all ${processing || data.otp.length < 6 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8928] hover:bg-[#F57F1E]'
                                    }`}
                            >
                                {processing ? 'Memverifikasi...' : 'Verifikasi Kode'}
                            </button>
                        </form>

                        {/* BAGIAN KIRIM ULANG YANG BARU */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#3D4A3E]">Tidak menerima kode?</p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timeLeft > 0 || isResending}
                                className={`mt-1 text-sm font-bold transition-opacity ${timeLeft > 0 || isResending ? 'text-gray-400 cursor-not-allowed' : 'text-[#006B32] hover:underline'
                                    }`}
                            >
                                {isResending ? 'Mengirim Ulang...' : timeLeft > 0 ? `Kirim ulang (${minutes}:${seconds})` : 'Kirim Ulang Sekarang'}
                            </button>
                        </div>

                        <hr className="my-6 border-[#E4E2E1]" />

                        <Link href={backHref} className="flex items-center justify-center gap-2 text-sm text-[#3D4A3E] transition-opacity hover:opacity-80">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Halaman Daftar
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}