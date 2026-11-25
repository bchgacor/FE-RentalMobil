# Frontend Rental Mobil GantengnyaJatim Group (Next.js)

Tahap **Pertemuan 10: Design to Code & Slicing**. Desain (HTML/CSS hasil dari Figma) dipindahkan ke Next.js dan dipecah menjadi komponen. Semua halaman sudah bisa dibuka dan saling terhubung, tetapi **datanya masih data contoh** (folder `data/`). Sambungan ke back-end Laravel dikerjakan di Pertemuan 11.

## Menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev      # buka http://localhost:3000
npm run lint     # pemeriksaan kode (harus tanpa error)
npm run build    # cek semua halaman bisa dibangun
```

Halaman awal:
- Pengunjung: `/`
- Pelanggan (sudah masuk, contoh: Budi Santoso): `/user`
- Admin: `/admin/masuk` (isi email dan kata sandi apa saja, lalu Login)

## Struktur folder

```
app/                  halaman (setiap folder = satu alamat URL)
  page.jsx            beranda pengunjung  -> /
  katalog/ ...        halaman pengunjung  -> /katalog, /masuk, /daftar, ...
  pesan/[slug]/       satu halaman pesan untuk semua mobil -> /pesan/ds-xl7, /pesan/ts-brio, ...
  user/ ...           halaman pelanggan   -> /user, /user/riwayat, /user/pesan/[slug], ...
  admin/ ...          halaman admin       -> /admin/dashboard, /admin/pesanan, ...
components/           komponen yang dipakai ulang
  Halaman.jsx         kerangka halaman publik (Navbar + isi + Footer)
  Navbar.jsx, Footer.jsx
  Modal.jsx           pop-up tanpa JavaScript (CSS :target)
  Badge.jsx, Plat.jsx, Tahapan.jsx
  admin/              PanelAdmin (sidebar), HalamanAdmin (topbar), SaringStatus
  katalog/            KartuMobil, GaleriMobil, DetailMobil, FormPesan, HalamanPesan
  riwayat/            KartuPesanan, FormNilai
  konten/             isi halaman yang sama untuk pengunjung dan pelanggan (About, FAQ, Katalog, ...)
data/                 data contoh: mobil.js, riwayat.js, pesanan.js (diganti API di Pertemuan 11)
lib/format.js         format rupiah
styles/               CSS dari prototipe HTML
public/img, public/dokumen   gambar dan contoh PDF nota/laporan
```

### Tentang CSS

CSS diambil langsung dari prototipe HTML supaya tampilannya sama persis. Karena beberapa file CSS memakai nama kelas yang sama (misalnya `.kartu` di admin dan di riwayat), setiap file dibungkus kelas pembungkus:

| File | Kelas pembungkus | Dipakai di |
|---|---|---|
| `styles/index.css` | `.h-umum` | semua halaman publik |
| `styles/riwayat.css`, `about.css`, `katalog.css`, `pesan.css` | `.h-riwayat`, `.h-about`, `.h-katalog`, `.h-pesan` | halaman tertentu (prop `gaya` di komponen `Halaman`) |
| `styles/admin.css` | `.h-admin` | semua halaman admin |

File di `styles/` dibuat dari CSS prototipe dengan `node scripts/scope-css.mjs <folder-css-prototipe>`. Font Poppins disimpan di proyek lewat paket `@fontsource/poppins`.

## Checklist halaman

Semua halaman di bawah sudah dibuat, bisa dibuka, dan tampilannya dibandingkan dengan prototipe HTML (lebar 1280 px dan 390 px).

| Alamat | Halaman | Status |
|---|---|---|
| `/about` | About Us | ✓ |
| `/admin/dashboard` | Dashboard Admin - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-berjalan` | Detail RM-20261101-0004 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-dibatalkan` | Detail RM-20261020-0001 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-dikonfirmasi` | Detail RM-20261103-0010 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-menunggu-pembayaran` | Detail RM-20261104-0012 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-pengajuan-pembatalan` | Detail RM-20261102-0006 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-selesai-lunas` | Detail RM-20261018-0003 - Admin GantengnyaJatim Group | ✓ |
| `/admin/detail-selesai` | Detail RM-20261024-0002 - Admin GantengnyaJatim Group | ✓ |
| `/admin/kelola-mobil` | Kelola Mobil - Admin GantengnyaJatim Group | ✓ |
| `/admin/laporan` | Laporan - Admin GantengnyaJatim Group | ✓ |
| `/admin/masuk` | Masuk Admin | ✓ |
| `/admin/pesanan` | Pesanan - Admin GantengnyaJatim Group | ✓ |
| `/admin/selesaikan-pesanan` | Selesaikan pesanan - Admin GantengnyaJatim Group | ✓ |
| `/admin/serahkan-unit` | Serahkan unit - Admin GantengnyaJatim Group | ✓ |
| `/admin/servis` | Servis - Admin GantengnyaJatim Group | ✓ |
| `/admin/tipe-form` | Tipe mobil - Admin GantengnyaJatim Group | ✓ |
| `/admin/unit-form` | Unit mobil - Admin GantengnyaJatim Group | ✓ |
| `/cek-email` | Cek Email | ✓ |
| `/daftar` | Daftar | ✓ |
| `/faq` | FAQ | ✓ |
| `/katalog-hasil` | Car | ✓ |
| `/katalog` | Car | ✓ |
| `/lupa-sandi-terkirim` | Lupa Kata Sandi | ✓ |
| `/lupa-sandi` | Lupa Kata Sandi | ✓ |
| `/masuk` | Masuk | ✓ |
| `/` | Home | ✓ |
| `/pesan/[mobil]` | Pesan ${cariMobil(slug)?.nama ??  | ✓ |
| `/privasi` | Kebijakan Privasi | ✓ |
| `/reset-sandi` | Buat Password Baru | ✓ |
| `/syarat` | Syarat dan Ketentuan | ✓ |
| `/user/about` | About Us | ✓ |
| `/user/detail-berjalan` | Detail Pesanan | ✓ |
| `/user/detail-dibatalkan` | Detail Pesanan | ✓ |
| `/user/detail-dikonfirmasi` | Detail Pesanan | ✓ |
| `/user/detail-menunggu-pembayaran` | Detail Pesanan | ✓ |
| `/user/detail-pengajuan-pembatalan` | Detail Pesanan | ✓ |
| `/user/detail-selesai` | Detail Pesanan | ✓ |
| `/user/faq` | FAQ | ✓ |
| `/user/katalog-hasil` | Car | ✓ |
| `/user/katalog` | Car | ✓ |
| `/user/nota-va-bca` | Nota (VA BCA) | ✓ |
| `/user/nota-va-bni` | Nota (VA BNI) | ✓ |
| `/user/nota-va-mandiri` | Nota (VA Mandiri) | ✓ |
| `/user/nota` | Nota (QRIS) | ✓ |
| `/user` | Home | ✓ |
| `/user/pembayaran` | Pembayaran | ✓ |
| `/user/pesan/[mobil]` | Pesan ${cariMobil(slug)?.nama ??  | ✓ |
| `/user/privasi` | Kebijakan Privasi | ✓ |
| `/user/profil` | Edit Profile | ✓ |
| `/user/riwayat` | Riwayat Pemesanan | ✓ |
| `/user/syarat` | Syarat dan Ketentuan | ✓ |
| `/verifikasi` | Verifikasi Email | ✓ |

Catatan:
- 48 file `form-pesan-...html` di prototipe sekarang menjadi **satu** halaman dinamis `pesan/[slug]` (25 mobil, dibuat statis lewat `generateStaticParams`).
- Halaman katalog, riwayat, dan daftar pesanan admin sudah memakai data dari `data/` dan komponen (`KartuMobil`, `KartuPesanan`, tabel dengan `.map`), jadi tinggal diganti data API.

## Untuk Pertemuan 11 (integrasi API)

Yang akan ditambahkan: file `.env.local` berisi alamat API, pemanggilan API menggantikan isi folder `data/`, penanganan loading/error, dan penjagaan halaman berdasarkan login (auth guard).
