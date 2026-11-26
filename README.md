# Frontend Rental Mobil GantengnyaJatim Group (Next.js)

Tahap **Pertemuan 11: Integrasi API**. Tampilan hasil slicing Pertemuan 10 sekarang tersambung ke back-end Laravel (repo `D4MAX/BE-RentalMobil`): login dengan token, katalog, pemesanan, pembayaran Midtrans, riwayat, profil, dan semua halaman admin memakai data API. Folder `data/` (data contoh) sudah dihapus.

## Menjalankan

Butuh Node.js 20 atau lebih baru, dan back-end Laravel yang sedang berjalan.

1. Salin `.env.example` menjadi `.env.local`, lalu isi:
   - `NEXT_PUBLIC_API_URL` alamat API, bawaan `http://localhost:8000/api/v1`
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` **Client Key** Midtrans sandbox (jangan pernah Server Key)
2. Di `.env` back-end tambahkan `FRONTEND_URL=http://localhost:3000`. Ini dipakai untuk izin CORS dan untuk tautan di email (verifikasi akun dan reset kata sandi).
3. Jalankan:

```bash
npm install
npm run dev      # buka http://localhost:3000
npm run lint     # pemeriksaan kode (harus tanpa error)
npm run build    # cek semua halaman bisa dibangun
```

Akun admin awal mengikuti seeder back-end. Saat login pertama admin wajib mengganti kata sandi (`/admin/ganti-sandi`).

## Cara kerja integrasi

| Bagian | File | Keterangan |
|---|---|---|
| Panggilan API | `lib/api.js` | `api.get/post/put/patch/del`, token Bearer otomatis, galat jadi `ApiError` (status, code, galat per kolom 422), `unduh()` untuk PDF |
| Sesi login | `components/sesi/SesiProvider.jsx` | token dan akun di `localStorage`; 401 = sesi habis, diarahkan ke halaman login |
| Penjagaan halaman | `components/sesi/Penjaga.jsx` | `akses="user"`, `"admin"`, atau `"tamu-saja"`; tamu diarahkan ke login dengan `?next=` |
| Memuat data | `lib/useMuat.js` | status memuat, galat, dan muat ulang |
| Kirim form | `lib/useKirim.js` | tombol sibuk dan pesan galat; galat 422 tampil di bawah isian (`components/ui/Galat.jsx`) |
| Pembayaran | `lib/midtrans.js` | Snap Midtrans dimuat saat tombol bayar diklik |

## Halaman

| Alamat | Isi | API |
|---|---|---|
| `/katalog`, `/katalog-hasil` | cari dan daftar mobil | `GET /katalog/tipe` |
| `/pesan/[id]` | form pesan | `GET /katalog/tipe/{id}`, `POST /pemesanan` |
| `/masuk`, `/daftar`, `/verifikasi-email`, `/lupa-sandi`, `/reset-password` | akun pelanggan | `/auth/*` |
| `/user/riwayat`, `/user/pesanan/[id]`, `.../bayar`, `.../nota` | riwayat, detail, bayar, nota PDF, batal, ulasan | `/pemesanan/*` |
| `/user/profil` | profil dan ganti kata sandi | `/profil` |
| `/admin/masuk`, `/admin/ganti-sandi` | login admin | `/auth/login`, `/profil/password` |
| `/admin/dashboard` | ringkasan dan tugas admin | `GET /admin/dashboard` |
| `/admin/pesanan`, `/admin/pesanan/[id]` | daftar, saring, cari, detail dan semua tindakan | `/admin/pemesanan/*` |
| `/admin/pesanan/[id]/serah-terima` | pilih unit, foto jaminan, kondisi awal | `unit-tersedia`, `serah-terima` |
| `/admin/pesanan/[id]/pengembalian` | pemeriksaan, ringkasan biaya dari back-end | `pengembalian/preview`, `pengembalian` |
| `/admin/kelola-mobil`, `.../tipe/[id]`, `.../unit/[id]` (`baru` untuk tambah) | tipe dan unit, foto, status, pulihkan dari tempat sampah | `/admin/tipe`, `/admin/unit` |
| `/admin/servis` | catat, selesai, batal servis, interval | `/admin/servis/*` |
| `/admin/laporan` | laporan per periode dan status, unduh PDF | `/admin/laporan`, `/admin/laporan/pdf` |

Halaman informasi (`/`, `/about`, `/faq`, `/syarat`, `/privasi`) tetap statis.

## Uji end-to-end

Folder `e2e/` berisi back-end tiruan (`mock-server.mjs`, meniru jawaban API Laravel) dan dua skrip Playwright (Python):
`uji_user.py` (39 pemeriksaan alur pelanggan) dan `uji_admin.py` (53 pemeriksaan alur admin, termasuk tampilan HP 390 px).

```bash
pip install playwright && python -m playwright install chromium
npm run build && npx next start -p 3100
FRONTEND_URL=http://localhost:3100 node e2e/mock-server.mjs   # terminal lain; jalankan ulang sebelum tiap skrip
python e2e/uji_user.py
python e2e/uji_admin.py
```

Skrip memakai `.env.local` dengan `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` (alamat back-end tiruan). Tangkapan layar tersimpan di `e2e/hasil/`.

## Struktur folder

```
app/                  halaman (setiap folder = satu alamat URL)
components/
  sesi/               SesiProvider, Penjaga (auth guard)
  akun/               form masuk, daftar, lupa/reset/ganti kata sandi
  katalog/, pesan/    pencarian, kartu mobil, form pesan
  pesanan/, profil/   halaman pelanggan
  admin/              PanelAdmin, HalamanAdmin, Konfirmasi, pesanan/, mobil/, lain/ (dashboard, servis, laporan)
  ui/Galat.jsx        pesan galat
lib/                  api.js, format.js, status.js, labelAdmin.js, useMuat.js, useKirim.js, midtrans.js
styles/               CSS dari prototipe HTML (tambahan.css untuk keperluan halaman API)
e2e/                  uji end-to-end
```

### Tentang CSS

CSS diambil langsung dari prototipe HTML supaya tampilannya sama persis. Karena beberapa file CSS memakai nama kelas yang sama (misalnya `.kartu` di admin dan di riwayat), setiap file dibungkus kelas pembungkus:

| File | Kelas pembungkus | Dipakai di |
|---|---|---|
| `styles/index.css` | `.h-umum` | semua halaman publik |
| `styles/riwayat.css`, `about.css`, `katalog.css`, `pesan.css` | `.h-riwayat`, `.h-about`, `.h-katalog`, `.h-pesan` | halaman tertentu (prop `gaya` di komponen `Halaman`) |
| `styles/admin.css` | `.h-admin` | semua halaman admin |

File di `styles/` dibuat dari CSS prototipe dengan `node scripts/scope-css.mjs <folder-css-prototipe>`. Font Poppins disimpan di proyek lewat paket `@fontsource/poppins`.

