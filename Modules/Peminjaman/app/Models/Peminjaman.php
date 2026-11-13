<?php

namespace Modules\Peminjaman\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjaman';

    protected $fillable = ['nama_peminjam', 'judul_buku', 'tanggal_pinjam', 'tanggal_kembali', 'status', 'bukti'];

    protected $casts = [
        'tanggal_pinjam' => 'date:Y-m-d',
        'tanggal_kembali' => 'date:Y-m-d',
    ];

    protected $appends = ['bukti_url'];

    public function getBuktiUrlAttribute(): ?string
    {
        // URL relatif agar tidak bergantung pada APP_URL
        return $this->bukti ? '/storage/'.$this->bukti : null;
    }
}
