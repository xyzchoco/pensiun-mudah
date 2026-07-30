import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F6F3F2] to-[#FFFFFF] p-6">
            <Head title="Konfirmasi Kata Sandi" />

            <div className="w-full max-w-[520px] bg-white border border-[#E4E2E1] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] p-14">

                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <img src="/images/logo.png" alt="Pensiun Mudah Logo" className="h-[56px] w-auto" />
                </div>

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="font-['Public_Sans'] font-semibold text-2xl text-[#1B1C1C] mb-2">Konfirmasi Kata Sandi</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-base">Ini adalah area aman. Harap konfirmasi kata sandi Anda sebelum melanjutkan.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg text-[#1B1C1C]">Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-[#FBF9F8] border border-[#E4E2E1] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="Masukkan kata sandi Anda"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={processing}
                        className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg py-4 rounded-lg transition-all"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi'}
                    </button>
                </form>
            </div>
        </div>
    );
}
