import Halaman from "@/components/Halaman";
import KartuPesanan from "@/components/riwayat/KartuPesanan";
import { BERLANGSUNG, RIWAYAT } from "@/data/riwayat";

export const metadata = { title: "Riwayat Pemesanan" };

export default function HalamanRiwayat() {
  return (
    <Halaman mode="pelanggan" aktif="riwayat" gaya={["riwayat"]}>
      <section className="hero banner">
        <h1>
          RIWAYAT <span>PEMESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        {/* Tab tanpa JavaScript: radio tersembunyi + label */}
        <input className="tab-radio" type="radio" name="tab-riwayat" id="tab-1" defaultChecked />
        <input className="tab-radio" type="radio" name="tab-riwayat" id="tab-2" />
        <div className="tab-bar">
          <label className="tab" htmlFor="tab-1">
            Berlangsung
          </label>
          <label className="tab" htmlFor="tab-2">
            Riwayat
          </label>
        </div>
        <div className="panel p-1">
          {BERLANGSUNG.map((p) => (
            <KartuPesanan key={p.nomor} pesanan={p} />
          ))}
        </div>
        <div className="panel p-2">
          {RIWAYAT.map((p) => (
            <KartuPesanan key={p.nomor} pesanan={p} />
          ))}
        </div>
        <p className="kecil abu">Menampilkan 10 pesanan per halaman.</p>
      </main>
    </Halaman>
  );
}
