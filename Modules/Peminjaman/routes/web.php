<?php

use Illuminate\Support\Facades\Route;
use Modules\Peminjaman\Http\Controllers\PeminjamanController;

// Dapat diakses admin maupun user (asal sudah login)
Route::middleware(['auth', 'verified'])->prefix('peminjaman')->name('peminjaman.')->group(function () {
    Route::get('/', [PeminjamanController::class, 'index'])->name('index');
    Route::get('/data', [PeminjamanController::class, 'data'])->name('data'); // harus sebelum /{peminjaman}
    Route::post('/', [PeminjamanController::class, 'store'])->name('store');
    Route::get('/{peminjaman}', [PeminjamanController::class, 'show'])->name('show');
    Route::put('/{peminjaman}', [PeminjamanController::class, 'update'])->name('update');
    Route::delete('/{peminjaman}', [PeminjamanController::class, 'destroy'])->name('destroy');
});
