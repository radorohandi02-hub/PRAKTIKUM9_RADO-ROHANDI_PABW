<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\UserManagement\Http\Requests\UserRequest;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'role')
            ->latest()
            ->paginate(10);

        return Inertia::render('UserManagement::index', ['users' => $users]);
    }

    public function create(): Response
    {
        return Inertia::render('UserManagement::form', ['user' => null]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        User::create($request->validated());

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('UserManagement::form', [
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        // Admin tidak boleh menurunkan role akunnya sendiri
        if ($user->id === auth()->id() && $request->role !== 'admin') {
            return back()->withErrors(['role' => 'Anda tidak dapat menurunkan role akun sendiri.']);
        }

        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'User berhasil diubah.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Admin tidak boleh menghapus akunnya sendiri
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}
