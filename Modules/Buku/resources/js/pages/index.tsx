import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import FlashMessage from '@/components/flash-message';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Buku = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};

type PageLink = { url: string | null; label: string; active: boolean };

type Paginated<T> = {
    data: T[];
    from: number | null;
    to: number | null;
    total: number;
    links: PageLink[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Buku', href: '/buku' }];

export default function BukuIndex({
    buku,
    filters,
}: {
    buku: Paginated<Buku>;
    filters: { q: string };
}) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const [q, setQ] = useState(filters.q ?? '');

    function cari(e: FormEvent) {
        e.preventDefault();
        router.get('/buku', q ? { q } : {}, { preserveState: true });
    }

    function hapus(b: Buku) {
        if (confirm(`Hapus buku "${b.judul}"?`)) {
            router.delete(`/buku/${b.id}`, { preserveScroll: true });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Buku" />
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Daftar Buku"
                        description={
                            isAdmin
                                ? 'Kelola data buku perpustakaan.'
                                : 'Daftar buku perpustakaan.'
                        }
                    />
                    {isAdmin && (
                        <Button asChild>
                            <Link href="/buku/create">+ Tambah Buku</Link>
                        </Button>
                    )}
                </div>

                <FlashMessage />

                <form onSubmit={cari} className="mb-4 flex max-w-md gap-2">
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul / penulis / penerbit"
                    />
                    <Button type="submit" variant="secondary">
                        Cari
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Judul</th>
                                <th className="p-3">Penulis</th>
                                <th className="p-3">Penerbit</th>
                                <th className="p-3">Tahun</th>
                                <th className="p-3">Stok</th>
                                {isAdmin && <th className="p-3">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {buku.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 7 : 6}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                            {buku.data.map((b, i) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-3">
                                        {(buku.from ?? 1) + i}
                                    </td>
                                    <td className="p-3">{b.judul}</td>
                                    <td className="p-3">{b.penulis}</td>
                                    <td className="p-3">{b.penerbit}</td>
                                    <td className="p-3">{b.tahun_terbit}</td>
                                    <td className="p-3">{b.stok}</td>
                                    {isAdmin && (
                                        <td className="flex gap-2 p-3">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link href={`/buku/${b.id}/edit`}>
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => hapus(b)}
                                            >
                                                Hapus
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {buku.from ?? 0}-{buku.to ?? 0} dari{' '}
                        {buku.total} buku
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {buku.links.map((l, i) => {
                            const label =
                                i === 0
                                    ? 'Sebelumnya'
                                    : i === buku.links.length - 1
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
            </div>
        </AppLayout>
    );
}
