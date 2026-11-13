import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type UserData = { id: number; name: string; email: string; role: string };

const selectClass =
    'border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function UserForm({ user }: { user: UserData | null }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'User Management', href: '/users' },
        { title: user ? 'Edit' : 'Tambah', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (user) {
            put(`/users/${user.id}`);
        } else {
            post('/users');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user ? 'Edit User' : 'Tambah User'} />
            <div className="max-w-xl p-4">
                <Heading
                    title={user ? 'Edit User' : 'Tambah User'}
                    description="Lengkapi data akun di bawah ini."
                />

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            className={selectClass}
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            Password{' '}
                            {user && '(kosongkan jika tidak diubah)'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/users">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
