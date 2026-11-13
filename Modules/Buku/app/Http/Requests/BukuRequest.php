<?php

namespace Modules\Buku\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BukuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul' => 'required|string|max:200',
            'penulis' => 'required|string|max:100',
            'penerbit' => 'required|string|max:100',
            'tahun_terbit' => 'required|integer|digits:4|min:1900|max:'.date('Y'),
            'stok' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'integer' => ':attribute harus berupa angka.',
            'tahun_terbit.digits' => 'Tahun terbit harus 4 digit.',
            'tahun_terbit.max' => 'Tahun terbit tidak boleh melebihi tahun ini.',
            'stok.min' => 'Stok tidak boleh negatif.',
        ];
    }
}
