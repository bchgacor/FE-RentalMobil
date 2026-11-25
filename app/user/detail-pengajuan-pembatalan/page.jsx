import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailPengajuanPembatalan() {
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
            <h1>Pesanan RM-20261102-0006</h1>
            <span className="abu">Dibuat 2 Nov 2026, 16.45</span>
          </div>
          <Badge jenis="pengajuan">Pengajuan pembatalan</Badge>
        </div>
        <div className="kotak">
          <h3>Tindakan</h3>
          <div className="alert peringatan" style={{ margin: "0" }}>
            Pengajuan sedang diproses admin.
          </div>
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
                <dd>Brio</dd>
                <dt>Jenis sewa</dt>
                <dd>Dengan sopir</dd>
                <dt>Tanggal</dt>
                <dd>12 sampai 13 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>2 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>13 Nov 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
                <dt>Tujuan</dt>
                <dd>Batu, Malang kota</dd>
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
                <dd>RM-20261102-0006-PAY</dd>
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
                    <td>Sewa Rp 600.000 × 2 hari</td>
                    <td className="angka">Rp 1.200.000</td>
                  </tr>
                  <tr className="total">
                    <td>Total sewa</td>
                    <td className="angka">Rp 1.200.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="kotak">
              <h3>Riwayat</h3>
              <ol className="timeline">
                <li>
                  Pesanan dibuat<time>2 Nov 2026, 16.45</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi<time>2 Nov 2026, 16.45</time>
                </li>
                <li>
                  Pembatalan diajukan<time>3 Nov 2026, 09.00</time>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </Halaman>
  );
}
