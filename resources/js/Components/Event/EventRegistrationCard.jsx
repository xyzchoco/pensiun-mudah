import { useForm } from '@inertiajs/react';

export default function EventRegistrationCard({ slug }) {
    // State form pakai useForm Inertia (otomatis handle CSRF + errors dari server)
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/event/${slug}/register`);
    };

    // Class input dipakai berulang (DRY)
    const inputClass =
        'mt-2 w-full rounded-xl border border-[#E4E2E1] px-4 py-3 text-[#1B1C1C] placeholder:text-[#9CA3AF] focus:border-[#008740] focus:outline-none focus:ring-2 focus:ring-[#008740]/20';

    return (
        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#1B1C1C]">
                Formulir Pendaftaran
            </h3>

            <form onSubmit={submit} className="mt-5 space-y-4">
                {/* NAMA LENGKAP */}
                <div>
                    <label className="block text-sm font-bold text-[#1B1C1C]">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className={inputClass}
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-[#FF4D4F]">
                            {errors.full_name}
                        </p>
                    )}
                </div>

                {/* ALAMAT EMAIL */}
                <div>
                    <label className="block text-sm font-bold text-[#1B1C1C]">
                        Alamat Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="contoh@email.com"
                        required
                        className={inputClass}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-[#FF4D4F]">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* NOMOR TELEPON */}
                <div>
                    <label className="block text-sm font-bold text-[#1B1C1C]">
                        Nomor Telepon
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="0812 3456 7890"
                        required
                        className={inputClass}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-[#FF4D4F]">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* INFO ALERT */}
                <div className="flex gap-3 rounded-xl bg-[#F4FAF6] p-4">
                    <svg
                        className="w-5 h-5 shrink-0 text-[#008740]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a1.25 1.25 0 110 2.5A1.25 1.25 0 0112 7zm1.25 10h-2.5v-6h2.5v6z" />
                    </svg>
                    <p className="text-sm text-[#374151] leading-relaxed">
                        Tautan Google Meet akan dikirimkan ke email Anda 1 jam
                        sebelum acara dimulai.
                    </p>
                </div>

                {/* CTA */}
                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-3.5 font-bold text-white hover:bg-[#F57F1E] transition-colors disabled:opacity-60"
                >
                    Konfirmasi Pendaftaran
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14M13 6l6 6-6 6"
                        />
                    </svg>
                </button>

                {/* TERMS */}
                <p className="text-center text-sm text-[#6B7280]">
                    Dengan mendaftar, Anda menyetujui{' '}
                    <a
                        href="#"
                        className="font-semibold text-[#008740] underline"
                    >
                        Syarat &amp; Ketentuan
                    </a>{' '}
                    kami.
                </p>
            </form>
        </div>
    );
}
