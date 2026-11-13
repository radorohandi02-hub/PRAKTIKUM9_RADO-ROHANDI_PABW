<?php

namespace Modules\Buku\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Http\Requests\BukuRequest;
use Modules\Buku\Models\Buku;

class BukuController extends Controller
{
    public function index(Request $request): Response
    {
        $q = (string) $request->query('q', '');

        $buku = Buku::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($w) use ($q) {
                    $w->where('judul', 'like', "%{$q}%")
                        ->orWhere('penulis', 'like', "%{$q}%")
                        ->orWhere('penerbit', 'like', "%{$q}%");
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Buku::index', [
            'buku' => $buku,
            'filters' => ['q' => $q],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Buku::form', ['buku' => null]);
    }

    public function store(BukuRequest $request): RedirectResponse
    {
        Buku::create($request->validated());

        return redirect()->route('buku.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Buku $buku): Response
    {
        return Inertia::render('Buku::form', ['buku' => $buku]);
    }

    public function update(BukuRequest $request, Buku $buku): RedirectResponse
    {
        $buku->update($request->validated());

        return redirect()->route('buku.index')->with('success', 'Buku berhasil diubah.');
    }

    public function destroy(Buku $buku): RedirectResponse
    {
        $buku->delete();

        return redirect()->route('buku.index')->with('success', 'Buku berhasil dihapus.');
    }
}
