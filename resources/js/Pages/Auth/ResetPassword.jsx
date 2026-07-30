import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F6F3F2] to-[#FFFFFF] p-6">
            <Head title="Atur Ulang Kata Sandi" />

            <div className="w-full max-w-[520px] bg-white border border-[#E4E2E1] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] p-14">

                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <img src="/images/logo.png" alt="Pensiun Mudah Logo" className="h-[56px] w-auto" />
                </div>

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="font-['Public_Sans'] font-semibold text-2xl text-[#1B1C1C] mb-2">Atur Ulang Kata Sandi</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-base">Silakan tentukan kata sandi baru Anda</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Alamat Email</label>
                        <input
                            type="email"
                            className="w-full p-4 bg-[#E4E2E1]/20 border border-[#E4E2E1] rounded-lg outline-none cursor-not-allowed"
                            value={data.email}
                            readOnly
                            required
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Kata Sandi Baru</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-[#FBF9F8] border border-[#E4E2E1] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="Masukkan kata sandi baru"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>

                    {/* Password Confirmation Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-[#FBF9F8] border border-[#E4E2E1] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="Ulangi kata sandi baru"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <span className="text-red-500 text-sm">{errors.password_confirmation}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={processing}
                        className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg py-4 rounded-lg transition-all"
                    >
                        {processing ? 'Memproses...' : 'Atur Ulang Kata Sandi'}
                    </button>
                </form>
            </div>
        </div>
    );
}
