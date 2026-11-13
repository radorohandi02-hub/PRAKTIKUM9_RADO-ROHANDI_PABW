# SiPustaka React (Laravel React Starter Kit + HMVC)

Paket ini berisi SEMUA kode buatan sendiri (auth role, middleware, 3 modul HMVC, halaman React).
Project dasarnya dibuat dari React Starter Kit resmi, dikunci ke commit fa49dc8
(Laravel 12 + Inertia 2 + Fortify), supaya cocok dengan PHP 8.2 dan kode di paket ini.

Prasyarat: PHP 8.2+, Composer, Node.js 20.19+ (atau 22.12+) beserta npm, Git, MySQL (XAMPP).

## 1. Buat project dari React Starter Kit
   git clone https://github.com/laravel/react-starter-kit sipustaka_hmvc_react
   cd sipustaka_hmvc_react
   git checkout fa49dc8
   rmdir /s /q .git
   composer install
   copy .env.example .env
   php artisan key:generate

## 2. Database
Buat database `db_sipustaka` di phpMyAdmin, lalu ubah .env:
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=db_sipustaka
   DB_USERNAME=root
   DB_PASSWORD=

## 3. Pasang nwidart/laravel-modules (+ merge-plugin)
   composer require nwidart/laravel-modules
(jawab y jika ditanya izin plugin wikimedia/composer-merge-plugin)

## 4. Pasang paket JavaScript
   npm install

## 5. Buat modul, lalu salin kode paket ini
   php artisan module:make Buku Peminjaman UserManagement
   robocopy "C:\LOKASI\EKSTRAK\sipustaka_react_overlay" . /E

## 6. Patch otomatis (composer.json, app.css @source, tsconfig)
   php setup/patch-project.php
   composer dump-autoload
   php artisan module:list

## 7. Migrasi, seeder, storage
   php artisan migrate:fresh --seed
   php artisan storage:link
   php artisan optimize:clear

## 8. Jalankan (dua terminal)
   Terminal 1:  php artisan serve
   Terminal 2:  npm run dev
(atau sekali saja: npm run build, lalu cukup php artisan serve)

Buka http://127.0.0.1:8000/login
   admin : admin@sipustaka.test / password
   user  : user@sipustaka.test  / password

## Pengujian & bukti laporan
1. 403   : login sebagai user, buka http://127.0.0.1:8000/users -> screenshot (dengan URL).
2. AJAX  : buka /peminjaman, F12 -> Network -> Fetch/XHR. Tambah, ubah, hapus data;
           screenshot request data, POST, DELETE (edit memakai POST + _method=PUT).
3. 422   : kirim form peminjaman kosong -> pesan error di bawah input + respons 422.
4. Upload: tambah data dengan bukti; klik "Lihat"; edit dengan berkas baru (lama terhapus);
           hapus data (berkas ikut terhapus).
5. Folder: screenshot storage/app/public/bukti/
6. phpMyAdmin: db_sipustaka -> peminjaman -> kolom bukti (contoh bukti/xxxx.jpg)
7. Pesan sukses: screenshot setelah tambah/ubah/hapus (Buku, User, Peminjaman).
8. Proteksi akun sendiri: admin tidak punya tombol Hapus di akunnya; ubah role sendiri
   menjadi user ditolak dengan pesan error.
9. Register: daftar akun baru di /register -> role otomatis `user`.
10. Sidebar: login admin tampil menu User Management, login user tidak.

## Troubleshooting
- "Unable to locate file in Vite manifest" / halaman putih -> jalankan npm run dev (atau npm run build).
- "Page not found: Buku::index" -> pastikan langkah 5 (robocopy) dan 6 (patch) sudah dijalankan,
  lalu restart npm run dev.
- Class Modules\... tidak ditemukan -> composer dump-autoload, cek php artisan module:list.
- Tombol/gaya tidak muncul pada halaman modul -> cek app.css memuat baris
  @source '../../Modules/**/*.tsx'; lalu restart npm run dev.
- Bukti 404 -> php artisan storage:link (di Windows jalankan terminal sebagai Administrator bila gagal).
- Jangan pakai `composer run dev` di Windows (laravel/pail butuh ekstensi pcntl).
