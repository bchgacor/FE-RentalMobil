import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";

export const metadata = { title: "Detail RM-20261103-0010 - Admin GantengnyaJatim Group" };

export default function HalamanDetailDikonfirmasi() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/pesanan" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>RM-20261103-0010</h1>
            <span className="abu">Dibuat pada 3 Nov 2026, 14.20</span>
          </div>
          <Badge jenis="dikonfirmasi">Dikonfirmasi</Badge>
        </div>
        <section className="kartu">
          <h2>Tindakan</h2>
          <p>
            {"Sebelum menyerahkan unit, periksa lokasi antar: "}
            <b>Jl. Veteran No. 1, Malang</b>. Jika di luar batas Tlogomas, hubungi pelanggan lewat WhatsApp untuk biaya
            antar.
          </p>
          <div className="aksi">
            <Link href="/admin/serahkan-unit" className="btn">
              Serahkan unit
            </Link>
          </div>
          <p className="kecil" style={{ margin: "12px 0 0" }}>
            <a href="https://wa.me/6281234567890" className="tautan">
              Hubungi pelanggan
            </a>
            {" · "}
            <Link href="/admin/pesanan" className="tautan">
              Lihat pesanan lain pelanggan ini
            </Link>
          </p>
        </section>
        <section className="kartu">
          <h2>Tahapan</h2>
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
        </section>
        <div className="grid grid-2 mulai">
          <div>
            <section className="kartu">
              <h2>Data Pesanan</h2>
              <dl className="data-baris">
                <dt>Tipe</dt>
                <dd>Avanza 2024 Matic</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Plat nomor</dt>
                <dd>Belum ditetapkan (diisi saat Serahkan unit)</dd>
                <dt>Tanggal</dt>
                <dd>10 Nov 2026 sampai 12 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>3 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>12 Nov 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Pembayaran</h2>
              <dl className="data-baris">
                <dt>Metode, status</dt>
                <dd>QRIS, lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261103-0010-PAY</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Riwayat Aktivitas</h2>
              <ol className="timeline">
                <li>
                  Pesanan dibuat oleh pelanggan<time>3 Nov 2026, 14.20</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi otomatis<time>3 Nov 2026, 14.20</time>
                </li>
              </ol>
            </section>
          </div>
          <div>
            <section className="kartu">
              <h2>Data Pelanggan</h2>
              <dl className="data-baris">
                <dt>Nama</dt>
                <dd>Siti Rahma</dd>
                <dt>WhatsApp</dt>
                <dd>0812-2222-0002</dd>
                <dt>Email</dt>
                <dd>siti@contoh.id</dd>
                <dt>Domisili</dt>
                <dd>Malang</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Rincian Biaya</h2>
              <div className="tabel-bungkus">
                <table className="tabel">
                  <tbody>
                    <tr>
                      <td>Sewa Rp 350.000 × 3 hari</td>
                      <td className="angka">Rp 1.050.000</td>
                    </tr>
                    <tr className="total">
                      <td>Total</td>
                      <td className="angka">Rp 1.050.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className="kartu">
              <h2>Catatan Admin</h2>
              <p className="ket kecil abu">Hanya terlihat oleh admin.</p>
              <form method="get">
                <label htmlFor="cat">Catatan</label>
                <textarea
                  id="cat"
                  name="catatan"
                  maxLength="500"
                  placeholder="Misalnya: bukti booking sudah dicek"
                />{" "}
                <button className="btn sm" type="submit">
                  Simpan catatan
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </HalamanAdmin>
  );
}
