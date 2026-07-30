import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F6F3F2] to-[#FFFFFF] p-6">
            <Head title="Lupa Kata Sandi" />

            <div className="w-full max-w-[520px] bg-white border border-[#E4E2E1] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] p-14">

                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <img src="/images/logo.png" alt="Pensiun Mudah Logo" className="h-[56px] w-auto" />
                </div>

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="font-['Public_Sans'] font-semibold text-2xl text-[#1B1C1C] mb-2">Lupa Kata Sandi?</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-lg">Masukkan email Anda untuk menerima tautan pemulihan kata sandi</p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-[#006B32] text-center">
                        {status}
                    </div>
                )}

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
                            required
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={processing}
                        className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg py-4 rounded-lg transition-all"
                    >
                        {processing ? 'Memproses...' : 'Kirim Link Reset Kata Sandi'}
                    </button>
                </form>

                {/* Back to Login Link */}
                <p className="text-center mt-8 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                    Kembali ke halaman <Link href={route('login')} className="text-[#006B32] font-bold">Masuk</Link>
                </p>
            </div>
        </div>
    );
}
