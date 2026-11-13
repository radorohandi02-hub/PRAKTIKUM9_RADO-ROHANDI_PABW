import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const fields = [
    { name: 'judul', label: 'Judul', type: 'text' },
    { name: 'penulis', label: 'Penulis', type: 'text' },
    { name: 'penerbit', label: 'Penerbit', type: 'text' },
    { name: 'tahun_terbit', label: 'Tahun Terbit', type: 'number' },
    { name: 'stok', label: 'Stok', type: 'number' },
] as const;

export default function BukuForm({ buku }: { buku: Buku | null }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Buku', href: '/buku' },
        { title: buku ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        judul: buku?.judul ?? '',
        penulis: buku?.penulis ?? '',
        penerbit: buku?.penerbit ?? '',
        tahun_terbit: buku ? String(buku.tahun_terbit) : '',
        stok: buku ? String(buku.stok) : '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (buku) {
            put(`/buku/${buku.id}`);
        } else {
            post('/buku');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={buku ? 'Edit Buku' : 'Tambah Buku'} />
            <div className="max-w-xl p-4">
                <Heading
                    title={buku ? 'Edit Buku' : 'Tambah Buku'}
                    description="Lengkapi data buku di bawah ini."
                />

                <form onSubmit={submit} className="space-y-4">
                    {fields.map((f) => (
                        <div key={f.name} className="grid gap-2">
                            <Label htmlFor={f.name}>{f.label}</Label>
                            <Input
                                id={f.name}
                                type={f.type}
                                value={data[f.name]}
                                onChange={(e) =>
                                    setData(f.name, e.target.value)
                                }
                            />
                            <InputError message={errors[f.name]} />
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/buku">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
