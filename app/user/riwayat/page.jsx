import Halaman from "@/components/Halaman";
import Riwayat from "@/components/pesanan/Riwayat";

export const metadata = { title: "Riwayat Pemesanan" };

export default function HalamanRiwayat() {
  return (
    <Halaman aktif="riwayat" gaya={["riwayat"]} akses="user">
      <section className="hero banner">
        <h1>
          RIWAYAT <span>PEMESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <Riwayat />
      </main>
    </Halaman>
  );
}
