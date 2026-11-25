import Navbar from "./Navbar";
import Footer from "./Footer";

// Kerangka semua halaman publik: navbar, isi halaman, footer.
// gaya: CSS tambahan khusus halaman ("katalog", "pesan", "riwayat", "about").
export default function Halaman({ mode = "tamu", aktif, gaya = [], children }) {
  const kelas = ["h-umum", ...gaya.map((g) => `h-${g}`)].join(" ");
  return (
    <div className={kelas}>
      <Navbar mode={mode} aktif={aktif} />
      {children}
      <Footer base={mode === "pelanggan" ? "/user" : ""} />
    </div>
  );
}
