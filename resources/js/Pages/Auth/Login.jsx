import { useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F6F3F2] to-[#FFFFFF] p-6">
            <div className="w-full max-w-[520px] bg-white border border-[#E4E2E1] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] p-14">

                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <img src="/images/logo.png" alt="Pensiun Mudah Logo" className="h-[56px] w-auto" />
                </div>

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="font-['Public_Sans'] font-semibold text-2xl text-[#1B1C1C] mb-2">Selamat Datang</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-lg">Silakan masuk ke akun Anda</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Alamat Email</label>
                        <input
                            type="email"
                            className="w-full p-4 bg-[#FBF9F8] border border-[#E4E2E1] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="contoh@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-[#FBF9F8] border border-[#E4E2E1] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="Masukkan kata sandi Anda"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 border-[#E4E2E1] rounded" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                            <span className="font-['Atkinson_Hyperlegible'] font-semibold text-[#1B1C1C]">Ingat saya</span>
                        </label>
                        <Link href={route('password.request')} className="font-['Atkinson_Hyperlegible'] font-semibold text-[#006B32]">Lupa sandi?</Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={processing}
                        className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg py-4 rounded-lg transition-all"
                    >
                        {processing ? 'Memproses...' : 'Masuk ke Akun'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="flex-grow h-px bg-[#E4E2E1]"></div>
                    <span className="text-[#3D4A3E] font-semibold">Atau</span>
                    <div className="flex-grow h-px bg-[#E4E2E1]"></div>
                </div>

                {/* Social Login Button */}
                <a
                    href="/auth/google/redirect"
                    className="w-full flex items-center justify-center gap-3 border-2 border-[#006B32] text-[#006B32] font-bold py-4 rounded-lg hover:bg-green-50 transition-all cursor-pointer"
                >
                    {/* Logo SVG Google */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Masuk dengan Google</span>
                </a>

                {/* Register Link */}
                <p className="text-center mt-8 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                    Belum punya akun? <Link href={route('register')} className="text-[#006B32] font-bold">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
}