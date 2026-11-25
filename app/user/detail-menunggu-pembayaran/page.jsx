import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailMenungguPembayaran() {
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
            <h1>Pesanan RM-20261104-0012</h1>
            <span className="abu">Dibuat 4 Nov 2026, 10.05</span>
          </div>
          <Badge jenis="menunggu">Menunggu pembayaran</Badge>
        </div>
        <div className="kotak">
          <h3>Tindakan</h3>
          <p>
            {"Sisa waktu pembayaran: "}
            <span className="countdown">00:42:15</span>
          </p>
          <div className="aksi-detail">
            <Link href="/user/pembayaran" className="btn">
              Bayar sekarang
            </Link>
            <a href="#batal-langsung" className="btn bahaya">
              Batalkan pesanan
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
                <dd>Innova Reborn</dd>
                <dt>Jenis sewa</dt>
                <dd>Dengan sopir</dd>
                <dt>Tanggal</dt>
                <dd>10 sampai 12 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>3 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>12 Nov 2026, 23.59</dd>
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
                <dd>Belum dipilih</dd>
                <dt>Status</dt>
                <dd>Menunggu pembayaran</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261104-0012-PAY</dd>
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
                    <td>Sewa Rp 800.000 × 3 hari</td>
                    <td className="angka">Rp 2.400.000</td>
                  </tr>
                  <tr className="total">
                    <td>Total sewa</td>
                    <td className="angka">Rp 2.400.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="kotak">
              <h3>Riwayat</h3>
              <ol className="timeline">
                <li>
                  Pesanan dibuat<time>4 Nov 2026, 10.05</time>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <Modal id="batal-langsung" label="Batalkan pesanan?">
          <h3>Batalkan pesanan?</h3>
          <p>Yakin batalkan pesanan?</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/user/detail-dibatalkan" className="btn bahaya sm">
              Ya, batalkan
            </Link>
          </div>
        </Modal>
      </main>
    </Halaman>
  );
}
