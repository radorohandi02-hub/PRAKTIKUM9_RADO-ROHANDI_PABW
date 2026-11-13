import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Peminjaman = {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string | null;
    status: 'Dipinjam' | 'Dikembalikan';
    bukti: string | null;
    bukti_url: string | null;
};

type Errors = Record<string, string>;
type Notice = { type: 'success' | 'error'; text: string };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Peminjaman', href: '/peminjaman' },
];

const emptyValues = {
    nama_peminjam: '',
    judul_buku: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    status: 'Dipinjam',
};

const textFields = [
    { name: 'nama_peminjam', label: 'Nama Peminjam', type: 'text' },
    { name: 'judul_buku', label: 'Judul Buku', type: 'text' },
    { name: 'tanggal_pinjam', label: 'Tanggal Pinjam', type: 'date' },
    { name: 'tanggal_kembali', label: 'Tanggal Kembali', type: 'date' },
] as const;

function xsrfToken(): string {
    const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return m ? decodeURIComponent(m[1]) : '';
}

// Pembungkus fetch(): kirim cookie sesi + token CSRF, minta respons JSON
async function api(url: string, init: RequestInit = {}) {
    const res = await fetch(url, {
        credentials: 'same-origin',
        ...init,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
            ...(init.headers ?? {}),
        },
    });
    const body = await res.json().catch(() => ({}));

    return { ok: res.ok, status: res.status, body };
}

const selectClass =
    'border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function PeminjamanIndex() {
    const [rows, setRows] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Peminjaman | null>(null);
    const [values, setValues] = useState<Record<string, string>>(emptyValues);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const loadData = useCallback(async () => {
        const { ok, body } = await api('/peminjaman/data');

        if (ok) {
            setRows(body as Peminjaman[]);
        } else {
            setNotice({ type: 'error', text: 'Gagal memuat data.' });
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, [loadData]);

    function flash(n: Notice) {
        setNotice(n);
        setTimeout(() => setNotice(null), 4000);
    }

    function openCreate() {
        setEditing(null);
        setValues(emptyValues);
        setFile(null);
        setErrors({});
        setOpen(true);
    }

    async function openEdit(id: number) {
        // tampil detail satu data via fetch()
        const { ok, body } = await api(`/peminjaman/${id}`);

        if (!ok) {
            flash({ type: 'error', text: 'Gagal mengambil data.' });

            return;
        }

        const r = body as Peminjaman;
        setEditing(r);
        setValues({
            nama_peminjam: r.nama_peminjam,
            judul_buku: r.judul_buku,
            tanggal_pinjam: r.tanggal_pinjam,
            tanggal_kembali: r.tanggal_kembali ?? '',
            status: r.status,
        });
        setFile(null);
        setErrors({});
        setOpen(true);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => fd.append(k, v));

        if (file) {
            fd.append('bukti', file);
        }

        if (editing) {
            fd.append('_method', 'PUT'); // method spoofing untuk multipart
        }

        const { ok, status, body } = await api(
            editing ? `/peminjaman/${editing.id}` : '/peminjaman',
            { method: 'POST', body: fd },
        );

        setSaving(false);

        if (ok) {
            setOpen(false);
            flash({ type: 'success', text: body.message });
            loadData();
        } else if (status === 422) {
            const next: Errors = {};
            Object.entries(
                (body.errors ?? {}) as Record<string, string[]>,
            ).forEach(([field, msgs]) => {
                next[field] = msgs[0];
            });
            setErrors(next);
        } else {
            flash({ type: 'error', text: 'Terjadi kesalahan pada server.' });
        }
    }

    async function hapus(r: Peminjaman) {
        if (!confirm(`Hapus data peminjaman "${r.nama_peminjam}"?`)) {
            return;
        }

        const { ok, body } = await api(`/peminjaman/${r.id}`, {
            method: 'DELETE',
        });

        if (ok) {
            flash({ type: 'success', text: body.message });
            loadData();
        } else {
            flash({ type: 'error', text: 'Gagal menghapus data.' });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peminjaman" />
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Peminjaman"
                        description="Catat dan kelola peminjaman buku tanpa memuat ulang halaman."
                    />
                    <Button onClick={openCreate}>+ Tambah Peminjaman</Button>
                </div>

                {notice && (
                    <div
                        className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                            notice.type === 'success'
                                ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
                                : 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
                        }`}
                    >
                        {notice.text}
                    </div>
                )}

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Judul Buku</th>
                                <th className="p-3">Tgl Pinjam</th>
                                <th className="p-3">Tgl Kembali</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Bukti</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            )}
                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        Belum ada data.
                                    </td>
                                </tr>
                            )}
                            {rows.map((r, i) => (
                                <tr key={r.id} className="border-t">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{r.nama_peminjam}</td>
                                    <td className="p-3">{r.judul_buku}</td>
                                    <td className="p-3">{r.tanggal_pinjam}</td>
                                    <td className="p-3">
                                        {r.tanggal_kembali ?? '-'}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                                                r.status === 'Dipinjam'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {r.bukti_url ? (
                                            <a
                                                href={r.bukti_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Lihat
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="flex gap-2 p-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEdit(r.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => hapus(r)}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Ubah Peminjaman' : 'Tambah Peminjaman'}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi data peminjaman buku.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-3" noValidate>
                        {textFields.map((f) => (
                            <div key={f.name} className="grid gap-1.5">
                                <Label htmlFor={f.name}>{f.label}</Label>
                                <Input
                                    id={f.name}
                                    type={f.type}
                                    value={values[f.name]}
                                    onChange={(e) =>
                                        setValues({
                                            ...values,
                                            [f.name]: e.target.value,
                                        })
                                    }
                                />
                                <InputError message={errors[f.name]} />
                            </div>
                        ))}

                        <div className="grid gap-1.5">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className={selectClass}
                                value={values.status}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="Dipinjam">Dipinjam</option>
                                <option value="Dikembalikan">
                                    Dikembalikan
                                </option>
                            </select>
                            <InputError message={errors.status} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="bukti">
                                Bukti (jpg/png/pdf, maks 2 MB)
                            </Label>
                            <Input
                                id="bukti"
                                type="file"
                                ref={fileRef}
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] ?? null)
                                }
                            />
                            {editing?.bukti && (
                                <p className="text-xs text-muted-foreground">
                                    Berkas saat ini:{' '}
                                    <a
                                        href={editing.bukti_url ?? '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {editing.bukti.split('/').pop()}
                                    </a>{' '}
                                    (pilih berkas baru untuk mengganti)
                                </p>
                            )}
                            <InputError message={errors.bukti} />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
