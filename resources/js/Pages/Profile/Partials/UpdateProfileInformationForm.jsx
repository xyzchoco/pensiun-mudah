import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { forwardRef, useImperativeHandle } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

const UpdateProfileInformation = forwardRef(function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}, ref) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp ?? '',
            tanggal_lahir: user.tanggal_lahir ?? '',
            kategori_pensiun: user.kategori_pensiun ?? '',
        });

    const submit = (e) => {
        if (e) {
            e.preventDefault();
        }

        patch(route('profile.update'));
    };

    useImperativeHandle(ref, () => ({
        submit,
    }));

    return (
        <section className={`h-full flex flex-col ${className}`}>
            <form onSubmit={submit} className="flex-grow flex flex-col justify-between space-y-6">
                
                {/* Diperlebar jarak gap-nya menjadi gap-x-6 dan gap-y-8 */}
                <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                    
                    <div className="sm:col-span-2 space-y-3">
                        <InputLabel htmlFor="name" value="Nama Lengkap" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3 text-base text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="space-y-3">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3 text-base text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div className="space-y-3">
                        <InputLabel htmlFor="whatsapp" value="Nomor Telepon (WhatsApp)" />

                        <div className="flex mt-1 rounded-xl border border-[#DDE6DF] bg-white focus-within:border-[#006B32] focus-within:ring-1 focus-within:ring-[#006B3222] overflow-hidden">
                            <span className="flex items-center px-4 text-base font-semibold text-[#1B1C1C] border-r border-[#DDE6DF] bg-[#F8F9F7]">+62</span>
                            <input
                                id="whatsapp"
                                type="tel"
                                className="block w-full bg-transparent px-4 py-3 text-base text-[#1B1C1C] border-0 outline-none focus:ring-0"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                autoComplete="tel"
                            />
                        </div>

                        <InputError className="mt-2" message={errors.whatsapp} />
                    </div>

                    <div className="space-y-3">
                        <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />

                        <TextInput
                            id="tanggal_lahir"
                            type="date"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3 text-base text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            value={data.tanggal_lahir ?? ''}
                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                            autoComplete="bday"
                        />

                        <InputError className="mt-2" message={errors.tanggal_lahir} />
                    </div>

                    <div className="space-y-3">
                        <InputLabel htmlFor="kategori_pensiun" value="Kategori Pensiun" />

                        <select
                            id="kategori_pensiun"
                            value={data.kategori_pensiun ?? ''}
                            onChange={(e) => setData('kategori_pensiun', e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3 text-base text-[#1B1C1C] focus:border-[#006B32] focus:outline-none focus:ring-[#006B3222]"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Pensiunan PNS">Pensiunan PNS</option>
                            <option value="Corporate (Swasta)">Corporate (Swasta)</option>
                            <option value="Wirausaha">Wirausaha</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>

                        <InputError className="mt-2" message={errors.kategori_pensiun} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

            </form>
        </section>
    );
});

export default UpdateProfileInformation;