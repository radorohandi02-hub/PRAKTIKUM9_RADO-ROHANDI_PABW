<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Peminjaman\Http\Requests\PeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    /** Halaman React (shell). Data diambil lewat fetch() ke endpoint JSON di bawah. */
    public function index(): Response
    {
        return Inertia::render('Peminjaman::index');
    }

    public function data(): JsonResponse
    {
        return response()->json(Peminjaman::latest()->get());
    }

    public function show(Peminjaman $peminjaman): JsonResponse
    {
        return response()->json($peminjaman);
    }

    public function store(PeminjamanRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        }

        Peminjaman::create($data);

        return response()->json(['message' => 'Data peminjaman berhasil ditambahkan.']);
    }

    public function update(PeminjamanRequest $request, Peminjaman $peminjaman): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('bukti')) {
            // ganti berkas: hapus yang lama
            if ($peminjaman->bukti) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        } else {
            unset($data['bukti']); // pertahankan berkas lama
        }

        $peminjaman->update($data);

        return response()->json(['message' => 'Data peminjaman berhasil diubah.']);
    }

    public function destroy(Peminjaman $peminjaman): JsonResponse
    {
        if ($peminjaman->bukti) {
            Storage::disk('public')->delete($peminjaman->bukti);
        }

        $peminjaman->delete();

        return response()->json(['message' => 'Data peminjaman berhasil dihapus.']);
    }
}
