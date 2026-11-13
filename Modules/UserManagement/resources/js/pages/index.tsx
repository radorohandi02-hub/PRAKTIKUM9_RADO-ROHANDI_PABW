import { Head, Link, router, usePage } from '@inertiajs/react';
import FlashMessage from '@/components/flash-message';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Row = { id: number; name: string; email: string; role: string };
type PageLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = {
    data: T[];
    from: number | null;
    to: number | null;
    total: number;
    links: PageLink[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
];

export default function UserIndex({ users }: { users: Paginated<Row> }) {
    const { auth } = usePage().props;

    function hapus(u: Row) {
        if (confirm(`Hapus user "${u.name}"?`)) {
            router.delete(`/users/${u.id}`, { preserveScroll: true });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Manajemen User"
                        description="Kelola akun admin dan anggota."
                    />
                    <Button asChild>
                        <Link href="/users/create">+ Tambah User</Link>
                    </Button>
                </div>

                <FlashMessage />

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u, i) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">
                                        {(users.from ?? 1) + i}
                                    </td>
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="flex gap-2 p-3">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={`/users/${u.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        {u.id !== auth.user.id && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => hapus(u)}
                                            >
                                                Hapus
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                    {users.links.map((l, i) => {
                        const label =
                            i === 0
                                ? 'Sebelumnya'
                                : i === users.links.length - 1
                                  ? 'Berikutnya'
                                  : l.label;

                        return l.url ? (
                            <Button
                                key={i}
                                asChild
                                size="sm"
                                variant={l.active ? 'default' : 'outline'}
                            >
                                <Link href={l.url} preserveScroll>
                                    {label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                disabled
                            >
                                {label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
