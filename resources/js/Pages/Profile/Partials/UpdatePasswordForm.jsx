import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm } from '@inertiajs/react';

const UpdatePasswordForm = forwardRef(function UpdatePasswordForm({ className = '' }, ref) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        if (e) {
            e.preventDefault();
        }

        if (
            !data.current_password &&
            !data.password &&
            !data.password_confirmation
        ) {
            return;
        }

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    useImperativeHandle(ref, () => ({
        submit: updatePassword,
    }));

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="current_password"
                            value="Kata Sandi Lama"
                        />

                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-[#F8F9F7] px-4 py-3 text-sm text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            autoComplete="current-password"
                        />

                        <InputError
                            message={errors.current_password}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Kata Sandi Baru" />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-[#F8F9F7] px-4 py-3 text-sm text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            autoComplete="new-password"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Baru"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full rounded-xl border border-[#DDE6DF] bg-[#F8F9F7] px-4 py-3 text-sm text-[#1B1C1C] focus:border-[#006B32] focus:ring-[#006B3222]"
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

            </form>
        </section>
    );
});

export default UpdatePasswordForm;
