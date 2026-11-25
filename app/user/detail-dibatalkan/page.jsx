import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailDibatalkan() {
  return (
    <Halaman mode="pelanggan" aktif="riwayat" gaya={["riwayat"]}>
      <section className="hero banner">
        <h1>
          {"DETAIL "}
          <span>PESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <p className="kecil">
          <Link href="/user/riwayat" className="tautan">
            ← Riwayat Pemesanan
          </Link>
        </p>
        <div className="kepala-detail">
          <div>
            <h1>Pesanan RM-20261020-0001</h1>
            <span className="abu">Dibuat 20 Okt 2026, 08.00</span>
          </div>
          <Badge jenis="dibatalkan">Dibatalkan</Badge>
        </div>
        <div className="kotak">
          <h3>Tindakan</h3>
          <div className="alert galat" style={{ margin: "0" }}>
            <strong>Alasan pembatalan</strong>Kedaluwarsa: pembayaran tidak diterima dalam 1 jam.
          </div>
          <div className="aksi-detail">
            <Link href="/user/katalog" className="btn">
              Pesan lagi
            </Link>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: "20px" }}>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="kotak">
              <h3>Tahapan</h3>
              <div className="tahap" aria-label="Tahapan pesanan">
                <span>
                  <i></i>Menunggu pembayaran
                </span>
                <span>
                  <i></i>Dikonfirmasi
                </span>
                <span>
                  <i></i>Berjalan
                </span>
                <span>
                  <i></i>Selesai
                </span>
              </div>
            </div>
            <div className="kotak">
              <h3>Data Pesanan</h3>
              <dl className="data-baris">
                <dt>Tipe</dt>
                <dd>Xenia 2018</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Tanggal</dt>
                <dd>22 sampai 23 Okt 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>2 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>23 Okt 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
              </dl>
            </div>
            <div className="kotak">
              <h3>Pembayaran</h3>
              <dl className="data-baris">
                <dt>Metode</dt>
                <dd>-</dd>
                <dt>Status</dt>
                <dd>Tidak dibayar (kedaluwarsa)</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261020-0001-PAY</dd>
              </dl>
            </div>
          </div>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="kotak">
              <h3>Rincian Biaya</h3>
              <table className="tabel">
                <thead>
                  <tr>
                    <th>Uraian</th>
                    <th className="angka">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sewa Rp 300.000 × 2 hari</td>
                    <td className="angka">Rp 600.000</td>
                  </tr>
                  <tr className="total">
                    <td>Total sewa</td>
                    <td className="angka">Rp 600.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="kotak">
              <h3>Riwayat</h3>
              <ol className="timeline">
                <li>
                  Pesanan dibuat<time>20 Okt 2026, 08.00</time>
                </li>
                <li>
                  Pembayaran tidak diterima dalam 1 jam, pesanan dibatalkan<time>20 Okt 2026, 09.00</time>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </Halaman>
  );
}
