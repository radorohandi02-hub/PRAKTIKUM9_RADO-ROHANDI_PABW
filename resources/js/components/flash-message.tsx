import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="mb-4 space-y-2">
            {flash.success && (
                <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
