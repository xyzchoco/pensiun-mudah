import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function useFlashToast() {
    const { props } = usePage();
    const flash = props?.flash || {};

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error]);
}