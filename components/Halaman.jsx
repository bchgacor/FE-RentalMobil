import Navbar from "./Navbar";
import Footer from "./Footer";
import Penjaga from "./sesi/Penjaga";

// Kerangka semua halaman publik: navbar, isi halaman, footer.
// gaya: CSS tambahan khusus halaman ("katalog", "pesan", "riwayat", "about").
// akses: kosong = boleh siapa saja; "user" = wajib login pelanggan; "tamu-saja" = halaman masuk/daftar.
export default function Halaman({ aktif, gaya = [], akses, children }) {
  const kelas = ["h-umum", ...gaya.map((g) => `h-${g}`)].join(" ");
  return (
    <div className={kelas}>
      <Navbar aktif={aktif} />
      {akses ? <Penjaga akses={akses}>{children}</Penjaga> : children}
      <Footer />
    </div>
  );
}
