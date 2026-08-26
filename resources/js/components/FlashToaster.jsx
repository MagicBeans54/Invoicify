import React, { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function FlashToaster() {
    const { flash } = usePage().props;
    const lastFlashRef = useRef({ success: null, error: null });

    useEffect(() => {
        if (flash?.success && flash.success !== lastFlashRef.current.success) {
            toast.success(flash.success);
            lastFlashRef.current.success = flash.success;
        }
        if (flash?.error && flash.error !== lastFlashRef.current.error) {
            toast.error(flash.error);
            lastFlashRef.current.error = flash.error;
        }
    }, [flash]);

    return null;
}
