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
                <button className="w-full flex items-center justify-center gap-3 border-2 border-[#006B32] text-[#006B32] font-bold py-4 rounded-lg hover:bg-green-50 transition-all">
                    <span>Masuk dengan Google</span>
                </button>

                {/* Register Link */}
                <p className="text-center mt-8 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                    Belum punya akun? <Link href={route('register')} className="text-[#006B32] font-bold">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
}