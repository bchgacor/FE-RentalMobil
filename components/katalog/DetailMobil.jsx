import GaleriMobil from "./GaleriMobil";
import { rupiah } from "@/lib/format";

// Kolom kiri halaman pesan: foto, tarif, spesifikasi, dan ulasan.
export default function DetailMobil({ mobil }) {
  const sopir = mobil.jenis === "ds";
  return (
    <section aria-label="Detail mobil">
      <div className="kotak">
        <GaleriMobil nama={mobil.nama} foto={mobil.foto} />
        <h2 style={{ marginBottom: "4px" }}>{mobil.nama}</h2>
        <p>
          <b>{sopir ? "Dengan sopir:" : "Lepas kunci:"}</b> {rupiah(mobil.tarif)}/hari.
        </p>
        <table className="spek-tabel">
          <tbody>
            {mobil.spek.map(([label, nilai]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{nilai}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sopir ? (
          <>
            <div className="grid grid-2">
              <div>
                <p className="tebal">Termasuk:</p>
                <ul className="daftar-tanda">
                  <li>Mobil</li>
                  <li>Sopir</li>
                  <li>BBM</li>
                </ul>
              </div>
              <div>
                <p className="tebal">Ditanggung penyewa:</p>
                <ul className="daftar-tanda tidak">
                  <li>Makan sopir</li>
                  <li>Tol</li>
                  <li>Parkir</li>
                  <li>Penginapan sopir</li>
                </ul>
              </div>
            </div>
            <p className="kecil abu">Hanya untuk tujuan di Malang dan Batu.</p>
          </>
        ) : (
          <p className="kecil abu">
            Tanpa batas kilometer. Mobil dikembalikan paling lambat tanggal kembali pukul 23.59.
          </p>
        )}
      </div>
      <h3 className="jarak-kecil">Ulasan</h3>
      <div className="kotak ulasan">
        <div className="bintang">{"★".repeat(mobil.ulasan.bintang)}</div>
        <p>{mobil.ulasan.teks}</p>
        <div className="penulis">
          <span className="avatar">{mobil.ulasan.nama[0]}</span>
          <b>{mobil.ulasan.nama}</b>
        </div>
      </div>
    </section>
  );
}
