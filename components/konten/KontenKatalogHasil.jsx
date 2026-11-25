import KartuMobil from "@/components/katalog/KartuMobil";
import { MOBIL } from "@/data/mobil";

// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenKatalogHasil({ base = "" }) {
  return (
    <>
      <section className="hero banner">
        <h1>
          {"KATALOG "}
          <span>MOBIL</span>
        </h1>
      </section>
      <main className="wrap">
        <form className="kotak pencarian" action={`${base}/katalog-hasil`} method="get">
          <div>
            <label htmlFor="tgl">Tanggal mulai</label>
            <input
              id="tgl"
              name="tgl_mulai"
              type="date"
              defaultValue="2026-11-10"
              min="2026-11-05"
              max="2026-12-04"
              required
            />
          </div>
          <div>
            <label htmlFor="dur">Durasi (hari)</label>
            <input id="dur" name="durasi" type="number" defaultValue="3" min="1" max="30" step="1" required />
          </div>
          <div>
            <label htmlFor="kursi">Kursi</label>
            <select id="kursi" name="kursi">
              <option value="">Semua</option>
              <option>5 kursi</option>
              <option>7 kursi</option>
              <option>9 ke atas</option>
            </select>
          </div>
          <div>
            <label htmlFor="trans">Transmisi</label>
            <select id="trans" name="transmisi">
              <option value="">Semua</option>
              <option>Manual</option>
              <option>Matic</option>
            </select>
          </div>
          <div>
            <button className="btn" type="submit">
              Cari
            </button>
          </div>
        </form>
        <p className="kecil">Tanggal mulai paling cepat besok dan paling jauh 30 hari. Durasi 1 sampai 30 hari.</p>
        <p className="abu">Mobil tersedia untuk 10 November 2026, 3 hari.</p>
        <input className="radio-tab" type="radio" name="tab" id="tab-ds" defaultChecked />{" "}
        <input className="radio-tab" type="radio" name="tab" id="tab-ts" />
        <div className="tab-baris">
          <label className="tab tab-ds" htmlFor="tab-ds">
            Dengan Sopir
          </label>{" "}
          <label className="tab tab-ts" htmlFor="tab-ts">
            Lepas Kunci
          </label>
        </div>
        <div className="grid-mobil daftar-ds">
          {MOBIL.filter((m) => m.jenis === "ds").map((m) => (
            <KartuMobil key={m.slug} mobil={m} base={base} />
          ))}
        </div>
        <div className="grid-mobil daftar-ts">
          {MOBIL.filter((m) => m.jenis === "ts").map((m) => (
            <KartuMobil key={m.slug} mobil={m} base={base} />
          ))}
        </div>
      </main>
    </>
  );
}
