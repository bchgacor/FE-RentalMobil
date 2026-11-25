import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";

export const metadata = { title: "Nota (VA Mandiri)" };

export default function HalamanNotaVaMandiri() {
  return (
    <Halaman mode="pelanggan" aktif="riwayat" gaya={["riwayat"]}>
      <section className="hero banner">
        <h1>
          {"NOTA "}
          <span>PEMESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <div className="nota">
          <div className="kotak">
            <div className="kop">
              <div>
                <h1 style={{ fontSize: "24px", margin: "0" }}>Nota Pemesanan</h1>
                <span className="abu">No. RM-20261104-0012</span>
              </div>
              <div>
                <Badge jenis="dikonfirmasi">Dikonfirmasi</Badge>
              </div>
            </div>
            <div className="grid grid-2">
              <div>
                <h3>Data pelanggan</h3>
                <dl className="data-baris" style={{ gridTemplateColumns: "110px 1fr" }}>
                  <dt>Nama</dt>
                  <dd>Budi Santoso</dd>
                  <dt>Email</dt>
                  <dd>budi@contoh.id</dd>
                  <dt>WhatsApp</dt>
                  <dd>0812-0000-0000</dd>
                </dl>
              </div>
              <div>
                <h3>Data pesanan</h3>
                <dl className="data-baris" style={{ gridTemplateColumns: "110px 1fr" }}>
                  <dt>Mobil</dt>
                  <dd>Innova Reborn</dd>
                  <dt>Jenis</dt>
                  <dd>Dengan sopir</dd>
                  <dt>Tanggal</dt>
                  <dd>10 sampai 12 Nov 2026</dd>
                  <dt>Kembali</dt>
                  <dd>12 Nov 2026, 23.59</dd>
                </dl>
              </div>
            </div>
            <div className="info-bayar">
              <h3>Pembayaran</h3>
              <dl className="data-baris" style={{ gridTemplateColumns: "150px 1fr" }}>
                <dt>Metode</dt>
                <dd>Virtual account Mandiri</dd>
                <dt>No. virtual account</dt>
                <dd>
                  <span className="nomor-bayar">89508 0812 0000 0000</span>
                </dd>
                <dt>Bank</dt>
                <dd>Mandiri</dd>
                <dt>Dibayar pada</dt>
                <dd>4 Nov 2026, 14.21</dd>
                <dt>Status</dt>
                <dd>Lunas</dd>
              </dl>
            </div>
            <h3 className="jarak-kecil" style={{ marginTop: "20px" }}>
              Rincian biaya
            </h3>
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
                  <td>Total dibayar (Virtual account Mandiri)</td>
                  <td className="angka">Rp 2.400.000</td>
                </tr>
              </tbody>
            </table>
            <div className="baris aksi-nota" style={{ marginTop: "20px" }}>
              <a href="/dokumen/nota-va-mandiri.pdf" className="btn" download>
                Unduh atau cetak PDF
              </a>
              <Link href="/user/detail-dikonfirmasi" className="btn garis">
                Lihat detail pesanan
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Halaman>
  );
}
