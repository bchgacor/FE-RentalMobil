// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenKatalog({ base = "" }) {
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
            <input id="tgl" name="tgl_mulai" type="date" defaultValue="" min="2026-11-05" max="2026-12-04" required />
          </div>
          <div>
            <label htmlFor="dur">Durasi (hari)</label>
            <input id="dur" name="durasi" type="number" defaultValue="" min="1" max="30" step="1" required />
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
        <div className="kotak kosong jarak-kecil">
          <div className="ikon" aria-hidden="true">
            📅
          </div>
          <h2>Pilih tanggal dan durasi</h2>
          <p className="abu">Pilih tanggal dan durasi untuk melihat mobil yang tersedia.</p>
        </div>
      </main>
    </>
  );
}
