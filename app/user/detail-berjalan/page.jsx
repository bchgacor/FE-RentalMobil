import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailBerjalan() {
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
            <h1>Pesanan RM-20261101-0004</h1>
            <span className="abu">Dibuat 1 Nov 2026, 09.10</span>
          </div>
          <Badge jenis="berjalan">Berjalan</Badge>
        </div>
        <div className="kotak">
          <h3>Tindakan</h3>
          <p className="abu">Perpanjangan dilakukan lewat pesanan baru.</p>
          <div className="aksi-detail">
            <a href="https://wa.me/6281234567890" className="btn">
              Hubungi admin
            </a>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: "20px" }}>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="kotak">
              <h3>Tahapan</h3>
              <div className="tahap" aria-label="Tahapan pesanan">
                <span>
                  <i className="on"></i>Menunggu pembayaran
                </span>
                <span>
                  <i className="on"></i>Dikonfirmasi
                </span>
                <span>
                  <i className="on"></i>Berjalan
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
                <dd>Avanza 2024 Matic</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Tanggal</dt>
                <dd>3 sampai 5 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>3 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>5 Nov 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
                <dt>Plat nomor</dt>
                <dd>
                  <Plat>N 1234 AB</Plat>
                </dd>
              </dl>
            </div>
            <div className="kotak">
              <h3>Pembayaran</h3>
              <dl className="data-baris">
                <dt>Metode</dt>
                <dd>QRIS</dd>
                <dt>Status</dt>
                <dd>Lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261101-0004-PAY</dd>
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
                    <td>Sewa Rp 350.000 × 3 hari</td>
                    <td className="angka">Rp 1.050.000</td>
                  </tr>
                  <tr className="total">
                    <td>Total sewa</td>
                    <td className="angka">Rp 1.050.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="kotak">
              <h3>Jaminan</h3>
              <ul className="daftar-tanda">
                <li>KTP asli</li>
                <li>SIM C asli</li>
                <li>Kartu KTM</li>
                <li>Sepeda motor dan STNK (domisili Malang)</li>
              </ul>
              <p className="kecil abu">Jaminan dipegang selama sewa berjalan.</p>
            </div>
            <div className="kotak">
              <h3>Riwayat</h3>
              <ol className="timeline">
                <li>
                  Pesanan dibuat<time>1 Nov 2026, 09.10</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi<time>1 Nov 2026, 09.10</time>
                </li>
                <li>
                  Unit diserahkan<time>3 Nov 2026, 08.15</time>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </Halaman>
  );
}
