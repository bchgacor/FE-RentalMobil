import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";

export const metadata = { title: "Detail RM-20261101-0004 - Admin GantengnyaJatim Group" };

export default function HalamanDetailBerjalan() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/pesanan" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>RM-20261101-0004</h1>
            <span className="abu">Dibuat pada 1 Nov 2026, 09.10</span>
          </div>
          <Badge jenis="berjalan">Berjalan</Badge>
        </div>
        <section className="kartu">
          <h2>Tindakan</h2>
          <p>Unit sedang disewa. Selesaikan pesanan lewat form pengembalian dan pemeriksaan saat unit kembali.</p>
          <div className="aksi">
            <Link href="/admin/selesaikan-pesanan" className="btn">
              Selesaikan pesanan
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
              <i className="on"></i>Berjalan
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
                <dd>Rush TRD</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Plat nomor</dt>
                <dd>
                  <Plat>N 3003 EF</Plat>
                </dd>
                <dt>Tanggal</dt>
                <dd>3 Nov 2026 sampai 5 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>3 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>5 Nov 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Pembayaran</h2>
              <dl className="data-baris">
                <dt>Metode, status</dt>
                <dd>Virtual account BCA, lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261101-0004-PAY</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Jaminan</h2>
              <dl className="data-baris">
                <dt>Dokumen</dt>
                <dd>a. KTP asli, b. SIM C asli, c. KTM, e. Bukti booking transportasi umum dan hotel</dd>
                <dt>No. identitas</dt>
                <dd>3573 0000 0000 0001</dd>
                <dt>Domisili pesanan</dt>
                <dd>Luar kota</dd>
                <dt>Status</dt>
                <dd>Dipegang admin selama sewa berjalan.</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Riwayat Aktivitas</h2>
              <ol className="timeline">
                <li>
                  Pesanan dibuat oleh pelanggan<time>1 Nov 2026, 09.10</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi otomatis<time>1 Nov 2026, 09.10</time>
                </li>
                <li>
                  Unit diserahkan (N 3003 EF) oleh Admin Rental<time>3 Nov 2026, 08.15</time>
                </li>
              </ol>
            </section>
          </div>
          <div>
            <section className="kartu">
              <h2>Data Pelanggan</h2>
              <dl className="data-baris">
                <dt>Nama</dt>
                <dd>Dimas Prakoso</dd>
                <dt>WhatsApp</dt>
                <dd>0812-3333-0003</dd>
                <dt>Email</dt>
                <dd>dimas@contoh.id</dd>
                <dt>Domisili</dt>
                <dd>Luar kota</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Rincian Biaya</h2>
              <div className="tabel-bungkus">
                <table className="tabel">
                  <tbody>
                    <tr>
                      <td>Sewa Rp 375.000 × 3 hari</td>
                      <td className="angka">Rp 1.125.000</td>
                    </tr>
                    <tr className="total">
                      <td>Total</td>
                      <td className="angka">Rp 1.125.000</td>
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
