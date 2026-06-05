import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        whatsapp: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F6F3F2] to-white flex flex-col items-center py-10">
            {/* Header Nav */}
            <div className="w-full max-w-[1200px] h-[72px] bg-[#FBF9F8] border-b border-[#E4E2E1] flex items-center px-16 mb-10 rounded-lg">
                <img src="/images/logo.png" alt="Logo" className="h-[48px]" />
            </div>

            {/* Registration Form */}
            <div className="w-[600px] bg-white border border-[#E4E2E1] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl p-14">
                <div className="mb-8">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-2">Daftar Akun</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-lg">Lengkapi data diri Anda untuk memulai perjalanan pembelajaran.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Nama */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg">Nama Lengkap</label>
                        <input 
                            className="w-full p-4 border border-[#6D7B6D] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="Masukkan nama lengkap sesuai KTP"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <span className="text-sm text-[#3D4A3E]">Mohon gunakan nama asli Anda untuk keperluan sertifikat.</span>
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg">Alamat Email</label>
                        <input 
                            type="email"
                            className="w-full p-4 border border-[#6D7B6D] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            placeholder="contoh@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    {/* WhatsApp */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg">Nomor WhatsApp</label>
                        <div className="flex">
                            <div className="bg-[#F0EDED] border border-[#6D7B6D] border-r-0 px-4 flex items-center rounded-l-lg font-bold text-[#3D4A3E]">+62</div>
                            <input
                                className="w-full p-4 border border-[#6D7B6D] rounded-r-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                                placeholder="8123456789"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                            />
                        </div>
                        {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp}</span>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg">Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full p-4 border border-[#6D7B6D] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2">
                        <label className="font-['Atkinson_Hyperlegible'] font-bold text-lg">Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full p-4 border border-[#6D7B6D] rounded-lg focus:ring-2 focus:ring-[#006B32] outline-none"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        disabled={processing}
                        className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold text-lg py-4 rounded-lg transition-all mt-4"
                    >
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center mt-6 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                    Sudah punya akun? <Link href={route('login')} className="text-[#006B32] font-bold">Masuk di sini</Link>
                </p>
            </div>
        </div>
    );
}